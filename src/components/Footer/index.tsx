import React from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { CiMail } from "react-icons/ci";
import { MdLocationPin } from "react-icons/md";

const Footer = () => {
  const year = new Date().getFullYear();
  const { t, i18n } = useTranslation();

  return (
    <footer className="overflow-hidden bg-black mt-12 text-white">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- footer menu start --> */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pt-12.5 xl:pt-12.5 pb-10 xl:pb-15">
          <div
            className="max-w-[330px] w-full"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <h2 className="mb-7.5 text-custom-1 font-medium text-white">
              {t("Help_and_Support")}
            </h2>

            <ul className="flex flex-col gap-3">
              <li className="flex gap-4.5">
                <span className="flex-shrink-0">
                  <MdLocationPin color="white" size={24} />
                </span>
                {t("Qupa_Circle_Irbid_Jordan")}
              </li>

              <li>
                <div className="flex items-center gap-4.5">
                  <FaPhoneAlt color="white" size={20} />

                  <span dir="ltr">(+962) 796 855 578</span>
                </div>
              </li>

              <li>
                <div className="flex items-center gap-4.5">
                  <CiMail color="white" size={24} />
                  albasheermbl@gmail.com{" "}
                </div>
              </li>
            </ul>
          </div>

          <div
            className="w-full sm:w-auto"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <h2 className="mb-7.5 text-custom-1 font-medium text-white">
              {t("social_media")}
            </h2>

            <ul className="flex flex-col gap-3.5">
              <li>
                <a
                  href="https://www.facebook.com/AlbasherShop/"
                  aria-label="Facebook Social Link"
                  className="flex items-center gap-x-2 ease-out duration-200 hover:text-blue"
                  dir={i18n.language === "ar" ? "rtl" : "ltr"}
                >
                  <FaFacebook size={22} />
                  <span>{t("facebook_page")}</span>
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/albasher.jo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
                  aria-label="Instagram Social Link"
                  className="flex items-center gap-x-2 ease-out duration-200 hover:text-orange"
                  dir={i18n.language === "ar" ? "rtl" : "ltr"}
                >
                  <FaInstagram size={22} />
                  <span>{t("instagram_page")}</span>
                </a>
              </li>

              <li>
                <a
                  href="https://api.whatsapp.com/send?phone=%2B962796855578&context=AffBft21GKovicFAmDVyUobbJSKgoFY_mKRzHwQkoRatO-3aXnjDeMOeBMnHPOl1my9Br6AkHUqNpVFlsGcvI-1nuWn8vBw-5bhvIv40x1YFVr0yNElt1kRHQ3G_VdN6VbazRr4XwakUDXYNYwEwmIh-OQ&source=FB_Page&app=facebook&entry_point=page_cta&fbclid=IwY2xjawKmyv9leHRuA2FlbQIxMABicmlkETFXaDVlZ040NFdMY05pOVRZAR7Okbmf6z6u3jERV8n0vVwZkA2_VvQ6Qv6Mv6DvWoRaINFFEvpmhMUwvuidHg_aem__njuoxiBAiwe17ajvov-ZA"
                  aria-label="WhatsApp Social Link"
                  className="flex items-center gap-x-2 ease-out duration-200 hover:text-green"
                  dir={i18n.language === "ar" ? "rtl" : "ltr"}
                >
                  <FaWhatsapp size={22} />
                  <span>{t("whatsapp_page")}</span>
                </a>
              </li>
            </ul>
          </div>

          <div
            className="w-full sm:w-auto"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <h2 className="mb-7.5 text-custom-1 font-medium text-white">
              {t("just_for_you")}
            </h2>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  className="ease-out duration-200 hover:text-blue"
                  href="/new-arrivals-products"
                >
                  {t("new_arrivals")}
                </a>
              </li>
              <li>
                <a
                  className="ease-out duration-200 hover:text-blue"
                  href="/best-offers-products"
                >
                  {t("best_offers")}
                </a>
              </li>
              <li>
                <a
                  className="ease-out duration-200 hover:text-blue"
                  href="/Brands"
                >
                  {t("common_Brands")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* <!-- footer menu end --> */}
      </div>

      {/* <!-- Footer Bottom Start --> */}
      <footer className="bg-black py-5 xl:py-7.5">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="text-white text-sm sm:text-base font-medium">
              &copy; {new Date().getFullYear()} Albasheer Shop. All rights
              reserved.
            </p>
            <p className="text-gray-400 text-sm sm:text-base">
              Powered by{" "}
              <span className="text-white hover:text-primary font-semibold transition">
                MBorini
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* <!-- footer bottom end --> */}
    </footer>
  );
};

export default Footer;
