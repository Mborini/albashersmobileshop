"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import BrandDropdown from "./BrandDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import Image from "next/image";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Empty } from "antd";
import Pagination from "../Common/pagination";
import { TextInput } from "@mantine/core";
import { IoGridOutline } from "react-icons/io5";
import { TbLayoutList } from "react-icons/tb";
const NewArrivalProduct = () => {
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [product, setProduct] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  const [stickyMenu, setStickyMenu] = useState(false);
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };
  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedPrice(null);
  };
  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetch(`/api/products/allNewArrivalProducts`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();

        setProduct(data.products);
        setBrands(data.brands);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrands, selectedPrice]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  useEffect(() => {
    let filtered = [...product];

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand_name));
    }

    if (selectedPrice) {
      filtered = filtered.filter(
        (p) => p.price >= selectedPrice.min && p.price <= selectedPrice.max
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        (p.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedBrands, selectedPrice, searchTerm, product]);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // closing sidebar while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }
    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      <Breadcrumb
        title={`Explore New Arrivals Products`}
        pages={["New Arrivals Products"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-5 xl:pt-5 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- category box --> */}
                  <BrandDropdown
                    brands={brands}
                    onBrandChange={setSelectedBrands}
                  />
                  {/* <!-- gender box --> */}

                  {/* // <!-- color box --> */}
                  <ColorsDropdwon />

                  {/* // <!-- price range box --> */}
                  <PriceDropdown onPriceChange={setSelectedPrice} />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
                  <div className="flex flex-wrap items-center gap-4">
                    <TextInput
                      variant="filled"
                      radius="md"
                      placeholder="Search products"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    />
                  </div>
                  {/* <!-- top bar right --> */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="button for product grid tab"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <IoGridOutline size={20} />
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="button for product list tab"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <TbLayoutList size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center sm:items-start gap-3"
                    >
                      <div className="relative">
                        <Skeleton
                          width={260}
                          height={260}
                          baseColor="#d1d5db"
                          highlightColor="#f3f4f6"
                          borderRadius={8}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src="/images/logo/AlbsherLOGO.png"
                            alt=""
                            className="opacity-25"
                            width={130}
                            height={130}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <Skeleton
                          width={80}
                          height={12}
                          borderRadius={4}
                          baseColor="#d1d5db"
                          highlightColor="#f3f4f6"
                        />
                        <Skeleton
                          width={130}
                          height={12}
                          borderRadius={4}
                          baseColor="#d1d5db"
                          highlightColor="#f3f4f6"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !filteredProducts.length ? (
                <div className="flex items-center justify-center mt-36 w-full h-40">
                  <Empty description="لا توجد نتائج حالياً. حاول مرة أخرى." />
                </div>
              ) : (
                <div
                  className={`${
                    productStyle === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                      : "flex flex-col gap-7.5"
                  }`}
                >
                  {paginatedProducts.map((item, key) =>
                    productStyle === "grid" ? (
                      <SingleGridItem item={item} key={key} />
                    ) : (
                      <SingleListItem item={item} key={key} />
                    )
                  )}
                </div>
              )}

              {/* <!-- Products Grid Tab Content End --> */}
              {filteredProducts.length ? (
                <>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </>
              ) : (
                ""
              )}
            </div>         
          </div>
        </div>
      </section>
    </>
  );
};

export default NewArrivalProduct;
