"use client";
import React, { useRef, useState } from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { CiNoWaitingSign } from "react-icons/ci";
import { Badge } from "@mantine/core";
import { IoEyeOutline } from "react-icons/io5";
import { MdFavoriteBorder } from "react-icons/md";
import { useTranslation } from "react-i18next";
import FlyingImage from "../Common/FlyingImage";
import toast from "react-hot-toast";

const SingleListItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isOutOfStock = !item.in_stock;
  const buttonLabel = isOutOfStock ? t("out_of_stock") : t("add_to_cart");
  const buttonClasses = `
  inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px]
  ${
    isOutOfStock
      ? "bg-red-light cursor-not-allowed"
      : "bg-black hover:bg-gray-800"
  }
  text-white ease-out duration-200
`;

  const handleMouseEnter = () => {
    if (item.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentImageIndex(0);
  };

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        discountedPrice: item.discountedPrice ?? item.price,
        quantity: 1,
        color: selectedColor ?? item.colors?.[0]?.hex_code ?? "",
        images: item.images ?? [],
        brandId: item.brand_id,
        brandName: item.brand_name,
      })
    );
    toast.success(t("added_to_cart", { itemName: item.title }), {
      duration: 4000,
      style: {
        direction: "ltr",
      },
    });
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        id: item.id,
        title: item.title,
        price: item.price,
        discountedPrice: item.discountedPrice ?? item.price,
        quantity: 1,
        color: selectedColor ?? item.colors?.[0]?.hex_code ?? "",
        images: item.images ?? [],
        status: "available",
      })
    );
  };

  return (
    <div className="group rounded-lg bg-white shadow-1 relative">
      <div dir="ltr" className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div
          className="shadow-list relative overflow-hidden flex items-center justify-center w-full sm:max-w-[270px] sm:min-h-[270px] h-[270px] bg-gray-100"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {item.images[currentImageIndex] && (
            <Image
              src={item.images[currentImageIndex]}
              className="object-cover"
              width={270}
              height={270}
              alt="Product image"
            />
          )}

          <div className="absolute left-0 bottom-0 translate-y-full w-full flex flex-wrap items-center justify-center gap-2 p-2 sm:pb-5 ease-linear duration-200 group-hover:translate-y-0">
            <button
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
              aria-label="button for quick view"
              className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-gray-6"
            >
              <IoEyeOutline size={18} />
            </button>

            <button
              onClick={() => !isOutOfStock && handleAddToCart()}
              disabled={isOutOfStock}
              className={buttonClasses}
            >
              {buttonLabel}
            </button>

            <button
              onClick={handleItemToWishList}
              aria-label="button for favorite select"
              className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-gray-6"
            >
              <MdFavoriteBorder size={18} />
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full flex flex-col gap-3 sm:gap-5 justify-center py-4 px-3 sm:px-7.5 lg:pl-11 lg:pr-12">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-dark ease-out duration-200 hover:text-gray-700 mb-2">
                {item.title}
              </h3>
              <Badge
                size="sm"
                variant="gradient"
                gradient={{ from: "green", to: "lime", deg: 360 }}
              >
                {item.brand_name}
              </Badge>
            </div>

            <span className="text-sm sm:text-base text-gray-700 leading-relaxed block mb-2">
              {item.description}
            </span>

            <span className="flex items-center gap-2 mt-1 font-semibold text-lg sm:text-xl">
              <span className="text-dark">JD {item.discountedPrice}</span>
              {Number(item.discountedPrice) !== Number(item.price) && (
                <span className="text-gray-400 line-through text-sm">
                  JD {item.price}
                </span>
              )}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2.5 mb-2">
            {item.colors?.length > 0 ? (
              <>
                <h3 className="text-sm font-medium text-center">
                  {t("colors")}
                </h3>
                <div className="flex gap-3 flex-wrap justify-center">
                  {item.colors.map((color) => (
                    <div
                      key={color.id}
                      className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-transform duration-200 ${
                        selectedColor === color.hex_code
                          ? "scale-125 border-black"
                          : "border-gray-300 hover:scale-150"
                      }`}
                      style={{ backgroundColor: color.hex_code }}
                      title={color.name}
                      onClick={() => setSelectedColor(color.hex_code)}
                    ></div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <p>{t("no_colors")}</p>
                <CiNoWaitingSign />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
