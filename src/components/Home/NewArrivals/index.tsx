"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ProductItem from "@/components/Common/ProductItem";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { MdOutlineStarOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

const SkeletonProductItem = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <Skeleton
        width={230}
        height={210}
        baseColor="#d1d5db"
        highlightColor="#f3f4f6"
      />
      <Skeleton
        width={100}
        height={12}
        borderRadius={4}
        baseColor="#d1d5db"
        highlightColor="#f3f4f6"
      />
    </div>
  );
};

const NewArrival = () => {
  const [newArrivalProduct, setNewArrival] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchNewArrivalProduct = async () => {
      try {
        const response = await fetch("/api/products/newArrivalProduct");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setNewArrival(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivalProduct();
  }, []);

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section title with animated background */}
        <div
          className="relative w-full min-h-[80px] rounded-xl p-5 mb-8 overflow-hidden"
          style={{
            backgroundColor: "#F5F5F7",
            backgroundSize: "cover, 600% 600%",
            backgroundBlendMode: "overlay",
            animation: "gradientShift 5s ease infinite",
          }}
        >
          <div
            className="relative z-10 flex items-center justify-between"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <motion.div
              initial={{ opacity: 0, x: i18n.language === "ar" ? 100 : -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ amount: 0.3 }}
            >
              <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                <MdOutlineStarOutline color="orange" size={25} />
                {t("this_week")}
              </span>
              <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                {t("new_arrivals")}
              </h2>
            </motion.div>

            {/* هنا الأنيميشن على الكبسة */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ amount: 0.3 }}
            >
              <Link
                href="/new-arrivals-products"
                className="inline-flex font-medium text-custom-sm px-4 py-1 sm:py-2.5 sm:px-4 md:px-6 xl:px-7 rounded-md border border-gray-3 ease-out duration-200 bg-black text-white hover:border-transparent"
              >
                {t("view_all")}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <SkeletonProductItem key={i} />
              ))
            : Array.isArray(newArrivalProduct) &&
              newArrivalProduct.map((item, key) => (
                <ProductItem item={item} key={key} />
              ))}
        </div>
      </div>

      {/* Global animation keyframes */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  );
};

export default NewArrival;
