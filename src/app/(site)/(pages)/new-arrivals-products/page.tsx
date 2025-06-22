import React from "react";

import { Metadata } from "next";
import NewArrivalProduct from "@/components/NewArrivalProduct";
export const metadata: Metadata = {
  title: "Al-Basher Shop",
  description:
    "أفضل متجر في إربد لبيع أجهزة iPhone الأصلية، اكسسوارات الهواتف، ساعات آبل، شواحن أصلية، وصلات شحن، ملحقات آيباد، منتجات جيروم، أنكر، جوجل وغيرها من أفضل العلامات التجارية. تسوق الآن مع توصيل سريع وخدمة مميزة في الأردن.",

};

const NewArrivalProductPage = () => {
  return (
    <main>
      <NewArrivalProduct />
    </main>
  );
};

export default NewArrivalProductPage;
