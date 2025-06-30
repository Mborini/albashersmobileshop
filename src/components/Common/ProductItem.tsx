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
import { useTranslation } from "react-i18next";
import { CiNoWaitingSign } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { MdFavoriteBorder } from "react-icons/md";
import { Badge } from "@mantine/core";
import FlyingImage from "../Common/FlyingImage";

const ProductItem = ({ item }: { item: Product }) => {
  const { t, i18n } = useTranslation();
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const imageRef = useRef<HTMLImageElement>(null);
  const [flyingImage, setFlyingImage] = useState<{
    imageSrc: string;
    startRect: DOMRect;
  } | null>(null);

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setFlyingImage({
        imageSrc: item.images?.[0] ?? "",
        startRect: rect,
      });
    }

    dispatch(
      addItemToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        discountedPrice: item.discountedPrice ?? item.price,
        quantity: 1,
        color:
          item.colors && item.colors.length > 0 ? item.colors[0].hex_code : "",
        images: item.images ?? [],
      })
    );
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        id: item.id,
        title: item.title,
        price: item.price,
        discountedPrice: item.discountedPrice ?? item.price,
        quantity: 1,
        color:
          item.colors && item.colors.length > 0 ? item.colors[0].hex_code : "",
        images: item.images ?? [],
        status: "available",
      })
    );
  };

  return (
    <>
      {flyingImage && (
        <FlyingImage
          imageSrc={flyingImage.imageSrc}
          startRect={flyingImage.startRect}
          onComplete={() => setFlyingImage(null)}
        />
      )}
      <div className="group">
        <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-[#F5F5F7] shadow-2 border-gray-6 border-1 mb-4">
          {item.images[0] && (
            <Image
              ref={imageRef}
              src={item.images[0]}
              className="object-cover"
              width={250}
              height={250}
              alt="Product image"
            />
          )}

          <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
            <button
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
              className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-gray-6"
            >
              <IoEyeOutline size={18} />
            </button>

            <button
              onClick={handleAddToCart}
              className={`inline-flex font-medium py-[7px] px-5 rounded-[5px] bg-black text-white ease-out duration-200 hover:bg--gray-6 ${
                i18n.language === "ar" ? "text-[12px]" : "text-custom-sm"
              }`}
            >
              {t("add_to_cart")}
            </button>

            <button
              onClick={handleItemToWishList}
              className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-gray-6"
            >
              <MdFavoriteBorder size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-between">
          <h3 className="font-medium text-black ease-out duration-200 hover:text-gray-6 mb-1.5">
            {item.title}
          </h3>
          <Badge
            size="md"
            variant="gradient"
            gradient={{ from: "green", to: "lime", deg: 360 }}
          >
            {item.brand_name}
          </Badge>
        </div>

        <div className="flex items-center gap-2.5 mb-2">
          {item.colors?.length ? (
            <div className="flex gap-3 flex-wrap">
              {item.colors.map((color) => (
                <div
                  key={color.id}
                  className="w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                ></div>
              ))}
            </div>
          ) : (
            <CiNoWaitingSign />
          )}
        </div>

        <span className="flex items-center gap-2 font-medium text-lg">
          <span className="text-dark">JOD {item.price}</span>
          <span className="text-dark-4 line-through">
            JOD {item.discountedPrice}
          </span>
        </span>
      </div>
    </>
  );
};

export default ProductItem;
