"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import { useTranslation } from "react-i18next";

export const Wishlist = () => {
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const { t, i18n } = useTranslation();
  return (
    <>
      <Breadcrumb title={t("favorit")} pages={["Wishlist"]} />
      <section
        className="overflow-hidden py-20 bg-gray-2 mb-24 "
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
         

          <div className="bg-white rounded-[10px] shadow-1">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1170px] mx-auto max-w-full">
                {/* <!-- table header --> */}
                <div className=" bg-black rounded-t-lg text-white flex items-center justify-center gap-10 py-5.5 px-10">
                  {/* Column: Remove Button */}
                  <div className="min-w-[83px]"></div>

                  {/* Column: Image */}
                  <div className="min-w-[100px]">
                    <p >{t("image")}</p>
                  </div>

                  {/* Column: Product Info */}
                  <div className="min-w-[287px]">
                    <p >{t("product")}</p>
                  </div>

                  {/* Column: Price */}
                  <div className="min-w-[205px]">
                    <p >{t("price")}</p>
                  </div>

                  {/* Column: Action */}
                  <div className="min-w-[150px]">
                    <p className="text-right">{t("action")}</p>
                  </div>
                </div>

                {/* <!-- wish item --> */}
                {wishlistItems.map((item, key) => (
                  <SingleItem item={item} key={key} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
