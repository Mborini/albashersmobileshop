"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CommonBrandItem from "../CommonBrands/CommonBrandsItem";
import ViewProductBrand from "./ViewProductsBrand";

const ProductBrand = ({ brandId }) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!brandId) return;

    const fetchProducts = async () => {
      const response = await fetch(`/api/products-by-brand/${brandId}`);
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, [brandId]);
  

  return (
    <>
      <Breadcrumb title={"Blog Grid Sidebar"} pages={["blog grid sidebar"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
  <div className="w-full mx-auto px-4 sm:px-8 xl:px-0 flex justify-center">
    {/* Center content container with max width */}
    <div className="lg:w-2/3 w-full max-w-7xl">
      <ViewProductBrand products={products} />
    </div>
  </div>
</section>

    </>
  );
};

export default ProductBrand;
