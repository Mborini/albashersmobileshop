import React from "react";

import { Metadata } from "next";
import NewArrivalProduct from "@/components/NewArrivalProduct";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

const NewArrivalProductPage = () => {
  return (
    <main>
      <NewArrivalProduct />
    </main>
  );
};

export default NewArrivalProductPage;
