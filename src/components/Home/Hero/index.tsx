"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProducts } from "@/components/Admin/managment/images/services/adsServices";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { useTranslation } from "react-i18next";
import { Badge } from "@mantine/core";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);

const shake = {
  animate: {
    x: [0, -3, 3, -3, 3, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
    },
  },
};
  useEffect(() => {
    const loadAds = async () => {
      try {
        const data = await fetchProducts();
        setAds(data.products);
      } catch (error) {
        console.error("Error loading ads:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, []);

  if (loading) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-[1170px] mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={350} borderRadius={10} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white">
     <div className="max-w-[1170px] mx-auto px-4 mb-6 flex justify-center">
<motion.div>
  <Badge
    size="xl"
    radius="xl"
    variant="gradient"
    gradient={{ from: "red", to: "orange" }}
  >
    {t("super_sales")}
  </Badge>
</motion.div>

  </div>
      <div className="max-w-[1170px] mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-5">
        {ads.map((item) => (
          <Link href={`/products/${item.id}`} key={item.id}>
          <div

            className="aspect-square cursor-pointer rounded-[10px] bg-[#F5F5F7] p-4 flex flex-col justify-between items-center text-center hover:shadow-md transition"
          >
            {/* العنوان */}
            <div className="min-h-[48px] flex items-center justify-center">
              <h2 className="font-semibold text-black text-md">{item.title}</h2>
            </div>

            {/* الصورة */}
            <div className="w-full h-[120px] flex justify-center items-center">
              <Image
                src={item.images?.[0]}
                alt={item.title}
                width={120}
                height={120}
                className="w-full h-full object-contain"
              />
            </div>

            {/* السعر */}
            <div className="mt-auto">
              <span className="flex items-center gap-3 justify-center">
                <span className="font-medium text-xl text-black">
                  JD {item.discountedPrice}
                </span>
                {Number(item.discountedPrice) !== Number(item.price) && (
                  <span className="font-medium text-lg text-gray-500 line-through">
                    JD {item.price}
                  </span>
                )}
              </span>
            </div>
          </div></Link>
        ))}
      </div>
    </section>
  );
};

export default Hero;
