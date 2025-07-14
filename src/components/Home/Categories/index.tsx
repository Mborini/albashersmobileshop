"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // 👈 استيراد Autoplay
import { useCallback, useRef, useEffect, useState } from "react";
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";
import { BiCategory } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import HeroFeature from "../Hero/HeroFeature";

const Categories = () => {
  const sliderRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const priorityNames = ["apple", "anker", "huawei", "wiwu"];

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
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const sortedCategories = [...categories].sort((a, b) => {
    const aIndex = priorityNames.indexOf(a.name.toLowerCase());
    const bIndex = priorityNames.indexOf(b.name.toLowerCase());

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    } else if (aIndex !== -1) {
      return -1;
    } else if (bIndex !== -1) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <section className="overflow-hidden pt-5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="swiper categories-carousel common-carousel">
          <div
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            className="mb-10 flex items-center justify-between"
          >
            <div>
              <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                <BiCategory className="text-2xl text-dark" size={20} />
                <motion.p
                  className="text-2xl"
                  initial={{
                    opacity: 0,
                    x: i18n.language === "ar" ? 100 : -100,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: false, amount: 0.3 }}
                >
                  {t("product_categories")}
                </motion.p>
              </span>
            </div>
            {loading ? (
              ""
            ) : (
              <div className="flex items-center gap-2" dir="ltr">
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
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-4">
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
          ) : (
            <Swiper
              ref={sliderRef}
              slidesPerView={3}
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                0: { slidesPerView: 3 }, // ✅ موبايل: 3 عناصر
                640: { slidesPerView: 3 }, // تابلت صغير
                1000: { slidesPerView: 4 }, // شاشات متوسطة
                1200: { slidesPerView: 5 }, // شاشات كبيرة
              }}
            >
              {sortedCategories.map((item, key) => (
                <SwiperSlide key={key}>
                  <SingleItem item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
      <HeroFeature />
    </section>
  );
};

export default Categories;
