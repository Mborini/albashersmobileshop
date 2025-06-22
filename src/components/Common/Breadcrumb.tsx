import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const Breadcrumb = ({ title, pages }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="overflow-hidden shadow-breadcrumb pt-14 sm:pt-[155px] lg:pt-[95px] xl:pt-15" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="border-t border-gray-3">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-4 xl:px-6 py-4 xl:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2">
              {title}
            </h3>

            <ul className="flex items-center gap-2" dir="ltr">
              <li className="text-custom-sm hover:text-blue">
                <Link href="/">Home /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li className="text-custom-sm last:text-blue capitalize" key={key}>
                    {page} 
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
