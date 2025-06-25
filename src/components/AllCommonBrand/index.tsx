'use client';
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CommonBrandItem from "../CommonBrands/CommonBrandsItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";

const AllCommonBrandsGrid = () => {
  const [commonBrands, setCommonBrands] = useState([]);
  const [loading, setLoading] = useState(true);
const {t,i18n}= useTranslation();
  useEffect(() => {
    const fetchCommonBrands = async () => {
      try {
        const response = await fetch("/api/commonBrands");
        const data = await response.json();
        setCommonBrands(data);
      } catch (error) {
        console.error("Error fetching common brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommonBrands();
  }, []);

  return (
    <>
      <Breadcrumb title={t("common_Brands")} pages={["Common Brands"]} />
      <section className="overflow-hidden py-20 bg-gray-2" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-7.5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <Skeleton height={200} />
                    <Skeleton width={`60%`} height={20} />
                    <Skeleton width={`40%`} height={16} />
                  </div>
                ))
              : commonBrands.map((item, key) => (
                  <CommonBrandItem item={item} key={key} />
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllCommonBrandsGrid;
