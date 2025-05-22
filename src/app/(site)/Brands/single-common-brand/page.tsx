"use client"
import React from "react";
import ProductBrand from "@/components/ProductBrand";


import { useSearchParams } from "next/navigation";


const ProductBrandPage = () => {
  const searchParams = useSearchParams();
  const brandId = searchParams.get('id');

  return <ProductBrand brandId={brandId} />;
};

export default ProductBrandPage;
