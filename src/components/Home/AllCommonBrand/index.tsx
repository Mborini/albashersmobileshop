"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import i18n from "@/app/lib/i18n";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";

interface Brand {
  id: number;
  name: string;
  image: string;
  title: string;
  [key: string]: any;
}

const HomeCommonBrandsGrid = () => {
  const [commonBrands, setCommonBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCommonBrands = async () => {
      try {
        const response = await fetch("/api/commonBrands");
        const data = await response.json();

        const priorityNames = [
          "apple",
          "anker",
          "belkin",
          "ravpower",
          "xiaomi",
          "huawei",
          "wiwu",
          "joyroom",
          "polo",
          "jbl",
          "honor",
          "akg",
        ];

        const normalized = (str?: string) =>
          str ? str.trim().toLowerCase() : "";

        const prioritized = priorityNames
          .map((name) =>
            data.find(
              (item: Brand) => normalized(item.name) === name
            )
          )
          .filter(Boolean);

        const others = data.filter(
          (item: Brand) =>
            !priorityNames.includes(normalized(item.name))
        );

        const sortedBrands = [
          ...prioritized,
          ...others.filter(
            (item: Brand) =>
              !prioritized.some((p: Brand) => p?.id === item.id)
          ),
        ];

        setCommonBrands(sortedBrands);
      } catch (error) {
        console.error("Error fetching common brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommonBrands();
  }, []);

  return (
    <section className="overflow-hidden pt-5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-300">

       <div
  dir={i18n.language === "ar" ? "rtl" : "ltr"}
  className="my-10 flex justify-center"
>

          <h2 className="text-2xl font-bold text-center">
  {t("common_Brands") || "Common Brands"}
</h2>

        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 my-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={100} />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={2}
            slidesPerView={6}
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {commonBrands.slice(0, 10).map((item) => (
              <SwiperSlide key={item.id}>
                <Link href={`/ProductsBrands/${item.id}`}>
                  <div className="flex justify-center items-center">

                    {/* دائرة ثابتة الحجم */}
                    <div className="w-[100px] h-[100px] sm:w-[90px] sm:h-[90px] rounded-full bg-gray-100 flex items-center justify-center ">

                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />

                    </div>

                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className="text-center mt-8">
          <Link
            href="/brands"
            className="inline-block px-6 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            {t("view_all") || "مشاهدة الكل"}
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HomeCommonBrandsGrid;
