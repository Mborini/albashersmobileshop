"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Hook to detect scroll direction
function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

  return scrollDirection;
}

const HeroFeature = () => {
  const { t, i18n } = useTranslation();
  const scrollDirection = useScrollDirection();

  const featureData = [
    {
      img: "/images/icons/icon-01.svg",
      title: t("free_shipping"),
      description: t("free_shipping_desc"),
    },
    {
      img: "/images/icons/icon-02.svg",
      title: t("easy_returns"),
      description: t("easy_returns_desc"),
    },
    {
      img: "/images/icons/icon-03.svg",
      title: t("secure_payments"),
      description: t("secure_payments_desc"),
    },
    {
      img: "/images/icons/icon-04.svg",
      title: t("support_247"),
      description: t("support_247_desc"),
    },
  ];

  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-6 mt-10">
        {featureData.map((item, key) => {
          // Determine animation direction
          const from =
            key < 2
              ? scrollDirection === "down"
                ? 100
                : -100
              : scrollDirection === "down"
              ? -100
              : 100;

          return (
            <motion.div
              key={key}
              className="flex items-center gap-4"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
              initial={{ opacity: 0, x: from }}
              whileInView={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: from }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.4 }}
            >
              <Image src={item.img} alt="icon" width={40} height={41} />
              <div>
                <h3 className="font-medium text-sm sm:text-base text-dark">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroFeature;
