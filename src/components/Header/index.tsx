"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsBagHeart, BsCartPlus, BsFillBagHeartFill } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import { CiMenuBurger } from "react-icons/ci";
import { Drawer, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import Search from "./Search";
import Dropdown from "./Dropdown";
import { menuData } from "./menuData";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

import "../../app/lib/i18n";
import { FiShoppingBag } from "react-icons/fi";

const Header = () => {
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModalContext();
  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setStickyMenu(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={
        "fixed left-0 top-0 w-full z-50 transition-colors duration-300 ease-in-out bg-white text-black shadow-md"
      }
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4 flex-wrap">
          {/* شعار Albsher */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="/images/logo/AlbsherLOGO.png"
                alt="Albsher Logo"
                width={100}
                height={20}
                priority
                className="object-contain h-8"
              />
            </Link>
            <Image
              src="/images/logo/albashername.png"
              alt="Albsher Name"
              width={100}
              height={20}
              priority
              className="object-contain h-8"
            />
          </div>

          {/* القائمة الرئيسية (مخفي في الموبايل) */}
          <nav className="hidden xl:flex items-center gap-6 flex-1 justify-center">
            <ul className="flex items-center gap-6 relative z-50">
              {menuData.map((menuItem, i) =>
                menuItem.submenu ? (
                  <Dropdown
                    key={i}
                    menuItem={menuItem}
                    stickyMenu={stickyMenu}
                  />
                ) : (
                  <li key={i}>
                    <Link href={menuItem.path} legacyBehavior>
                      <a
                        className={`group relative px-2 py-1 text-sm font-medium inline-block overflow-hidden ${
                          stickyMenu ? "text-black" : "text-black"
                        }`}
                      >
                        {t(menuItem.title)}
                        <span className="absolute bottom-0 left-0 h-0.5 bg-blue-600 w-0 group-hover:w-full transition-all duration-300 ease-in-out" />
                      </a>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* أدوات الهيدر */}
          <div className="flex items-center font-semibold gap-3">
            {/* البحث - يظهر فقط في الموبايل */}
            <div className="  ">
              <Search />
            </div>

            {/* باقي الأدوات - تظهر فقط من lg وفوق */}
            <div className="hidden lg:flex items-center gap-4">
              {/* المفضلة */}
              <Link
                href="/wishlist"
                className="flex items-center gap-1 text-sm hover:text-blue-600"
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
              >
                <BsFillBagHeartFill color="red" size={20} />
                <span>{t("favorit")}</span>
              </Link>

              {/* الكارت */}
              <button
                onClick={openCartModal}
                className="relative flex items-center gap-1 text-sm font-semibold hover:text-blue-600"
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
              >
                <FiShoppingBag color="black" size={20} />
                <span
                  className={`absolute -top-2 ${
                    i18n.language === "en" ? "-left-2" : "-right-2"
                  } text-white bg-black rounded-full w-4 h-4 text-xs flex items-center justify-center`}
                >
                  {product.length}
                </span>

                <span>JOD {totalPrice}</span>
              </button>

              {/* زر تغيير اللغة */}
              <button
                onClick={() => {
                  changeLanguage(i18n.language === "en" ? "ar" : "en");
                  close();
                  
                }}
                className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600"
              >
                <Flag
                  code={i18n.language === "en" ? "GB" : "JO"}
                  style={{ width: 18, height: 18 }}
                  dir={i18n.language === "ar" ? "rtl" : "ltr"}
                />
                <span>{i18n.language === "en" ? "EN" : "AR"}</span>
              </button>
            </div>

            {/* زر الهامبرغر - يظهر دائمًا فقط في الشاشات الصغيرة */}
            <button className="xl:hidden" onClick={open}>
              <CiMenuBurger size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer للموبايل */}
      <Drawer opened={opened} onClose={close} size="230px" position="right">
  <div className="flex flex-col mt-2 gap-4">
    {menuData.map((menuItem, idx) =>
      menuItem.submenu ? (
        <Dropdown key={idx} menuItem={menuItem} stickyMenu={stickyMenu} />
      ) : (
        <Link
        key={idx}
        href={menuItem.path}
        onClick={close}
        className="inline-flex items-center justify-center bg-black text-white hover:bg-black px-3 py-2 rounded text-sm"
      >
        {t(menuItem.title)}
      </Link>
      
      )
    )}

    {/* Wishlist Button Styled */}
    <Link
      href="/wishlist"
      className="text-sm font-bold flex items-center justify-center gap-1 bg-black text-white hover:bg-black px-3 py-2 rounded"
      
      onClick={close}
    >
     
      {t("favorit")}
    </Link>

    {/* Language Switch Button Styled */}
    <button
  onClick={() => {
    changeLanguage(i18n.language === "en" ? "ar" : "en");
  }}
  className="w-full justify-center flex items-center gap-3 bg-black text-white hover:bg-black px-3 py-2 rounded text-sm"
  
>
  <Flag
    code={i18n.language === "en" ? "GB" : "JO"}
    style={{ width: 18, height: 12 }}
  />
  <span>{i18n.language === "en" ? "EN" : "AR"}</span>
</button>

  </div>
</Drawer>

    </header>
  );
};

export default Header;
