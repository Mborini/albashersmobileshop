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
    <div className="flex items-center border-t border-gray-3 py-5 px-10">
      <div className="min-w-[83px]">
        <button
          onClick={() => handleRemoveFromWishlist()}
          aria-label="button for remove product from cart"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <FaTrashAlt color="red" size={18} />
        </button>
      </div>

      <div className="min-w-[387px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5">
              <Image
                src={item.images[0]}
                alt="product"
                width={200}
                height={200}
              />
            </div>

            <div>
              <h3 className="text-dark ease-out duration-200 hover:text-blue">
                <a href="#"> {item.title} </a>
                {item.color && (
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-sm text-gray-600">
                      {t("color")} :
                    </span>
                    <div
                      className="w-3 h-3 rounded-full border border-gray-300 "
                      style={{ backgroundColor: item.color }}
                      title={item.color}
                    ></div>
                  </div>
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-[205px]">
        <p className="text-dark">JOD {item.discountedPrice}</p>
      </div>

      <div className="min-w-[150px] flex justify-end">
        <button
          onClick={() => handleAddToCart()}
          className="inline-flex text-dark hover:text-white bg-gray-1 border border-gray-3 py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue hover:border-gray-3"
        >
          {t("add_to_cart")}
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
