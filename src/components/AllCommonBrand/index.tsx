"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CommonBrandItem from "../CommonBrands/CommonBrandsItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";

const AllCommonBrandsGrid = () => {
  const [commonBrands, setCommonBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCommonBrands = async () => {
      try {
        const response = await fetch("/api/commonBrands");
        const data = await response.json();

        const priorityNames = ["apple", "anker", "belkin", "ravpower", "xiaomi","huawei", "wiwu", "joyroom", "polo","jbl","honor","akg"];
        const normalized = (str?: string) =>
          str ? str.trim().toLowerCase() : "";

        const prioritized = priorityNames
          .map((name) => {
            const found = data.find(
              (item: any) => normalized(item.name) === name
            );
            return found;
          })
          .filter(Boolean);

        const others = data.filter(
          (item: any) => !priorityNames.includes(normalized(item.name))
        );

        const sortedBrands = [
          ...prioritized,
          ...others.filter(
            (item: any) => !prioritized.some((p: any) => p.id === item.id)
          ),
        ];

        setCommonBrands(sortedBrands);
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
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* جريد ريسبونسيف */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex flex-col gap-4 ${
                      i === 0
                        ? "sm:col-span-3 lg:col-span-5 col-span-2"
                        : "col-span-1"
                    }`}
                  >
                    <Skeleton height={i === 0 ? 80 : 120} />
                    <Skeleton width={`60%`} height={14} />
                    <Skeleton width={`40%`} height={10} />
                  </div>
                ))
              : commonBrands.map((item, key) => {
                  const isApple = item.name.trim().toLowerCase() === "apple";
                  return (
                    <div
                      key={key}
                      className={`${
                        key === 0
                          ? "sm:col-span-3 lg:col-span-5 col-span-2"
                          : "col-span-1"
                      }`}
                    >
                      <CommonBrandItem
                        item={item}
                        isSmall={key === 0}
                        isApple={isApple}
                      />
                    </div>
                  );
                })}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllCommonBrandsGrid;
