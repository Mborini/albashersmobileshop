import Link from "next/link";
import { MdFavorite } from "react-icons/md";
import { BsCartPlus } from "react-icons/bs";
import { GrLanguage } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";

import Flag from "react-world-flags";
import ChatPopup from "./ChatPopup";
import { BiSolidOffer } from "react-icons/bi";
import { TbCategoryFilled } from "react-icons/tb";
import { FaStarHalfAlt } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";

const MobileBottomNav = () => {
  const { t, i18n } = useTranslation();
  const { openCartModal } = useCartModalContext();
  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);

  const changeLanguage = () =>
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");

  return (
    // داخل return:
    <div className="fixed bottom-0 left-0 w-full bg-white flex justify-around items-center h-14 z-50 sm:hidden">
      {/* المفضلة */}

      <Link
  href="/?focus=categories"
  scroll={false} // مهم حتى ما يعيد تحميل الصفحة
  className="flex flex-col items-center text-gray-700 hover:text-blue-600"
>
  <TbCategoryFilled size={24} color="gray" />
  <span className="text-xs">{t("categories")}</span>
</Link>

      <Link
        href="/best-offers-products"
        className="flex flex-col items-center text-gray-700 hover:text-blue-600"
      >
        <BiSolidOffer size={24} color="green" />
        <span className="text-xs">{t("best_offers")}</span>
      </Link>
      <Link
        href="/new-arrivals-products"
        className="flex flex-col items-center text-gray-700 hover:text-blue-600"
      >
        <FaStarHalfAlt size={24} color="orange" />
        <span className="text-xs">{t("new_arrivals")}</span>
      </Link>
      <Link
        href="/wishlist"
        className="flex flex-col items-center text-gray-700 hover:text-blue-600"
      >
        <MdFavorite size={24} color="red" />
        <span className="text-xs">{t("favorit")}</span>
      </Link>
      {/* السلة */}
      <button
        onClick={openCartModal}
        className="relative flex flex-col items-center text-gray-700 hover:text-blue-600"
      >
        <FiShoppingBag size={24} />
        <span className="text-xs">{t("cart")}</span>
        {product.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {product.length}
          </span>
        )}
      </button>

      {/* زر الشات */}
      <ChatPopup />
    </div>
  );
};

export default MobileBottomNav;
