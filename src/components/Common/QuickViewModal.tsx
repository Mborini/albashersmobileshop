"use client";
import React, { useEffect, useRef, useState } from "react";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { resetQuickView } from "@/redux/features/quickView-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { VscError } from "react-icons/vsc";
import { CiCircleCheck, CiNoWaitingSign } from "react-icons/ci";
import { Badge } from "@mantine/core";
import toast, { Toaster } from "react-hot-toast";
import { MdFavoriteBorder, MdOutlineCancel } from "react-icons/md";
import { FiMinus, FiPlus } from "react-icons/fi";
import { LuShoppingBag } from "react-icons/lu";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import FlyingImage from "./FlyingImage";
import { useTranslation } from "react-i18next";

const QuickViewModal = () => {
  const { t, i18n } = useTranslation();

  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [floatingStart, setFloatingStart] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [flyingImage, setFlyingImage] = useState<{
    imageSrc: string;
    startRect: DOMRect;
  } | null>(null);
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);

  const [activePreview, setActivePreview] = useState(0);

  // preview modal
  const handlePreviewSlider = () => {
    dispatch(updateproductDetails(product));

    openPreviewModal();
  };

  const handleAddToCart = () => {
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("يرجى اختيار لون قبل إضافة المنتج إلى السلة.");
      return;
    }

    if (addToCartButtonRef.current) {
      const rect = addToCartButtonRef.current.getBoundingClientRect();
      setFlyingImage({ imageSrc: product.images?.[0] ?? "", startRect: rect });
    }

    dispatch(
      addItemToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice ?? product.price,
        quantity: quantity,
        color: selectedColor,
        images: product.images ?? [],
        brandId: product.brand_id,
      })
    );

    setSelectedColor(null);
  };

  const handleItemToWishList = () => {
    // إذا المنتج له ألوان ولم يتم اختيار لون
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("يرجى اختيار لون قبل إضافة المنتج إلى المفضلة.");

      return;
    }

    dispatch(
      addItemToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice ?? product.price,
        quantity: quantity,
        color: selectedColor,
        images: product.images ?? [], // تأكد إنها string[]
        status: "available",
      })
    );
    setSelectedColor(null); // Reset selected color after adding to wishlist
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      setQuantity(1);
    };
  }, [isModalOpen, closeModal]);
  return (
    <div
      className={`${
        isModalOpen ? "z-9999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={() => closeModal()}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <MdOutlineCancel />
          </button>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="w-full lg:max-w-[526px]">
              <div className="flex gap-5">
                <div className="flex flex-col gap-5">
                  {product.images
                    ?.filter(
                      (image) =>
                        typeof image === "string" && image.startsWith("http")
                    )
                    .map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`thumbnail-${index}`}
                        width={61}
                        height={61}
                        className={`aspect-square cursor-pointer ${
                          activePreview === index
                            ? "border-2 border-black rounded-lg"
                            : ""
                        }`}
                        onClick={() => setActivePreview(index)}
                        onMouseOver={() => setActivePreview(index)}
                      />
                    ))}
                </div>

                <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-gray-1 rounded-lg border border-gray-3">
                  <div>
                    {product.images?.[activePreview] &&
                      typeof product.images[activePreview] === "string" &&
                      product.images[activePreview].startsWith("http") && (
                        <Image
                          src={product.images[activePreview]}
                          alt="products-details"
                          width={400}
                          height={400}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-[445px]">
              {" "}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {product.is_best_offer && (
                  <Badge
                    size="md"
                    variant="gradient"
                    gradient={{ from: "red", to: "yellow", deg: 360 }}
                  >
                    {t("best_offers")}
                  </Badge>
                )}
                {product.is_new_arrival && (
                  <Badge
                    size="md"
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan", deg: 360 }}
                  >
                    {t("new_arrivals")}
                  </Badge>
                )}
              </div>
              <div className="flex gap-3  ">
                <p className="font-semibold text-xl xl:text-heading-5 text-dark mb-4">
                  {product.title}
                </p>

                <Badge
                  size="md"
                  variant="gradient"
                  gradient={{ from: "green", to: "lime", deg: 360 }}
                >
                  {product.brand_name}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-5 mb-6">
                <div
                  className="flex items-center gap-2"
                  dir={i18n.language === "ar" ? "rtl" : "ltr"}
                >
                  {product.in_stock ? (
                    <>
                      <CiCircleCheck color="green" size={20} />
                      <span className="font-medium text-green-700">
                        {t("in_stock")}
                      </span>
                    </>
                  ) : (
                    <>
                      <VscError color="red" size={20} />
                      <span className="font-medium text-red-600">
                        {t("out_of_stock")}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-line">{product.description}</p>
              <div
                className="mt-5"
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
              >
                <h4 className="font-semibold text-lg text-dark mb-3.5">
                  {t("colors")}
                </h4>
                {product.colors && product.colors.length > 0 ? (
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color) => (
                      <div
                        key={color.id}
                        className={`w-4 h-4 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${
                          selectedColor === color.hex_code
                            ? "ring-2 ring-black"
                            : ""
                        }`}
                        style={{ backgroundColor: color.hex_code }}
                        title={color.name}
                        onClick={() => setSelectedColor(color.hex_code)}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <CiNoWaitingSign />
                )}
              </div>
              {product.attributes &&
                Object.keys(product.attributes).length > 0 && (
                  <div
                    className="mt-5"
                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                  >
                    <h4 className="font-semibold text-lg text-dark mb-3.5">
                      {t("product_attributes")}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(product.attributes).map(
                        ([name, value], index) => {
                          const valStr = String(value).toLowerCase(); // يحول القيمة إلى نص صغير الأحرف

                          return (
                            <li
                              key={index}
                              className="text-dark-2 flex items-center gap-2"
                            >
                              <span className="font-medium">{name}:</span>

                              {valStr === "true" ? (
                                <div className="flex items-center gap-1">
                                  <CiCircleCheck color="green" size={20} />
                                  <span>Yes</span>
                                </div>
                              ) : valStr === "false" ? (
                                <div className="flex items-center gap-1">
                                  <VscError color="red" size={20} />
                                  <span>No</span>
                                </div>
                              ) : (
                                <span>{String(value)}</span>
                              )}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                )}
              <div
                className="flex flex-wrap justify-between gap-5 mt-6 mb-7.5"
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
              >
                <div>
                  <h4 className="font-semibold text-lg text-dark mb-3.5">
                    {t("price")}
                  </h4>

                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-dark text-xl xl:text-heading-4">
                      JD {product.discountedPrice}
                    </span>

                    {Number(product.discountedPrice) !==
                      Number(product.price) && (
                      <span className="font-medium text-dark-4 text-lg xl:text-2xl line-through">
                        JD {product.price}
                      </span>
                    )}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-dark mb-3.5">
                    {t("quantity")}
                  </h4>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      aria-label="button for remove product"
                      className="flex items-center justify-center w-10 h-10 rounded-[5px] bg-gray-2 text-dark ease-out duration-200 hover:text-blue"
                      disabled={quantity < 0 && true}
                    >
                      <FiMinus />
                    </button>

                    <span
                      className="flex items-center justify-center w-20 h-10 rounded-[5px] border border-gray-4 bg-white font-medium text-dark"
                      x-text="quantity"
                    >
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="button for add product"
                      className="flex items-center justify-center w-10 h-10 rounded-[5px] bg-gray-2 text-dark ease-out duration-200 hover:text-blue"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-4 flex-nowrap overflow-auto"
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
              >
                <button
                  ref={addToCartButtonRef}
                  disabled={!product.in_stock || quantity === 0}
                  onClick={handleAddToCart}
                  className={`
    text-xs sm:text-base inline-flex items-center gap-2 font-medium py-3 px-6 rounded-md
    ${
      product.in_stock
        ? "text-white bg-black hover:bg-gray-800"
        : "bg-gray-300 text-gray-500 cursor-not-allowed line-through"
    }
    transition-colors duration-200
  `}
                >
                  <LuShoppingBag size={18} />
                  {product.in_stock ? `${t("add_to_cart")}` : t("out_of_stock")}
                </button>

                <button
                  onClick={() => handleItemToWishList()}
                  className="text-xs sm:text-base inline-flex items-center gap-2 font-medium text-white bg-black py-3 px-6 rounded-md"
                >
                  <MdFavoriteBorder size={18} />
                  {t("add_to_wishlist")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {flyingImage && (
        <FlyingImage
          imageSrc={flyingImage.imageSrc}
          startRect={flyingImage.startRect}
          onComplete={() => {
            setFlyingImage(null);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default QuickViewModal;
