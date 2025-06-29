"use client";

import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import MailSuccess from "../MailSuccess";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { FaSpinner } from "react-icons/fa";
import Link from "next/link";

import OtpModal from "./OtpModal"; // استدعاء مودال OTP
import i18next from "i18next";
import { useTranslation } from "react-i18next";
type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  note?: string; // اختياري إذا كان المستخدم ممكن يتركه فاضي
  cartItems: { title: string; quantity: number; discountedPrice: number }[];
  totalPrice: number;
};

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [otpModalOpened, setOtpModalOpened] = useState(false); // فتح المودال بشكل افتراضي
  const [userEmail, setUserEmail] = useState("");
  const [formDataStored, setFormDataStored] = useState<any>(null); // لتخزين بيانات الفورم حتى بعد فتح المودال

  // دالة لإرسال OTP إلى الايميل
  const sendOtp = async (email: string) => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lang: i18n.language }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "فشل إرسال رمز التحقق");
    }
  };

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
          totalPrice,
          cartItems,
          country: data.country,
          city: data.city,
          address: data.address,
          note: data.note,
          lang: i18next.language,
        }),
      });

      toast.success(t("success"));
      dispatch(removeAllItemsFromCart());
      setIsLoading(false); // هنا يمكن إزالته أو تركه حسب الحاجة
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || t("error"));
      setIsLoading(false);
      throw error; // ارفع الخطأ ليتعامل معه onOtpVerified
    }
  };

  const onclose = () => {
    setOtpModalOpened(false);
    setIsLoading(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: CheckoutFormData = {
      ...(Object.fromEntries(formData.entries()) as any),
      cartItems,
      totalPrice,
    };

    try {
      await sendOtp(data.email as string);
      setUserEmail(data.email as string);
      setFormDataStored(data);
      setOtpModalOpened(true); // افتح مودال إدخال OTP
    } catch (error: any) {
      toast.error(error.message || t("error"));
      setIsLoading(false);
    }
  };

  // عند نجاح التحقق من OTP
  const onOtpVerified = async () => {
    if (!formDataStored) return;
    setIsLoading(true); // عطّل الزر لأن العملية بدأت
    try {
      await sender(formDataStored);
      setOtpModalOpened(false);
      setIsOrdered(true); // بعد نجاح العملية، الزر يبقى معطل
    } catch (error) {
      setIsLoading(false); // في حال فشل الإرسال، يسمح بالضغط مجددًا
    }
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
                  dir={i18n.language === "ar" ? "rtl" : "ltr"}
                  className="max-w-[455px] w-full"
                >
                  <div className="bg-white shadow-1 rounded-[10px]">
                    <div className="border-b border-gray-3 rounded-t-[10px] py-5 px-4 sm:px-8.5 bg-black text-white">
                      <h2 className="font-medium text-xl ">
                        {t("order_summary")}
                      </h2>
                    </div>

                    <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <h4 className="font-medium text-dark">
                            {t("product")}
                          </h4>
                        </div>
                        <div>
                          <h4 className="font-medium text-dark text-right">
                            {t("price")}
                          </h4>
                        </div>
                      </div>

                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-5 border-b border-gray-3"
                        >
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-dark">{item.title}</p>
                              <div className="text-custom-sm flex items-center gap-2 mb-1">
                                {item.color && (
                                  <>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                                      {t("color")}:
                                    </p>
                                    <span
                                      title={item.color}
                                      style={{ backgroundColor: item.color }}
                                      className="w-5 h-5 rounded-full border border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-200"
                                    ></span>
                                  </>
                                )}
                              </div>

                              <p className="text-sm text-gray-600">
                                {t("quantity")} : {item.quantity}
                              </p>
                            </div>
                          </div>

                          <p className="text-dark text-right">
                            JOD{" "}
                            {(item.discountedPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}

                      <div className="flex items-center border-b border-gray-3 pb-5 justify-between pt-5">
                        <div>
                          <p className="font-medium text-md text-dark">
                            {t("shipping")}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-md text-dark text-right">
                            {t("free")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center border-b border-gray-3 pb-5 justify-between pt-5">
                        <div>
                          <p className="font-medium text-md text-dark">
                            {t("payment_methods")}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-md text-dark text-right">
                            {t("chash_on_delivery")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-5">
                        <div>
                          <p className="font-medium text-lg text-dark">
                            {t("total")}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-lg text-dark text-right">
                            JOD {totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isOrdered} // يبقى معطل حتى انتهاء العملية والطلب ناجح
                    className="w-full flex justify-center items-center gap-2 font-medium text-white bg-black py-3 px-6 rounded-md ease-out duration-200  mt-7.5 disabled:opacity-70 disabled:cursor-not-allowed"
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
            <div className="mx-auto pb-1">
              {/* ... SVG هنا كما هو */}
              <svg
                className="mx-auto"
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* ... (نفس SVG في كودك السابق) */}
              </svg>
            </div>

            <p className="pb-6">{t("Your_cart_is_empty")}</p>

            <Link
              href={{ pathname: "/", query: { focus: "categories" } }}
              className="inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              {t("continue_shopping")}
            </Link>
          </div>
        )}

        {/* مودال OTP */}
        <OtpModal
          opened={otpModalOpened}
          onClose={onclose}
          email={userEmail}
          onVerified={onOtpVerified}
        />
      </section>
    </>
  );
};

export default Checkout;
