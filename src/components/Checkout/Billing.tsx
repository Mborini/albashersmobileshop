"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Billing = () => {
  const { t, i18n } = useTranslation();

  return (
    <div dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="bg-white shadow-1 rounded-[10px] p-4 mb-6">
        <h2 className="font-medium text-dark text-xl sm:text-2xl">
          {t("billing.title")}
        </h2>
      </div>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className="block mb-2.5">
              {t("billing.firstName")} <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder={t("billing.firstName")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block mb-2.5">
              {t("billing.lastName")} <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder={t("billing.lastName")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full mb-5">
            <label htmlFor="email" className="block mb-2.5">
              {t("billing.email")} <span className="text-red">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder={t("billing.email")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="w-full mb-5">
            <label htmlFor="phone" className="block mb-2.5">
              {t("billing.phone")} <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder={t("billing.phone")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full mb-5">
            <label htmlFor="country" className="block mb-2.5">
              {t("billing.country")} <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="country"
              id="country"
              placeholder={t("billing.country")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="w-full mb-5">
            <label htmlFor="city" className="block mb-2.5">
              {t("billing.city")} <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="city"
              id="city"
              placeholder={t("billing.city")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5">
            {t("billing.address")} <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder={t("billing.addressPlaceholder")}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5.5">
          <div>
            <label htmlFor="note" className="block mb-2.5">
              {t("billing.notes")}
            </label>
            <textarea
              name="note"
              id="note"
              rows={5}
              placeholder={t("billing.notesPlaceholder")}
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
