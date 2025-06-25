import React from "react";
import AllCommonBrandsGrid from "@/components/AllCommonBrand";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog Grid Page | NextCommerce Nextjs E-commerce template",
  description: "This is Blog Grid Page for NextCommerce Template",
  // other metadata
};

const CommonBrandPage = () => {
  return (
    <main>
      <AllCommonBrandsGrid />
    </main>
  );
};

export default CommonBrandPage;
