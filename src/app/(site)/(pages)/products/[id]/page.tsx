"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Box, Flex, Badge, Title, Button, Text, List, Skeleton } from "@mantine/core";
import { FiMinus, FiPlus } from "react-icons/fi";
import { LuShoppingBag } from "react-icons/lu";
import { MdFavoriteBorder } from "react-icons/md";
import { CiCircleCheck, CiNoWaitingSign } from "react-icons/ci";
import { VscError } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface Color {
  id: string;
  name: string;
  hex_code: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images?: string[];
  brand_name?: string;
  in_stock: boolean;
  is_best_offer?: boolean;
  is_new_arrival?: boolean;
  colors?: Color[];
  attributes?: Record<string, string | boolean>;
  promo_code?: string;
  discount_value?: number;
}

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState(0);
  const [subId, setSubId] = useState<number | null>(null);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/single/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSubId(data.subcategory_id);
        setLoading(false);
      })
      .catch(() => {
        setSubId(null);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <Box mt={62} p="lg">
      <Skeleton height={30} width="40%" mb="md" />
      <Skeleton height={400} mb="md" />
      <Skeleton height={20} width="60%" mb="sm" />
      <Skeleton height={20} width="80%" mb="sm" />
      <Skeleton height={50} width="100%" radius="md" />
    </Box>
  );
  if (!product) return (
    <Box mt={62} p="lg">
        <Text>{t("product_not_found")}</Text>
    </Box>
  );

  const handleAddToCart = () => {
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("يرجى اختيار لون قبل إضافة المنتج إلى السلة");
      return;
    }
    toast.success("تمت إضافة المنتج إلى السلة");
    dispatch(
      addItemToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice ?? product.price,
        quantity,
        color: selectedColor,
        images: product.images ?? [],
        brandName: product.brand_name,
      })
    );
  };

  const handleAddToWishlist = () => {
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("يرجى اختيار لون قبل إضافة المنتج إلى المفضلة");
      return;
    }
    toast.success("تمت إضافة المنتج إلى المفضلة");
    dispatch(
      addItemToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice ?? product.price,
        quantity,
        color: selectedColor,
        images: product.images ?? [],
        status: "available",
      })
    );
  };

  return (
    <Box mt={62} p={{ base: "sm", md: "lg" }}>
      <Flex wrap="wrap" gap="sm" mb="md">
        {product.is_best_offer && (
          <Badge variant="gradient" gradient={{ from: "red", to: "yellow" }}>
            Best Offer
          </Badge>
        )}
        {product.is_new_arrival && (
          <Badge variant="gradient" gradient={{ from: "blue", to: "cyan" }}>
            New Arrival
          </Badge>
        )}
      </Flex>

      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={{ base: "md", lg: "xl" }}
        wrap="wrap"
      >
        {/* صور المنتج */}
        <Flex direction="column" gap="md" style={{ flex: 1, minWidth: 0 }}>
          <Box
            w="100%"
            h={{ base: 250, md: 400 }}
            style={{ position: "relative" }}
          >
            {product.images?.[activePreview] && (
              <Image
                src={product.images[activePreview]}
                alt="product-preview"
                fill
                style={{ objectFit: "contain", borderRadius: 8 }}
              />
            )}
          </Box>

          <Flex gap="8px" wrap="wrap">
            {product.images?.map((img, idx) => (
              <Box
                key={idx}
                w={50}
                h={50}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  border:
                    activePreview === idx
                      ? "2px solid black"
                      : "1px solid #ccc",
                }}
                onClick={() => setActivePreview(idx)}
              >
                <Image
                  src={img}
                  alt={`thumbnail-${idx}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            ))}
          </Flex>
        </Flex>

        {/* تفاصيل المنتج */}
        <Box style={{ flex: 1, minWidth: 0, marginTop: "20px" }}>
          <Flex align="center" gap="sm" mb="sm" wrap="wrap">
            <Title size="xl" order={4} style={{ flex: 1, minWidth: 0 }}>
              {product.title}
            </Title>
            {product.brand_name && (
              <Badge
                variant="gradient"
                gradient={{ from: "green", to: "lime" }}
              >
                {product.brand_name}
              </Badge>
            )}
          </Flex>

          <Flex gap="md" mb="md" wrap="wrap">
            {product.in_stock ? (
              <>
                <CiCircleCheck color="green" size={20} />
                <Text c="green.7">In Stock</Text>
              </>
            ) : (
              <>
                <VscError color="red" size={20} />
                <Text c="red.6">Out of Stock</Text>
              </>
            )}
          </Flex>

          {/* ألوان */}
          {product.colors?.length ? (
            <Flex gap="sm" wrap="wrap" mb="md">
                <Text fw={500} size="sm">
                    {t("colors")}:
                </Text>
              {product.colors.map((color) => (
                <Box
                  key={color.id}
                  w={16}
                  h={16}
                  style={{
                    borderRadius: "9999px",
                    backgroundColor: color.hex_code,
                    border:
                      selectedColor === color.hex_code
                        ? "2px solid black"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedColor(color.hex_code)}
                />
              ))}
            </Flex>
          ) : (
            <CiNoWaitingSign />
          )}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
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
                        dir="rtl"
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

            <Box>
              <Title order={5} mb="xs">
                {t("price")}
              </Title>
              <Flex align="center" gap="sm">
                <Text fw={600} size="xl">
                  JD {product.discountedPrice}
                </Text>
                {Number(product.discountedPrice) !== Number(product.price) && (
                  <Text td="line-through" c="gray" size="lg">
                    JD {product.price}
                  </Text>
                )}
              </Flex>
            </Box>

            <Box mt={{ base: "sm", sm: 0 }}>
              <Title order={5}>Quantity</Title>
              <Flex align="center" gap="sm">
                <Button
                  size="xs"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  style={{ backgroundColor: "#000", color: "#fff" }}
                >
                  <FiMinus color="white" />
                </Button>
                <Box style={{ width: 40, textAlign: "center" }}>{quantity}</Box>
                <Button
                  style={{ backgroundColor: "#000", color: "#fff" }}
                  size="xs"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <FiPlus color="white" />
                </Button>
              </Flex>
            </Box>
          
          <Flex
            mb="lg"
            mt="lg"
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
          {/* أزرار الإضافة */}
          <Flex
            gap="sm"
            wrap="nowrap"
            direction={i18n.language === "ar" ? "row-reverse" : "row"}
          >
            {" "}
            <Button
              radius="xl"
              disabled={!product.in_stock || quantity === 0}
              leftSection={<LuShoppingBag size={18} />}
              style={
                product.in_stock
                  ? { backgroundColor: "#000", color: "#fff" }
                  : { backgroundColor: "#ccc" }
              }
              onClick={handleAddToCart}
              fullWidth
            >
              {product.in_stock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button
              radius="xl"
              leftSection={<MdFavoriteBorder size={18} />}
              style={{ backgroundColor: "#000", color: "#fff" }}
              onClick={handleAddToWishlist}
              fullWidth
            >
              Add to Wishlist
            </Button>
          </Flex>

          <Box
            mt="xl"
            mb="md"
            style={{
              maxHeight: "150px", // يمكن تغييره حسب الحاجة
              overflowY: "auto",
              paddingRight: "8px", // لتجنب قطع النص عند scrollbar
            }}
          >
            <Text>{product.description}</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductPage;
