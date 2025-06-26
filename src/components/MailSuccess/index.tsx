import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const EmptyCart = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <section className="overflow-hidden bg-gray-2" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              <h2 className="font-bold text-blue text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
                {t("message1")}
              </h2>
              <p className="font-medium text-gray-7 text-xl sm:text-2xl mb-3">
                {t("message3")}{" "}
              </p>
              <p className="font-medium text-gray-7  text-xl sm:text-2xl mb-3">
                {t("message4")}
              </p>

              <h3 className="font-medium text-gray-7  text-xl sm:text-2xl mb-3">
                {t("message2")}
              </h3>
              <h3 className="font-medium text-gray-7  text-xl sm:text-2xl mb-3">
                {t("message5")}
              </h3>


              <Link
                href={{ pathname: "/", query: { focus: "categories" } }}
                className="inline-flex items-center gap-2 mt-5 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
               
                {t("continue_shopping")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmptyCart;
