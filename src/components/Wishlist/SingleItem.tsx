import React from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

import { removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";

import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const SingleItem = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const handleRemoveFromWishlist = () => {
    dispatch(removeItemFromWishlist({ id: item.id, color: item.color }));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
        color: item.color,
      })
    );
  };

  return (
    <div className="flex items-center justify-center gap-10 border-t border-gray-3 py-5 px-10">
      {/* Remove Button */}
      <div className="min-w-[83px]">
        <button
          onClick={handleRemoveFromWishlist}
          aria-label="remove from wishlist"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <FaTrashAlt color="red" size={18} />
        </button>
      </div>

      {/* Image */}
      <div className="min-w-[100px]">
        <div className="flex items-center justify-center rounded-[5px] max-w-[80px] w-full h-17.5">
          <Image
            src={item.images[0]}
            alt="product"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="min-w-[287px]">
        <h3 className="text-dark">{item.title}</h3>
        {item.color && (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-sm text-gray-600">{t("color")}:</span>
            <div
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: item.color }}
              title={item.color}
            ></div>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="min-w-[205px]">
        <p className="text-dark">JD {item.discountedPrice}</p>
      </div>

      {/* Action Button */}
      <div className="min-w-[150px] flex justify-center">
        <button
          onClick={handleAddToCart}
          className="inline-flex text-white bg-black border border-gray-3 py-2.5 px-6 rounded-md ease-out duration-200 hover:border-gray-3"
        >
          {t("add_to_cart")}
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
