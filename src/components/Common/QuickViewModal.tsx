"use client";
import React, { useEffect, useState } from "react";

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

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  const dispatch = useDispatch<AppDispatch>();

  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);

  const [activePreview, setActivePreview] = useState(0);

  // preview modal
  const handlePreviewSlider = () => {
    dispatch(updateproductDetails(product));

    openPreviewModal();
  };
  // add to cart
  // add to cart
  const handleAddToCart = () => {
    // إذا المنتج له ألوان ولم يتم اختيار لون
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("يرجى اختيار لون قبل إضافة المنتج إلى السلة.");

      return;
    }
    dispatch(
      addItemToCart({
        ...product,
        quantity,
        color: selectedColor, // ممكن يكون null إذا ما فيه ألوان، وهذا عادي
      })
    );
    setSelectedColor(null); // Reset selected color after adding to cart

    closeModal();
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
                            ? "border-2 border-blue-light rounded-lg"
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
                    Best Offer
                  </Badge>
                )}
                {product.is_new_arrival && (
                  <Badge
                    size="md"
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan", deg: 360 }}
                  >
                    New Arrival
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
                <div className="flex items-center gap-2">
                  <CiCircleCheck color="green" size={20} />

                  <span className="font-medium text-dark"> In Stock </span>
                </div>
              </div>
              <p>{product.description}</p>
              <div className="mt-5">
                <h4 className="font-semibold text-lg text-dark mb-3.5">
                  Colors
                </h4>
                {product.colors && product.colors.length > 0 ? (
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color) => (
                      <div
                        key={color.id}
                        className={`w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-110 ${
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
                  <div className="mt-5">
                    <h4 className="font-semibold text-lg text-dark mb-3.5">
                      Attributes
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(product.attributes).map(
                        ([name, value], index) => (
                          <li
                            key={index}
                            className="text-dark-2 flex items-center gap-2"
                          >
                            <span className="font-medium">{name}:</span>
                            {value === "true" ? (
                              <div className="flex items-center gap-1">
                                <CiCircleCheck color="green" size={20} />
                                <span>Yes</span>
                              </div>
                            ) : value === "false" ? (
                              <div className="flex items-center gap-1">
                                <VscError color="red" size={20} />
                                <span>No</span>
                              </div>
                            ) : (
                              <span>{value}</span>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              <div className="flex flex-wrap justify-between gap-5 mt-6 mb-7.5">
                <div>
                  <h4 className="font-semibold text-lg text-dark mb-3.5">
                    Price
                  </h4>

                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-dark text-xl xl:text-heading-4">
                      JOD {product.discountedPrice}
                    </span>
                    <span className="font-medium text-dark-4 text-lg xl:text-2xl line-through">
                      JOD {product.price}
                    </span>
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-dark mb-3.5">
                    Quantity
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
              <div className="flex items-center gap-4 flex-nowrap overflow-auto">
                <button
                  disabled={quantity === 0}
                  onClick={() => handleAddToCart()}
                  className="text-xs sm:text-base inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md">
                  <LuShoppingBag size={18} />
                  Add to Cart
                </button>

                <button  className="text-xs sm:text-base inline-flex items-center gap-2 font-medium text-white bg-dark py-3 px-6 rounded-md">
                  <MdFavoriteBorder size={18} />
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
