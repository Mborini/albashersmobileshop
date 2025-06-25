"use client";
import React, { useEffect, useState } from "react";

import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import {
  removeItemFromCart,
  selectTotalPrice,
} from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import SingleItem from "./SingleItem";
import Link from "next/link";
import EmptyCart from "./EmptyCart";
import { MdFreeCancellation } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  const totalPrice = useSelector(selectTotalPrice);
  const { i18n, t } = useTranslation();
  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeCartModal();
      }
    }

    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen, closeCartModal]);

  return (
    <div
      className={`fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full h-screen bg-dark/70 ease-linear duration-300 ${
        isCartModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-end">
        <div className="w-full max-w-[500px] shadow-1 bg-white px-4 sm:px-7.5 lg:px-11 relative modal-content">
          <div className="sticky top-0 bg-white flex items-center justify-between pb-7 pt-4 sm:pt-7.5 lg:pt-11 border-b border-gray-3 mb-7.5">
            <h2 className="font-medium text-dark text-lg sm:text-2xl">
              {t("cart")} {/* Cart Title */}
            </h2>
            <button
              onClick={() => closeCartModal()}
              aria-label="button for close modal"
              className="flex items-center justify-center ease-in duration-150 text-dark-5 hover:text-dark"
            >
              <IoCloseCircleOutline color="gray" size={24} />
            </button>
          </div>

          <div className="h-[66vh] overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-6">
              {/* <!-- cart item --> */}
              {cartItems.length > 0 ? (
                cartItems.map((item, key) => (
                  <SingleItem
                    key={key}
                    item={item}
                    removeItemFromCart={removeItemFromCart}
                  />
                ))
              ) : (
                <EmptyCart />
              )}
            </div>
          </div>

          <div className="border-t border-gray-3 bg-white pt-5 pb-4 sm:pb-7.5 lg:pb-11 mt-7.5 sticky bottom-0">
            <div
              className="flex items-center justify-between gap-5 mb-6"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <p className="font-medium text-xl text-dark">{t("total")} :</p>

              <p className="font-medium text-xl text-dark">JOD {totalPrice}</p>
            </div>

            <div
              className="flex items-center gap-4"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <Link
                onClick={() => closeCartModal()}
                href="/cart"
                className="w-full flex justify-center text-sm text-white bg-blue py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                {t("cart_view")}
              </Link>
              <Link
                href={cartItems.length === 0 ? "#" : "/checkout"}
                onClick={(e) => {
                  if (cartItems.length === 0) {
                    e.preventDefault();
                    return;
                  }
                  closeCartModal();
                }}
                className={`w-full flex justify-center text-sm text-white py-[13px] px-6 rounded-md ease-out duration-200 ${
                  cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                    : "bg-dark hover:bg-opacity-95"
                }`}
              >
                {t("complete_your_order")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarModal;
