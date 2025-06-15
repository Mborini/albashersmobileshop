"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";

import shopData from "../Shop/shopData";
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
import BrandDropdown from "../Products/BrandDropdown";
import ColorsDropdwon from "../Products/ColorsDropdwon";
import PriceDropdown from "../Products/PriceDropdown";
import CustomSelect from "../Header/Search";
import SingleListProductBrand from "./SingleListProductBrand";

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  subcategory_id: number;
  brand_id: number;
  created_at: string; // أو Date إذا تم تحويله
  discountedPrice: number;
}

interface Props {
  products: Product[];
}

const ViewProductBrand: React.FC<Props> = ({ products }) => {
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [productList, setProductList] = useState<Product[]>(products || []);
  const [selectedPrice, setSelectedPrice] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stickyMenu, setStickyMenu] = useState(false);

  const searchParams = useSearchParams();
  const subCategoryId = searchParams.get("subCategoryId");
  const selectedName = useSelector(
    (state: RootState) => state.subCategory.selectedSubCategoryName
  );

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };
  useEffect(() => {
    setProductList(products || []);
  }, [products]);
  
  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  // Fetch products when subCategoryId changes

  // Scroll event for sticky menu
  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  // Click outside sidebar closes sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);

  return (
    <>
      
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-5 xl:pt-5 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* Sidebar */}
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
                {/* SVG icon */}
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* ...paths */}
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* Filter box */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <button
                        type="button"
                        className="text-blue"
                        onClick={() => {
                          setSelectedPrice(null);
                          // هنا يمكن إضافة المزيد لمسح باقي الفلاتر
                        }}
                      >
                        Clean All
                      </button>
                    </div>
                  </div>
                  {/* يمكن اضافة باقي الفلاتر هنا */}
                </div>
              </form>
            </div>
            {/* Content */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* Left side */}
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} />

                    <p>
                      Showing{" "}
                      <span className="text-dark">
                        {productList.length} Products
                      </span>
                    </p>
                  </div>

                  {/* Right side */}
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
                      {/* SVG icon for grid */}
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
                      {/* SVG icon for list */}
                    </button>
                  </div>
                </div>
              </div>

              {/* عرض المنتجات */}

              {/* عرض المنتجات */}
<div className={productStyle === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
  {productList.map((product) =>
    productStyle === "grid" ? (
      <SingleListProductBrand key={product.id} item={product} />
    ) : (
      <SingleListProductBrand key={product.id} item={product} />
    )
  )}
</div>


              {/* إضافة Pagination لو مطلوب */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewProductBrand;
