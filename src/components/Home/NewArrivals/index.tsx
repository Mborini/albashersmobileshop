"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ProductItem from "@/components/Common/ProductItem";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { MdOutlineStarOutline } from "react-icons/md";

const SkeletonProductItem = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <Skeleton width={230} height={210} baseColor="#d1d5db" highlightColor="#f3f4f6" />
      <Skeleton width={100} height={12} borderRadius={4} baseColor="#d1d5db" highlightColor="#f3f4f6" />
    </div>
  );
};

const NewArrival = () => {
  const [newArrivalProduct, setNewArrival] = useState([]);
  const [loading, setLoading] = useState(true);

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
        {/* Section title with animated gradient + background image */}
        <motion.div
          className="relative w-full min-h-[80px] rounded-xl p-5 mb-8 overflow-hidden"
          style={{
            backgroundImage: `
              url('/images/shapes/newsletter-bg.jpg'),
              linear-gradient(270deg, #0d47a1, #1976d2, #42a5f5, #1976d2, #0d47a1)
            `,
            backgroundSize: "cover, 600% 600%",
            backgroundBlendMode: "overlay",
            animation: "gradientShift 5s ease infinite",
          }}
        >
          {/* Optional dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30 z-0 rounded-xl" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-white mb-1.5">
                <MdOutlineStarOutline color="orange" size={25} />
                This Week’s
              </span>
              <h2 className="font-semibold text-xl xl:text-heading-5 text-white">New Arrivals</h2>
            </div>

            <Link
              href="/new-arrivals-products"
              className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
            >
              View All
            </Link>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonProductItem key={i} />)
            : Array.isArray(newArrivalProduct) &&
              newArrivalProduct.map((item, key) => <ProductItem item={item} key={key} />)}
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
