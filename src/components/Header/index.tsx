"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsCartPlus } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";
import { GrLanguage } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { Drawer, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import CustomSelect from "./CustomSelect";
import Dropdown from "./Dropdown";
import { menuData } from "./menuData";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

import "../../app/lib/i18n";
import Serach from "./CustomSelect";

const Header = () => {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false); // <-- FIXED: missing state
  const { openCartModal } = useCartModalContext();

  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const handleStickyMenu = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 w-full z-50 bg-white transition-all duration-300 ${
        stickyMenu ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 lg:py-6 gap-4 flex-wrap">
          <Link href="/">
            <Image
              src="/images/logo/AlbsherLOGO.png"
              alt="Albsher Logo"
              width={160}
              height={40}
              priority
              className="object-contain h-12"
            />
          </Link>
<div>
  <Serach/> 
  </div>
          <div className="flex items-center gap-4">
            <Link
              href="/wishlist"
              className="text-sm flex items-center gap-1 text-red-600 hover:text-red-dark"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <MdFavorite color="red" size={20} /> {t("favorit")}
            </Link>

            <span className="xl:block w-px h-7.5 bg-gray-4" />

            <button
              onClick={openCartModal}
              className="relative flex items-center gap-2"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <BsCartPlus color="blue" size={20}  />
              <span className="absolute -top-4 -right-2 bg-blue-light-2 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {product.length}
              </span>
              <span className="text-sm font-medium">${totalPrice}</span>
            </button>

            <span className="xl:block w-px h-7.5 bg-gray-4" />

            <button
              onClick={() =>
                changeLanguage(i18n.language === "en" ? "ar" : "en")
              }
              className="hidden lg:flex text-sm items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <GrLanguage color="green" size={20} />
              {i18n.language === "en" ? "AR" : "EN"}
            </button>

            <button
              className="lg:hidden text-gray-800"
              onClick={open}
              aria-label="Open Navigation Drawer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 6.75h16.5m-16.5 6.75h16.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* NavBar */}
        <div
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          className="border-t border-gray-3"
        >
          <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
            <div className="flex items-center justify-between">
              <div
                className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between ${
                  navigationOpen
                    ? "!visible bg-white shadow-lg border border-gray-3 !h-auto max-h-[400px] overflow-y-scroll rounded-md p-5"
                    : ""
                }`}
              >
                <nav>
                  <ul className="flex xl:items-center flex-col xl:flex-row gap-5 xl:gap-6">
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
                          className="group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full"
                        >
                          <Link
                            href={menuItem.path}
                            className={`hover:text-blue text-custom-sm font-medium text-dark flex ${
                              stickyMenu ? "xl:py-4" : "xl:py-6"
                            }`}
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
          </div>
        </div>
      </div>

      {/* Drawer for Mobile */}
      <Drawer opened={opened} onClose={close} size="230px" position="right">
        <div className="flex flex-col mt-2 gap-4">
          {menuData.map((menuItem, idx) => (
            <React.Fragment key={idx}>
              {menuItem.submenu ? (
                <Dropdown menuItem={menuItem} stickyMenu={stickyMenu} />
              ) : (
                <Button
                  component={Link}
                  href={menuItem.path}
                  onClick={close}
                  variant="light"
                  size="sm"
                >
                  {t(menuItem.title)}{" "}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Language Switch */}
        <button
          onClick={() => changeLanguage(i18n.language === "en" ? "ar" : "en")}
          className="lg:hidden mt-6 self-end flex text-sm items-center gap-1 text-gray-700 hover:text-blue-600"
        >
          <GrLanguage color="green" size={20} />
          {i18n.language === "en" ? "AR" : "EN"}
        </button>
      </Drawer>
    </header>
  );
};

export default Header;
