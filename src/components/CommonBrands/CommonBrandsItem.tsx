import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const CommonBrandItem = ({ item }: { item: CommonBrandItem }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="shadow-1 bg-white rounded-xl px-4 sm:px-5 pt-5 pb-4">
      <Link href={`/ProductsBrands/${item.id}`}>
        <Image
          src={item.image}
          alt="brand"
          className="rounded-md w-full"
          width={330}
          height={210}
        />

        <div className="mt-5.5 text-center">
          <span className="flex items-center justify-center gap-3 mb-2.5">
            {item.name}
          </span>

          <h2 className="font-medium text-dark text-lg sm:text-xl ease-out duration-200 mb-4 hover:text-blue w-full text-center">
            {item.title}
          </h2>

          <span className="text-blue font-semibold">{t("shop_now")}</span>
        </div>
      </Link>
    </div>
  );
};

export default CommonBrandItem;
