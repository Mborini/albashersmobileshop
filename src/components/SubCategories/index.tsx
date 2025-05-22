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
import 'react-loading-skeleton/dist/skeleton.css';
const SubCategories = () => {
  const sliderRef = useRef(null);
  const [SubCategory, setSubCategory] = useState([]);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const selectedName = useSelector((state: RootState) => state.category.selectedCategoryName);
const [loading, setLoading] = useState(true);
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
      }
      finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  return (
    <>
      <Breadcrumb
        title={`Explore ${selectedName} Categories`}
        pages={["categories", "/", selectedName]}
      />
      <section className="overflow-hidden pt-17.5">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
          <div className="swiper categories-carousel common-carousel">
            {/* <!-- section title --> */}
            <div className="mb-10 flex items-end justify-end">
            {loading ? (
            ""
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={handlePrev} className="swiper-button-prev">
                  <FaChevronLeft />
                </button>

                <button onClick={handleNext} className="swiper-button-next">
                  <FaChevronRight />
                </button>
              </div>
              
            )}
            </div>
            {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-4">
           {Array.from({ length: 6 }).map((_, idx) => (
             <div key={idx} className="flex flex-col items-center gap-3">
               {/* Circle */}
               <Skeleton circle width={130} height={130} baseColor="#d1d5db" highlightColor="#f3f4f6" />
               {/* Line */}
               <Skeleton width={80} height={12} borderRadius={4} baseColor="#d1d5db" highlightColor="#f3f4f6" />
             </div>
           ))}
         </div>
            ) : (
              
            <Swiper
              ref={sliderRef}
              slidesPerView={6}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                1000: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 6,
                },
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
