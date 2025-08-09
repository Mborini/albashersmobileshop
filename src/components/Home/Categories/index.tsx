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
            
          </div>

   {loading ? (
  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-6">
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
  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
    {sortedCategories.map((item, key) => (
      <SingleItem key={key} item={item} />
    ))}
  </div>
)}


        </div>
      </div>
      <HeroFeature />
    </section>
  );
};

export default Categories;
