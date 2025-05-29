import React from "react";

import { Metadata } from "next";
import BestSellerProduct from "@/components/BestSellerProduct";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

const BestSellerProductPage = () => {
  return (
    <main>
      <BestSellerProduct />
    </main>
  );
};

export default BestSellerProductPage;
