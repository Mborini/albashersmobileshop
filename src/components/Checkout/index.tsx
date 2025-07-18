// Converted Checkout component UI to Mantine
"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import {
  selectCartItems,
  selectTotalPrice,
  removeItemFromCart,
  removeAllItemsFromCart,
} from "@/redux/features/cart-slice";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import MailSuccess from "../MailSuccess";
import { FaSpinner, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { MdOutlineDiscount, MdOutlineShoppingCart } from "react-icons/md";
import {
  Radio,
  Grid,
  Alert,
  Badge,
  TextInput,
  Paper,
  Box,
  Button,
  Title,
  Text,
  Group,
  Divider,
  Image as MantineImage,
  Center,
  ThemeIcon,
  Stack,
} from "@mantine/core";
import { CiNoWaitingSign } from "react-icons/ci";
import Image from "next/image";

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [freeShippingDiff, setFreeShippingDiff] = useState(null);
  const [message, setMessage] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState(null);
  const [codePercentage, setCodePercentage] = useState(null);
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const fetchDeliveryConditions = async () => {
      try {
        const res = await fetch("/api/Admin/delivery-price");
        const data = await res.json();

        if (data) {
          const {
            less_than_x,
            price_lt_x,
            between_x_z_from,
            between_x_z_to,
            price_between,
            greater_equal_z,
            price_ge_z,
          } = data;

          if (totalPrice < Number(less_than_x)) {
            setDeliveryPrice(Number(price_lt_x));
            const diff = Number(between_x_z_from) - Number(totalPrice);
            setFreeShippingDiff(diff);
            setMessage(
              t("add_amount_to_get_delivery_price", {
                diff: diff.toFixed(2),
                price_between: Number(price_between).toFixed(2),
              })
            );
          } else if (
            totalPrice >= Number(between_x_z_from) &&
            totalPrice < Number(between_x_z_to)
          ) {
            setDeliveryPrice(Number(price_between));
            const diff = Number(between_x_z_to) - Number(totalPrice);
            setFreeShippingDiff(diff);
            setMessage(
              t("add_amount_to_get_free_delivery", { diff: diff.toFixed(2) })
            );
          } else if (totalPrice >= Number(greater_equal_z)) {
            setDeliveryPrice(Number(price_ge_z));
            setFreeShippingDiff(null);
            setMessage(null);
          } else {
            setDeliveryPrice(0);
            setFreeShippingDiff(null);
            setMessage(null);
          }
        }
      } catch (err) {
        console.error("Failed to load delivery pricing", err);
      }
    };

    if (cartItems.length) {
      fetchDeliveryConditions();
    }
  }, [totalPrice, cartItems.length, t]);

  const applyPromoCode = async () => {
    if (!promoCode) {
      toast.error(t("enter_promo_code"));
      return;
    }

    try {
      const res = await fetch("/api/Admin/promoCode");
      const data = await res.json();

      const matchedCode = data.find((code) => code.name === promoCode);

      if (!matchedCode) {
        toast.error(t("invalid_promo_code"));
        return;
      }

      const brandId = matchedCode.brandId;
      const brandTotal = cartItems
        .filter((item) => item.brandId === brandId)
        .reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0);

      if (brandTotal === 0) {
        toast.error(t("promo_code_not_applicable_for_cart_brand"));
        return;
      }

      const discount = (brandTotal * matchedCode.discount) / 100;

      setDiscountAmount(discount);
      setCodePercentage(parseInt(matchedCode.discount));
      setAppliedCode(promoCode);
      toast.success(t("promo_code_applied"));
    } catch (err) {
      console.error("Failed to apply promo code", err);
      toast.error(t("error_applying_promo_code"));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (promoCode.length === 6 && !appliedCode) {
        applyPromoCode();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [promoCode]);

  const sender = async (data) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      if (data.email && data.sendEmail === "on") {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: data.email,
            name: data.firstName,
            phone: data.phone,
            totalPrice: grandTotal,
            cartItems,
            country: data.country,
            city: data.city,
            address: data.address,
            note: data.note,
            lang: i18n.language,
            deliveryPrice: deliveryPrice.toFixed(2),
            paymentMethod: data.paymentMethod,
            discountAmount: discountAmount.toFixed(2),
            grandTotal: grandTotal.toFixed(2),
          }),
        });
      }

      toast.success(t("success"));
      dispatch(removeAllItemsFromCart());
      setIsOrdered(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  const discountedTotal = totalPrice - discountAmount;
  const grandTotal = Number(discountedTotal) + Number(deliveryPrice);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      cartItems,
      totalPrice,
      deliveryPrice,
      paymentMethod,
      grandTotal,
      discountAmount,
      promoCode: appliedCode,
    };
    await sender(data);
  };

  return (
    <>
      <Breadcrumb title={t("checkout")} pages={["checkout"]} />
      <Toaster position="top-center" />

      {cartItems.length ? (
        <Box maw={1170} mx="auto" px={{ base: 16, sm: 32, xl: 0 }} py={40}>
          <form onSubmit={handleSubmit}>
            <Grid gutter={32}>
              <Grid.Col span={{ base: 12, lg: 7 }}>
                <Billing />
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 5 }} dir={isRTL ? "rtl" : "ltr"}>
                <Paper shadow="sm" radius="lg" withBorder>
                  <Box bg="black" c="white" p={20} style={{
                    borderRadius: "18px 18px 0 0 ",
                  }}>
                    <Title order={3}>{t("order_summary")}</Title>
                  </Box>
                  {cartItems.map((item) => (
                    <Group
                      key={item.id + item.color}
                      p="md"
                      justify="space-between"
                      wrap="nowrap"
                    >
                      <Group gap="md">
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          width={50}
                          height={50}
                          style={{ borderRadius: "8px" }}
                        />
                        <Stack gap={2}>
                          <Text fw={500} size="sm">
                            {item.title}
                          </Text>
                          <Text size="xs">
                            {t("price")}: JD {item.discountedPrice}
                          </Text>
                          <Text size="xs">
                            {t("quantity")}: {item.quantity}
                          </Text>
                          <Group gap={6}>
                            <Text size="xs">{t("color")}:</Text>
                            {item.color ? (
                              <Box
                                w={16}
                                h={16}
                                style={{
                                  backgroundColor: item.color,
                                  border: "1px solid #ccc",
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <CiNoWaitingSign size={20} />
                            )}
                          </Group>
                        </Stack>
                      </Group>
                      <Stack gap={4} align="flex-end">
                        <Text fw={600} size="sm">
                          JD {(item.discountedPrice * item.quantity).toFixed(2)}
                        </Text>
                        <Button
                          variant="subtle"
                          color="red"
                          size="xs"
                          onClick={() =>
                            dispatch(
                              removeItemFromCart({
                                id: item.id,
                                color: item.color,
                              })
                            )
                          }
                          leftSection={<FaTrashAlt size={14} />}
                        ></Button>
                      </Stack>
                    </Group>
                  ))}
                </Paper>

                <Button
                  type="submit"
                  fullWidth
                  mt="lg"
                  radius="xl"
                  loading={isLoading}
                  loaderProps={{ type: "dots" }}
                  disabled={isOrdered}
                  style={{ backgroundColor: "#000000", color: "#fff" }}
                >
                  {isLoading ? t("processing_checkout") : t("order_now")}
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Box>
      ) : isOrdered ? (
        <MailSuccess />
      ) : (
        <Center mt="lg">
          <Stack align="center" gap={24}>
            <ThemeIcon size={64} radius="xl" color="dark">
              <MdOutlineShoppingCart size={32} />
            </ThemeIcon>
            <Text size="lg">{t("Your_cart_is_empty")}</Text>
            <Button
              component={Link}
              href={{ pathname: "/", query: { focus: "categories" } }}
              color="dark"
            >
              {t("continue_shopping")}
            </Button>
          </Stack>
        </Center>
      )}
    </>
  );
};

export default Checkout;
