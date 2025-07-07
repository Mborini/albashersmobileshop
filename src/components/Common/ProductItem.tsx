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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [flyingImage, setFlyingImage] = useState<{
    imageSrc: string;
    startRect: DOMRect;
  } | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
        color: selectedColor ?? item.colors?.[0]?.hex_code ?? "",
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
        color: selectedColor ?? item.colors?.[0]?.hex_code ?? "",
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
        <div
          className="relative w-full h-[250px] rounded-lg shadow-2 bg-white border-gray-2 border mb-4 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Brand badge */}
          <div className="absolute top-2 left-2 z-10">
            <Badge
              size="md"
              variant="gradient"
              gradient={{ from: "green", to: "lime", deg: 360 }}
            >
              {item.brand_name}
            </Badge>
          </div>

          {item.images[currentImageIndex] && (
            <Image
              ref={imageRef}
              src={item.images[currentImageIndex]}
              alt="Product image"
              fill
              className="object-cover transition-opacity duration-500 ease-in-out"
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
              style={{ cursor: "pointer" }}
            />
          )}

          {/* Image indicators */}
          {item.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {item.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                   index === currentImageIndex
                    ? "bg-green-dark"
                    : "bg-green-light-4"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
            <button
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
              className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-black bg-white hover:text-gray-6"
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
              className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-black bg-white hover:text-gray-6"
            >
              <MdFavoriteBorder size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="flex-1 text-sm font-medium text-black truncate hover:text-gray-6 duration-200 ease-out">
            {item.title}
          </h3>
        </div>

        <div className="flex items-center gap-2.5 mb-2">
          {item.colors?.length ? (
            <div className="flex flex-wrap">
              {item.colors.map((color) => (
                <div key={color.id} className="relative w-6 h-6">
                  <div
                    onClick={() => setSelectedColor(color.hex_code)}
                    className={`absolute inset-0 m-auto w-4 h-4 rounded-full cursor-pointer transition-transform duration-200 hover:scale-150 ${
                      selectedColor === color.hex_code
                        ? "scale-125 border-black"
                        : "border-gray-6"
                    } border-2`}
                    style={{ backgroundColor: color.hex_code }}
                    title={color.name}
                  ></div>
                </div>
              ))}
            </div>
          ) : (
            <CiNoWaitingSign />
          )}
        </div>

        <span className="flex items-center gap-2 font-medium">
          <span className="text-lg text-dark">JD {item.discountedPrice}</span>
          <span className="text-md text-dark-4 line-through">
            JD {item.price}
          </span>
        </span>
      </div>
    </>
  );
};

export default ProductItem;
