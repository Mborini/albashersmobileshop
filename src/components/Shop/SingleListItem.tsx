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
import FlyingImage from "../Common/FlyingImage"; // ← استدعاء العنصر الطائر

const SingleListItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

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
    <div className="group rounded-lg bg-white shadow-1 relative">
      {/* صورة طائرة عند الإضافة إلى السلة */}
      {flyingImage && (
        <FlyingImage
          imageSrc={flyingImage.imageSrc}
          startRect={flyingImage.startRect}
          onComplete={() => setFlyingImage(null)}
        />
      )}

      <div dir="ltr" className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="shadow-list relative overflow-hidden flex items-center justify-center w-full sm:max-w-[270px] sm:min-h-[270px] p-4">
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
              onClick={handleAddToCart}
              className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-black text-white ease-out duration-200 hover:bg--gray-6"
            >
              {t("add_to_cart")}
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
              <h3 className="font-medium text-dark ease-out duration-200 hover:text-gary-7 mb-1.5">
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

            <span className="text-xs sm:text-sm text-dark block">
              {item.description}
            </span>

            <span className="flex items-center gap-2 mt-1 font-medium text-base sm:text-lg">
              <span className="text-dark">JOD {item.discountedPrice}</span>
              <span className="text-gray-400 line-through text-sm">
                JOD {item.price}
              </span>
            </span>
          </div>

          <div className="flex flex-col items-center gap-2.5 mb-2">
            {item.colors?.length > 0 ? (
              <>
                <h3 className="text-xs sm:text-sm text-center font-medium">
                  {t("colors")}
                </h3>
                <div className="flex gap-2 flex-wrap justify-center">
                  {item.colors.map((color) => (
                    <div
                      key={color.id}
                      className="w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: color.hex_code }}
                      title={color.name}
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
