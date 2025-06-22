import React from "react";
import SubCategories from "@/components/SubCategories";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Al-Basher Shop",
  description:
    "أفضل متجر في إربد لبيع أجهزة iPhone الأصلية، اكسسوارات الهواتف، ساعات آبل، شواحن أصلية، وصلات شحن، ملحقات آيباد، منتجات جيروم، أنكر، جوجل وغيرها من أفضل العلامات التجارية. تسوق الآن مع توصيل سريع وخدمة مميزة في الأردن.",

};
const SubCategoriesPage = () => {
  return (
  <main>
    <SubCategories />
  </main>
    );

};

export default SubCategoriesPage;
