import React from "react";

import { Metadata } from "next";
import BestOffersProducts from "@/components/BestOffersProducts";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

const BestOffersProductsPage = () => {
  return (
    <main>
      <BestOffersProducts />
    </main>
  );
};

export default BestOffersProductsPage;
