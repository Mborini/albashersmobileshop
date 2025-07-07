import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { BsFillTrash2Fill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const SingleItem = ({ item, removeItemFromCart }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t, i18n } = useTranslation();
  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart({ id: item.id, color: item.color }));
  };
  return (
    <div
      className="flex items-center justify-between gap-5"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="w-full flex items-center gap-6">
        <div className="flex items-center justify-center rounded-[10px] bg-gray-3 max-w-[90px] w-full h-22.5">
          {item.images[0] && (
            <Image
              src={item.images[0]}
              className="object-cover"
              width={90}
              height={90}
              alt="Product image"
            />
          )}
        </div>

        <div>
          <h3 className="font-medium text-dark mb-1 ease-out duration-200 hover:text-blue">
            {item.title}
          </h3>

          {item.color && (
            <div className="text-custom-sm flex items-center gap-2 mb-1">
              <p>{t("color")}:</p>

              <span
                style={{ backgroundColor: item.color }}
                className="w-4 h-4 rounded-full cursor-pointer hover:scale-110 transition-transform"
              ></span>
            </div>
          )}
          <p className="text-custom-sm">
            {" "}
            {t("quantity")} : {item.quantity}
          </p>
          <p className="text-custom-sm">
            {" "}
            {t("price")} : JD {item.discountedPrice}
          </p>
          <p className="text-custom-sm">
            {t("total")} : JD {item.discountedPrice * item.quantity}
          </p>
        </div>
      </div>

      <button
        onClick={handleRemoveFromCart}
        aria-label="button for remove product from cart"
        className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
      >
        <FaTrashAlt color="red" size={18} />
      </button>
    </div>
  );
};

export default SingleItem;
