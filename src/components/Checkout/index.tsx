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
import { MdOutlineShoppingCart } from "react-icons/md";
import { Radio, Grid, Alert, Badge } from "@mantine/core";
import { LuBadgeAlert } from "react-icons/lu";

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [freeShippingDiff, setFreeShippingDiff] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const grandTotal = Number(totalPrice) + Number(deliveryPrice);
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

  const sender = async (data: any) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

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
        }),
      });

      toast.success(t("success"));
      dispatch(removeAllItemsFromCart());
      setIsOrdered(true);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      ...(Object.fromEntries(formData.entries()) as any),
      cartItems,
      totalPrice,
      deliveryPrice,
      paymentMethod,
    };

    await sender(data);
  };

  return (
    <>
      <Breadcrumb title={t("checkout")} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <Toaster position="top-center" />
        {cartItems.length ? (
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
                <div className="lg:max-w-[670px] w-full">
                  <Billing />
                </div>

                <div
                  dir={isRTL ? "rtl" : "ltr"}
                  className="max-w-[455px] w-full"
                >
                  <div className="bg-white shadow-1 rounded-[10px]">
                    <div className="border-b border-gray-3 rounded-t-[10px] py-5 px-4 sm:px-8.5 bg-black text-white">
                      <h2 className="font-medium text-xl">
                        {t("order_summary")}
                      </h2>
                    </div>

                    <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <h4 className="font-medium text-dark">
                          {t("product")}
                        </h4>
                        <h4 className="font-medium text-dark text-right">
                          {t("price")}
                        </h4>
                      </div>

                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-5 border-b border-gray-3"
                        >
                          <div>
                            <p className="text-dark">{item.title}</p>
                            <p className="text-sm text-gray-600">
                              {t("quantity")} : {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-dark text-right">
                              JD{" "}
                              {(item.discountedPrice * item.quantity).toFixed(
                                2
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  removeItemFromCart({
                                    id: item.id,
                                    color: item.color,
                                  })
                                )
                              }
                              aria-label={t("remove_item")}
                              className="text-red-light hover:text-red-800"
                            >
                              <FaTrashAlt size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="flex flex-col border-b border-gray-3 pb-5 pt-5">
                        <div className="flex justify-between">
                          <p className="font-medium text-md text-dark">
                            {t("shipping")}
                          </p>
                          <p className="font-medium text-md text-dark text-right">
                            JD {deliveryPrice.toFixed(2)}
                          </p>
                        </div>
                        {message && (
                          <Alert
                            icon={<LuBadgeAlert size={24} />}
                            title={t("note")}
                            color="yellow"
                            radius="md"
                            mt="sm"
                            variant="light"
                            className="text-sm"
                          >
                            <div>{message}</div>

                            <Badge
                              component="button"
                              onClick={() =>
                                (window.location.href = "/products")
                              }
                              className="mx-1 text-white"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to right, #FFA726, #FB8C00, #F57C00)",
                                cursor: "pointer",
                                marginTop: "1rem",
                              }}
                              variant="filled"
                              size="md"
                              radius="lg"
                            >
                              {t("add_more")}
                            </Badge>
                          </Alert>
                        )}
                      </div>

                      <div className="flex items-center justify-between  border-b border-gray-3 pb-5 pt-5">
                        <p className="font-medium text-lg text-dark">
                          {t("total")}
                        </p>
                        <p className="font-medium text-lg text-dark text-right">
                          JD {grandTotal.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col pt-5">
                        <p className="font-medium text-md text-dark mb-2">
                          {t("payment_methods")}
                        </p>

                        <Radio.Group
                          name="paymentMethod"
                          value={paymentMethod}
                          onChange={setPaymentMethod}
                          className="mb-4"
                        >
                          <Grid gutter="xs">
                            <Grid.Col span={6}>
                              <Radio
                                value="cod"
                                label={t("cash_on_delivery")}
                                className="text-sm"
                              />
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Radio
                                value="click"
                                label={t("click_payment")}
                                className="text-sm"
                              />
                            </Grid.Col>
                          </Grid>
                        </Radio.Group>

                        {paymentMethod === "click" && (
                          <Alert
                            icon={<LuBadgeAlert size={20} />}
                            title={
                              <span className="font-semibold text-base">
                                {t("important_note")}
                              </span>
                            }
                            color="green"
                            radius="md"
                            variant="light"
                            className="text-sm leading-relaxed space-y-2"
                          >
                            <div>
                              {t("click_payment_instructions1")}{" "}
                              <Badge
                                radius="lg"
                                variant="filled"
                                className="mx-1 text-gray-1 bg-gradient-to-r from-green-light-4 via-green-500 to-green-dark"
                                style={{
                                  backgroundImage:
                                    "linear-gradient(to right, #68D391, #38A169, #2F855A)",
                                }}
                              >
                                albasheer9
                              </Badge>
                              {t("click_payment_instructions2")}
                            </div>

                            <a
                              href="https://wa.me/962796855578"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-green-700 hover:text-green-900 underline font-medium"
                            >
                              {t("contact_on_whatsapp")}
                            </a>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isOrdered}
                    className="w-full flex justify-center items-center gap-2 font-medium text-white bg-black py-3 px-6 rounded-md ease-out duration-200 mt-7.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {t("processing_checkout")}
                      </>
                    ) : (
                      t("order_now")
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : isOrdered ? (
          <MailSuccess />
        ) : (
          <div className="text-center mt-8">
            <div className="mx-auto pb-7.5 flex flex-col items-center gap-4">
              <div className="bg-black rounded-full p-4 inline-flex items-center justify-center">
                <MdOutlineShoppingCart size={48} className="text-white" />
              </div>
              <p className="py-8">{t("Your_cart_is_empty")}</p>
            </div>
            <Link
              href={{ pathname: "/", query: { focus: "categories" } }}
              className="inline-flex items-center gap-2 font-medium text-white bg-black py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              {t("continue_shopping")}
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Checkout;
