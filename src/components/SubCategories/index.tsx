"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import "swiper/css/navigation";
import "swiper/css";
import SingleSubCategory from "./SingleSubCategory";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

const SubCategories = () => {
  const sliderRef = useRef(null);
  const [SubCategory, setSubCategory] = useState([]);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const selectedName = useSelector(
    (state: RootState) => state.category.selectedCategoryName
  );
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.swiper.init();
    }
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setSubCategory(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [categoryId]);

 

return (
  <>
    <Breadcrumb
      title={`${t("explore_subcategories_of")} ${selectedName}`}
      pages={["categories", "/", selectedName]}
    />
    <section
      className="overflow-hidden pt-4"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-[1170px] w-full mt-2 mx-auto px-4 sm:px-8 xl:px-0 pb-15 ">
        <div className="categories-carousel common-carousel">

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-6 mt-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 animate-pulse"
                >
                  <div className="w-[130px] h-[130px] rounded-full bg-gray-300 overflow-hidden">
                    <Skeleton
                      circle={true}
                      width="100%"
                      height="100%"
                      baseColor="#d1d5db"
                      highlightColor="#f3f4f6"
                    />
                  </div>
                  <Skeleton
                    width={80}
                    height={16}
                    borderRadius={6}
                    baseColor="#d1d5db"
                    highlightColor="#f3f4f6"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-6 mt-5">
              {SubCategory.map((item, key) => (
                <SingleSubCategory key={key} item={item} />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  </>
);

};

export default SubCategories;
