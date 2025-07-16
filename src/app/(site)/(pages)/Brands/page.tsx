import React from "react";
import AllCommonBrandsGrid from "@/components/AllCommonBrand";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Al-Basher Shop -  العلامات التجارية",
  description: "استعرض جميع العلامات التجارية المتوفرة في Al-Basher Shop. تسوق لأجهزة iPhone واكسسواراتها من أفضل الماركات.",
  keywords: [
    "العلامات التجارية",
    "أجهزة iPhone",
    "اكسسوارات الهواتف",
    "متجر البشير شوب",
    "Al-Basher Shop",
    "تسوق عبر الإنترنت",
    "ماركات أصلية",
    "منتجات أصلية",
    "توصيل سريع",
    "أفضل الماركات",
    "Apple",
    "Anker",
    "Google",
    "Samsung",
    "Sony",
    "Huawei",
    "Xiaomi",
    "Oppo",
    "OnePlus",
    "Realme",
    "Motorola",
    "LG",
    "Nokia",
    "HTC",
    "Lenovo",
    "Asus",
    "ZTE",
    "Vivo",
    "Al-Basher iPhone Store",
  ],
  openGraph: {
    title: "Al-Basher Shop - العلامات التجارية",
    description: "استعرض جميع العلامات التجارية المتوفرة في Al-Basher Shop. تسوق لأجهزة iPhone واكسسواراتها من أفضل الماركات.",
    url: "https://albasheershop.com/Brands",
    siteName: "Al-Basher Shop",
    images: [
      {
        url: "https://albasher.shop/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Al-Basher Shop - العلامات التجارية",
      },
    ],
  },
};

const CommonBrandPage = () => {
  return (
    <main>
      <AllCommonBrandsGrid />
    </main>
  );
};

export default CommonBrandPage;
