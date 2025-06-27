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
          <div className="swiper categories-carousel common-carousel">
            {!loading && !isMobile ? (
              <div className="mb-10 flex items-end justify-end">
                <div className="flex items-center gap-3" dir="ltr">
                <button
                  onClick={handlePrev}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-black border border-black rounded-md text-white transition-all duration-300 hover:bg-white hover:text-black"
                >
                  <FaChevronLeft className="text-xs sm:text-sm" />
                </button>

                <button
                  onClick={handleNext}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-black border border-black rounded-md text-white transition-all duration-300 hover:bg-white hover:text-black"
                >
                  <FaChevronRight className="text-xs sm:text-sm" />
                </button>
                </div>
              </div>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 mt-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    <Skeleton
                      width={130}
                      height={130}
                      baseColor="#d1d5db"
                      highlightColor="#f3f4f6"
                    />
                    <Skeleton
                      width={80}
                      height={12}
                      borderRadius={4}
                      baseColor="#d1d5db"
                      highlightColor="#f3f4f6"
                    />
                  </div>
                ))}
              </div>
            ) : isMobile ? (
              <div className="grid grid-cols-2 gap-4">
                {SubCategory.map((item, key) => (
                  <div key={key}>
                    <SingleSubCategory item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <Swiper
                ref={sliderRef}
                slidesPerView={5}
                breakpoints={{
                  0: { slidesPerView: 3 },
                  1000: { slidesPerView: 4 },
                  1200: { slidesPerView: 6 },
                }}
              >
                {SubCategory.map((item, key) => (
                  <SwiperSlide key={key}>
                    <SingleSubCategory item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SubCategories;
