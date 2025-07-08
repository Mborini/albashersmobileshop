"use client";
import React from "react";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import {
  removeItemFromCart,
  selectTotalPrice,
} from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import Link from "next/link";
import EmptyCart from "./EmptyCart";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { Drawer } from "@mantine/core";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Drawer
      opened={isCartModalOpen}
      onClose={closeCartModal}
      size="md"
      padding="md"
      position="right"
      overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      withCloseButton={false}
      closeOnClickOutside={true}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-medium text-lg sm:text-2xl">{t("cart")}</h2>
        <button
          onClick={closeCartModal}
          className="text-gray-500 hover:text-black"
          aria-label="Close cart modal"
        >
          <IoCloseCircleOutline size={24} />
        </button>
      </div>

      <div className="h-[60vh] overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-6">
          {cartItems.length > 0 ? (
            cartItems.map((item, key) => (
              <SingleItem
                key={key}
                item={item}
                onRemove={(payload) => dispatch(removeItemFromCart(payload))}
              />
            ))
          ) : (
            <EmptyCart />
          )}
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="border-t border-gray-3 pt-5 mt-7.5">
          <div
            className="flex items-center justify-between gap-5 mb-6"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <p className="font-medium text-xl text-dark">{t("total")} :</p>
            <p className="font-medium text-xl text-dark">JD {totalPrice.toFixed(2)}</p>
          </div>

          <div
            className="flex items-center gap-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Link
              onClick={closeCartModal}
              href="/cart"
              className="w-full flex justify-center text-sm text-white bg-black py-[13px] px-6 rounded-md ease-out duration-200"
            >
              {t("cart_view")}
            </Link>
            <Link
              href="/checkout"
              onClick={closeCartModal}
              className="w-full flex justify-center text-sm text-white bg-black py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
            >
              {t("complete_your_order")}
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartSidebarModal;
