import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { CiMail } from "react-icons/ci";
import { MdLocationPin } from "react-icons/md";

// الرقم الدولي للاتصال والواتساب، والرقم المحلي للعرض
const branches = [
  {
    nameKey: "Basheer_Shop_Opposite_Oppo",
    international: "+962796855578",
    display: "079 685 5578",
  },
  {
    nameKey: "Basheer_3",
    international: "+962796161536",
    display: "079 616 1536",
  },
  {
    nameKey: "Basheer_1_University_Circle",
    international: "+962790459191",
    display: "079 045 9191",
  },
];

const EMAIL = "albasheermbl@gmail.com";
const WHATSAPP_URL = "https://wa.me/962796855578";

const socialLinks = [
  {
    key: "facebook_page",
    label: "Facebook",
    href: "https://www.facebook.com/AlbasherShop/",
    Icon: FaFacebook,
    hover: "hover:text-blue",
  },
  {
    key: "instagram_page",
    label: "Instagram",
    href: "https://www.instagram.com/albasher.jo",
    Icon: FaInstagram,
    hover: "hover:text-orange",
  },
  {
    key: "whatsapp_page",
    label: "WhatsApp",
    href: WHATSAPP_URL,
    Icon: FaWhatsapp,
    hover: "hover:text-green",
  },
];

const quickLinks = [
  { key: "new_arrivals", href: "/new-arrivals-products" },
  { key: "best_offers", href: "/best-offers-products" },
  { key: "common_Brands", href: "/Brands" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <footer className="overflow-hidden bg-black mt-12 text-white">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pt-12.5 pb-10 xl:pb-15">
          {/* الفروع والتواصل */}
          <div className="w-full max-w-[380px]" dir={dir}>
            <h2 className="mb-7.5 text-custom-1 font-medium text-white">
              {t("Help_and_Support")}
            </h2>

            <ul className="flex flex-col gap-3">
              {branches.map((branch) => (
                <li
                  key={branch.nameKey}
                  className="rounded-lg border border-white/10 bg-white/5 p-3.5 transition-colors duration-200 hover:border-white/25 hover:bg-white/10"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                      <MdLocationPin size={20} />
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <span className="font-medium leading-snug">
                        {t(branch.nameKey)}
                      </span>

                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={`tel:${branch.international}`}
                          dir="ltr"
                          aria-label={`${t(branch.nameKey)} - ${branch.display}`}
                          className="flex items-center gap-2 text-sm text-gray-300 tracking-wide transition-colors duration-200 hover:text-white"
                        >
                          <FaPhoneAlt size={13} />
                          <span>{branch.display}</span>
                        </a>

                        <a
                          href={`https://wa.me/${branch.international.replace("+", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp ${branch.display}`}
                          className="text-gray-300 transition-colors duration-200 hover:text-green"
                        >
                          <FaWhatsapp size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}

              <li className="px-1 pt-1">
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 text-gray-300 transition-colors duration-200 hover:text-white"
                >
                  <CiMail size={24} className="flex-shrink-0" />
                  <span dir="ltr">{EMAIL}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* التواصل الاجتماعي */}
          <div className="w-full sm:w-auto" dir={dir}>
            <h2 className="mb-7.5 text-custom-1 font-medium text-white">
              {t("social_media")}
            </h2>

            <ul className="flex flex-col gap-3.5">
              {socialLinks.map(({ key, label, href, Icon, hover }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} Social Link`}
                    className={`flex items-center gap-x-2 ease-out duration-200 ${hover}`}
                  >
                    <Icon size={22} />
                    <span>{t(key)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط سريعة */}
          <div className="w-full sm:w-auto" dir={dir}>
            <h2 className="mb-7.5 text-custom-1 font-medium text-white">
              {t("just_for_you")}
            </h2>

            <ul className="flex flex-col gap-3">
              {quickLinks.map(({ key, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="ease-out duration-200 hover:text-blue"
                  >
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* الحقوق */}
      <div className="border-t border-white/10 py-5 xl:py-7.5">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="text-white text-sm sm:text-base font-medium">
              &copy; {year} Albasheer Shop. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm sm:text-base">
              Powered by{" "}
              <span className="text-white font-semibold">Matrix</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;