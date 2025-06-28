import React from "react";
import Link from "next/link";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { useTranslation } from "react-i18next";

const EmptyCart = () => {
  const { closeCartModal } = useCartModalContext();
const {t} = useTranslation();
 return (
    <div className="text-center">
      <div className="mx-auto pb-7.5">
      
      </div>

      <p className="pb-6">
        {t("Your_cart_is_empty")} {/* Your cart is empty message */}
      </p>

      <Link
        onClick={() => closeCartModal()}
        href={{ pathname: "/", query: { focus: "categories" } }}

        className="w-full lg:w-10/12 mx-auto flex justify-center font-medium text-white bg-black py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
      >
        {t("continue_shopping")} {/* Continue Shopping button */}
      </Link>
    </div>
  );
};

export default EmptyCart;