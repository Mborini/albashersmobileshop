import React from "react";
import SubCategories from "@/components/SubCategories";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};
const SubCategoriesPage = () => {
  return (
  <main>
    <SubCategories />;
  </main>
    );

};

export default SubCategoriesPage;
