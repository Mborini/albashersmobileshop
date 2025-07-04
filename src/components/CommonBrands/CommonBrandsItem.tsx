import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

type Brand = {
  id: number;
  image: string;
  name: string;
  title: string;
};

const CommonBrandItem = ({
  item,
  isSmall = false,
  isApple = false,
}: {
  item: Brand;
  isSmall?: boolean;
  isApple?: boolean;
}) => {
  const { t } = useTranslation();

  if (isApple) {
    return (
      <Link href={`/ProductsBrands/${item.id}`}>
        <div className="shadow-1 bg-black rounded-xl px-4 sm:px-5 pt-8 sm:pt-10 pb-6 flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer">
          {/* صورة واسم Apple */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
            src={item.image}
              alt="apple"
              width={70}
              height={70}
              style={{ objectFit: "contain" }}
              className="sm:w-[100px] sm:h-[100px]"
            />
            <span className="text-2xl sm:text-4xl font-bold text-[#f2f2f2]">
              APPLE
            </span>
          </div>

          {/* زر SHOP NOW مع تأثير نبض دائم */}
          <motion.div
            className="relative flex items-center justify-center mt-1 sm:mt-2 w-full max-w-[150px]"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="relative z-10 inline-block bg-white text-black font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-md w-full text-center">
              {t("shop_now")}
            </span>
          </motion.div>
        </div>
      </Link>
    );
  }

  return (
    <div className="shadow-1 bg-white rounded-xl px-3 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4">
      <Link href={`/ProductsBrands/${item.id}`}>
        <div className="w-full h-[120px] sm:h-[150px] flex items-center justify-center">
          <Image
            src={item.image}
            alt="brand"
            className="rounded-md max-h-full max-w-full"
            width={150}
            height={150}
            style={{ objectFit: "contain" }}
            priority={isSmall}
          />
        </div>

        <div className="bg-black rounded-md px-2 sm:px-3 text-center">
          <span className="text-white font-semibold text-sm sm:text-base">
            {t("shop_now")}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default CommonBrandItem;
