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
import toast, { Toaster } from "react-hot-toast";
import { MdFavoriteBorder, MdOutlineCancel } from "react-icons/md";
import { FiMinus, FiPlus } from "react-icons/fi";
import { LuShoppingBag } from "react-icons/lu";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Flex,
  Box,
  Badge,
  Title,
  Button,
  Stack,
  List,
  Text,
} from "@mantine/core";
const QuickViewModal = () => {
  const { t, i18n } = useTranslation();

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

  const handleAddToCart = () => {
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("يرجى اختيار لون قبل إضافة المنتج إلى السلة.");
      return;
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
        brandName: product.brand_name,
      })
    );

    setSelectedColor(null);
    toast.success(t("added_to_cart", { itemName: product.title }), {
      duration: 4000,

      style: {
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      },
    });
    closeModal();
    setQuantity(1);
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
    toast.success(t("added_to_wishlist", { itemName: product.title }), {
      duration: 4000,
      icon: "❤️",
      style: {
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      },
    });
    closeModal();
  };
  useEffect(() => {
    if (!isModalOpen) {
      setQuantity(1);
    }
  }, [isModalOpen]);

  return (
    <Modal
      opened={isModalOpen}
      onClose={closeModal}
      size="full"
      padding="lg"
      title={product?.title}
      centered
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
    >
      <Flex wrap="wrap" gap="sm" mb="md">
        {product.is_best_offer && (
          <Badge variant="gradient" gradient={{ from: "red", to: "yellow" }}>
            {t("best_offers")}
          </Badge>
        )}
        {product.is_new_arrival && (
          <Badge variant="gradient" gradient={{ from: "blue", to: "cyan" }}>
            {t("new_arrivals")}
          </Badge>
        )}
      </Flex>
      <Flex justify="center" align="center" mt="xs">
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="flex-start"
          gap="xl"
        >
          <Flex
            direction={{
              base: "column-reverse",
              sm: "column-reverse",
              lg: "column-reverse",
            }}
            gap="md"
            style={{ maxWidth: 700 }}
          >
            {/* الصور المصغرة */}
            {/* الصور المصغرة بشكل أفقي وتعمل Scroll عند العرض على الموبايل */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
                maxWidth: 300,
              }}
            >
              {product.images
                ?.filter(
                  (img) => typeof img === "string" && img.startsWith("http")
                )
                .map((image, index) => (
                  <div
                    key={index}
                    className={`relative w-[60px] h-[60px] cursor-pointer rounded-md overflow-hidden border-2 ${
                      activePreview === index
                        ? "border-black scale-110"
                        : "border-transparent"
                    } transition-transform duration-200`}
                    onClick={() => setActivePreview(index)}
                    onMouseOver={() => setActivePreview(index)}
                    title={`Thumbnail ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`thumbnail-${index}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="60px"
                      priority={activePreview === index}
                    />
                  </div>
                ))}
            </div>

            {/* الصورة الرئيسية بحجم أكبر */}
            <Box
              style={{
                position: "relative",
                width: 300,
                height: 300,
                borderRadius: 8,
                border: "1px solid #e0e0e0",
                backgroundColor: "#f8f9fa",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              }}
            >
              {product.images?.[activePreview] &&
                typeof product.images[activePreview] === "string" &&
                product.images[activePreview].startsWith("http") && (
                  <Image
                    src={product.images[activePreview]}
                    alt="product-preview"
                    fill
                    style={{ objectFit: "contain", borderRadius: 8 }}
                    priority
                  />
                )}
            </Box>
          </Flex>

          <Box w="100%" style={{ maxWidth: 445 }}>
            <Flex align="center" gap="sm" mb="sm">
              <Title order={4}>{product.title}</Title>
              <Badge
                variant="gradient"
                gradient={{ from: "green", to: "lime" }}
              >
                {product.brand_name}
              </Badge>
            </Flex>

            <Flex
              gap="md"
              mb="md"
              direction={i18n.language === "ar" ? "row-reverse" : "row"}
            >
              {product.in_stock ? (
                <>
                  <CiCircleCheck color="green" size={20} />
                  <Text c="green.7" fw={500}>
                    {t("in_stock")}
                  </Text>
                </>
              ) : (
                <>
                  <VscError color="red" size={20} />
                  <Text c="red.6" fw={500}>
                    {t("out_of_stock")}
                  </Text>
                </>
              )}
            </Flex>

            <Text mb="md" style={{ whiteSpace: "pre-line" }}>
              {product.description}
            </Text>

            <Box mt="md" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
              <Title order={5} mb="xs">
                {t("colors")}
              </Title>
              {product.colors?.length > 0 ? (
                <Flex gap="sm" wrap="wrap">
                  {product.colors.map((color) => (
                    <Box
                      key={color.id}
                      w={16}
                      h={16}
                      style={{
                        borderRadius: "9999px",
                        backgroundColor: color.hex_code,
                        cursor: "pointer",
                        border: "2px solid",
                        transform: "scale(1)",
                        outline:
                          selectedColor === color.hex_code
                            ? "2px solid black"
                            : "none",
                      }}
                      title={color.name}
                      onClick={() => setSelectedColor(color.hex_code)}
                    />
                  ))}
                </Flex>
              ) : (
                <CiNoWaitingSign />
              )}
            </Box>

            {product.attributes &&
              Object.keys(product.attributes).length > 0 && (
                <Box mt="md" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
                  <Title order={5} mb="xs">
                    {t("product_attributes")}
                  </Title>
                  <List spacing="xs">
                    {Object.entries(product.attributes).map(
                      ([name, value], index) => {
                        const valStr = String(value).toLowerCase();
                        return (
                          <List.Item
                            key={index}
                            icon={
                              valStr === "true" ? (
                                <CiCircleCheck color="green" />
                              ) : valStr === "false" ? (
                                <VscError color="red" />
                              ) : null
                            }
                          >
                            <Text span fw={500}>
                              {name}:{" "}
                            </Text>
                            {valStr === "true"
                              ? "Yes"
                              : valStr === "false"
                              ? "No"
                              : String(value)}
                          </List.Item>
                        );
                      }
                    )}
                  </List>
                </Box>
              )}

            <Flex justify="space-between" wrap="wrap" gap="md" mt="lg" mb="lg">
              <Box>
                <Title order={5} mb="xs">
                  {t("price")}
                </Title>
                <Flex align="center" gap="sm">
                  <Text fw={600} size="xl">
                    JD {product.discountedPrice}
                  </Text>
                  {Number(product.discountedPrice) !==
                    Number(product.price) && (
                    <Text td="line-through" c="gray" size="lg">
                      JD {product.price}
                    </Text>
                  )}
                </Flex>
              </Box>
              <Box>
                <Title order={5} mb="xs">
                  {t("quantity")}
                </Title>
                <Flex align="center" gap="sm">
                  <Button
                    size="xs"
                    radius="xl"
                    disabled={quantity == 1}
                    variant="default"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    style={{ backgroundColor: "#000", color: "#fff" }}
                  >
                    <FiMinus />
                  </Button>
                  <Box
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 5,
                      width: 40,
                      textAlign: "center",
                      padding: 5,
                    }}
                  >
                    {quantity}
                  </Box>
                  <Button
                    size="xs"
                    style={{ backgroundColor: "#000", color: "#fff" }}
                    radius="xl"
                    variant="default"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <FiPlus />
                  </Button>
                </Flex>
              </Box>
            </Flex>

            <Flex
              mb="md"
              gap="sm"
              wrap="nowrap"
              direction={i18n.language === "ar" ? "row-reverse" : "row"}
            >
              {product.promo_code && product.discount_value ? (
                <Badge
                  size="md"
                  variant="gradient"
                  gradient={{ from: "blue", to: "navy", deg: 45 }}
                >
                  {`Use '${product.promo_code}' to get offer ${
                    Number.isInteger(Number(product.discount_value))
                      ? Number(product.discount_value)
                      : Number(product.discount_value).toFixed(2)
                  }%`}
                </Badge>
              ) : null}
            </Flex>
            <Flex
              gap="sm"
              wrap="nowrap"
              direction={i18n.language === "ar" ? "row-reverse" : "row"}
            >
              <Button
                radius="xl"
                disabled={!product.in_stock || quantity === 0}
                onClick={handleAddToCart}
                leftSection={<LuShoppingBag size={18} />}
                color={product.in_stock ? "dark" : "gray"}
                style={
                  product.in_stock
                    ? { backgroundColor: "#000", color: "#fff" }
                    : { backgroundColor: "#ccc", color: "#666" }
                }
              >
                {product.in_stock ? t("add_to_cart") : t("out_of_stock")}
              </Button>

              <Button
                radius="xl"
                onClick={handleItemToWishList}
                leftSection={<MdFavoriteBorder size={18} />}
                color="dark"
                style={{ backgroundColor: "#000", color: "#fff" }}
              >
                {t("add_to_wishlist")}
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default QuickViewModal;
