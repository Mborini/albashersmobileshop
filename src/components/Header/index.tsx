"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsCartPlus } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import { CiMenuBurger } from "react-icons/ci";
import { Drawer, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";

import Search from "./Search";
import Dropdown from "./Dropdown";
import { menuData } from "./menuData";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

import "../../app/lib/i18n";

const Header = () => {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [showNavBar, setShowNavBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { openCartModal } = useCartModalContext();
  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavBar(false);
      } else {
        setShowNavBar(true);
      }

      setStickyMenu(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full z-50 transition-all duration-300 ease-in-out transform
          ${showNavBar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
          ${
            stickyMenu
              ? "bg-white text-black shadow-md"
              : "bg-white bg-opacity-20 backdrop-blur-md text-black shadow-none"
          }
        `}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 lg:py-6 gap-4 flex-wrap sm:flex-nowrap">
            {/* شعار Albsher فقط */}
            <div className="flex items-center gap-2">
              <Link href="/">
                <Image
                  src="/images/logo/AlbsherLOGO.png"
                  alt="Albsher Logo"
                  width={120}
                  height={40}
                  priority
                  className="object-contain h-12"
                />
              </Link>

              {/* الشعار الثاني مخفي على الشاشات الصغيرة */}
              <Image
                src="/images/logo/albashername.png"
                alt="Albsher Name"
                width={120}
                height={40}
                priority
                className="object-contain h-12 hidden md:block"
              />
            </div>

            {/* عناصر يمين الهيدر */}
        
<div className="flex items-center gap-4 flex-1 justify-end">
  {/* الشاشات الصغيرة فقط: البحث + الكارت */}
  <div className="flex lg:hidden items-center gap-2">
    {/* زر البحث */}
    <Search />

    {/* زر الكارت */}
    <button
      onClick={openCartModal}
      className="relative flex items-center gap-2"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <BsCartPlus color="black" size={20} />
      <span className="absolute -top-3 -right-2 bg-white text-black rounded-full w-3 h-3 text-xs flex items-center justify-center">
        {product.length}
      </span>
    </button>
  </div>

  {/* باقي العناصر تظهر فقط على الشاشات الكبيرة */}
  <div className="hidden lg:flex items-center gap-4">
    {/* البحث */}
    <div className="max-w-sm">
      <Search />
    </div>

    {/* المفضلة */}
    <Link
      href="/wishlist"
      className="text-sm flex items-center gap-1 hover:text-blue-600"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <MdFavorite color="red" size={20} />
      {t("favorit")}
    </Link>

    {/* الكارت */}
    <button
      onClick={openCartModal}
      className="relative flex items-center gap-2"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <BsCartPlus color="black" size={20} />
      <span className={`absolute -top-4 -right-2  text-black rounded-full w-4 h-4 text-xs flex items-center justify-center
      ${
    stickyMenu ? "bg-black text-white" : "bg-gray"
  } `
      }>
        {product.length}
      </span>
      <span className="text-sm font-medium hover:text-blue-600">
        ${totalPrice}
      </span>
    </button>

    {/* زر تغيير اللغة */}
    <button
      onClick={() => changeLanguage(i18n.language === "en" ? "ar" : "en")}
      className="text-sm flex items-center gap-1 hover:text-blue-600"
    >
      <GrLanguage size={20} />
      {i18n.language === "en" ? "AR" : "EN"}
    </button>
  </div>

  {/* زر الهامبرجر يظهر في الشاشات الصغيرة فقط */}
  <button
    className="lg:hidden"
    onClick={open}
    aria-label="Open Navigation Drawer"
  >
    <CiMenuBurger size={24} />
  </button>
</div>


          </div>
        </div>

        {/* القائمة العلوية (تظهر على الشاشات الكبيرة فقط) */}
        <div
  dir={i18n.language === "ar" ? "rtl" : "ltr"}
  className={`transition-all duration-300 ease-in-out transform border-t ${
    stickyMenu ? "border-black" : "border-white"
  } ${
    showNavBar
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-4 pointer-events-none"
  }`}
>

          <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
            <nav className="hidden xl:flex items-center gap-6 py-4">
              <ul className="flex items-center gap-6">
                {menuData.map((menuItem, i) =>
                  menuItem.submenu ? (
                    <Dropdown
                      key={i}
                      menuItem={menuItem}
                      stickyMenu={stickyMenu}
                    />
                  ) : (
                    <li
                      key={i}
                      className="group relative before:w-0 before:h-[3px] before:bg-white before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full"
                    >
                      <Link
                        href={menuItem.path}
                        className={`text-custom-sm font-medium ${
                          stickyMenu ? "text-black" : "text-white"
                        } hover:text-blue-600`}
                      >
                        {t(menuItem.title)}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </div>

        {/* Drawer للموبايل */}
        <Drawer opened={opened} onClose={close} size="230px" position="right">
          <div className="flex flex-col mt-2 gap-4">
            {menuData.map((menuItem, idx) =>
              menuItem.submenu ? (
                <Dropdown
                  key={idx}
                  menuItem={menuItem}
                  stickyMenu={stickyMenu}
                />
              ) : (
                <Button
                  key={idx}
                  component={Link}
                  href={menuItem.path}
                  onClick={close}
                  variant="light"
                  size="sm"
                >
                  {t(menuItem.title)}
                </Button>
              )
            )}

            <Link
              href="/wishlist"
              className="text-sm flex items-center gap-1 text-gray-700 hover:text-blue-600"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
              onClick={close}
            >
              <MdFavorite color="red" size={20} />
              {t("favorit")}
            </Link>

            <button
              onClick={() => {
                changeLanguage(i18n.language === "en" ? "ar" : "en");
                close();
              }}
              className="mt-6 self-end flex text-sm items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <GrLanguage size={20} />
              {i18n.language === "en" ? "AR" : "EN"}
            </button>
          </div>
        </Drawer>
      </header>
    </>
  );
};

export default Header;
