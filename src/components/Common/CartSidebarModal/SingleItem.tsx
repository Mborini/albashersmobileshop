"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";
import { CartItem } from "@/redux/features/cart-slice"; // استيراد النوع الصحيح

interface Props {
  item: CartItem;
  onRemove: (payload: Pick<CartItem, "id" | "color">) => void;
}

const SingleItem: React.FC<Props> = React.memo(({ item, onRemove }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const handleRemoveFromCart = () => {
    onRemove({ id: item.id, color: item.color });
  };

  return (
    <div className="flex items-center justify-between gap-5" dir={isRTL ? "rtl" : "ltr"}>
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
                className="w-4 h-4 rounded-full cursor-pointer border-2  hover:scale-110 transition-transform"
              />
            </div>
          )}

          <p className="text-custom-sm">{t("quantity")} : {item.quantity}</p>
          <p className="text-custom-sm"> {t("price")} : JD {item.discountedPrice.toFixed(2)}</p>
          <p className="text-custom-sm">
            {t("total")} : JD {(item.discountedPrice * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={handleRemoveFromCart}
        aria-label="Remove product from cart"
        title={t("remove_item")}
        className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
      >
        <FaTrashAlt color="red" size={18} />
      </button>
    </div>
  );
});

export default SingleItem;
