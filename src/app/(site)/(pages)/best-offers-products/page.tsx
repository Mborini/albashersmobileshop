import React from "react";

import { Metadata } from "next";
import BestOffersProducts from "@/components/BestOffersProducts";
export const metadata: Metadata = {
  title: "Al-Basher Shop - أفضل العروض والمنتجات",
  keywords: [
    "أفضل العروض",
    "منتجات مميزة",
    "تسوق عبر الإنترنت",
    "عروض خاصة",
    "منتجات أصلية",
    "توصيل سريع",
    "خصومات",
    "أجهزة iPhone",
    "اكسسوارات الهواتف",
    "ساعات آبل",
    "شواحن أصلية",
    "وصلات شحن",
    "ملحقات آيباد",
  ],
  description:
    "اكتشف أفضل العروض والمنتجات المميزة في Al-Basher Shop. تسوق عبر الإنترنت لأجهزة iPhone الأصلية واكسسواراتها، مع توصيل سريع وخدمة احترافية.",
  openGraph: {
    title: "Al-Basher Shop - أفضل العروض والمنتجات",
    description:
      "اكتشف أفضل العروض والمنتجات المميزة في Al-Basher Shop. تسوق عبر الإنترنت لأجهزة iPhone الأصلية واكسسواراتها، مع توصيل سريع وخدمة احترافية.",
    url: "https://albasher.shop/best-offers-products",
    siteName: "Al-Basher Shop",
    images: [
      {
        url: "https://albasher.shop/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Al-Basher Shop - أفضل العروض والمنتجات",
      },
    ],
  },
};

const BestOffersProductsPage = () => {
  return (
    <main>
      <BestOffersProducts />
    </main>
  );
};

export default BestOffersProductsPage;
