"use client";
import React from "react";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { MdOutlineShoppingCart } from "react-icons/md";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const { t, i18n } = useTranslation();
  return (
    <>
      {/* <!-- ===== Breadcrumb Section Start ===== --> */}
      <section>
        <Breadcrumb title={"Cart"} pages={["Cart"]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
      {cartItems.length > 0 ? (
        <section
          className="overflow-hidden py-20 bg-gray-2"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
           

            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  {/* <!-- table header --> */}
                  <div className="flex items-center py-5.5 px-7.5">
                    <div className="min-w-[400px]">
                      <p className="text-dark">Product</p>
                    </div>
                    <div className="min-w-[180px]">
                      <p className="text-dark">Color</p>
                    </div>

                    <div className="min-w-[180px]">
                      <p className="text-dark">Price</p>
                    </div>

                    <div className="min-w-[275px]">
                      <p className="text-dark">Quantity</p>
                    </div>

                    <div className="min-w-[200px]">
                      <p className="text-dark">Subtotal</p>
                    </div>

                    <div className="min-w-[50px]">
                      <p className="text-dark text-right">Action</p>
                    </div>
                  </div>

                  {/* <!-- cart item --> */}
                  {cartItems.length > 0 &&
                    cartItems.map((item, key) => (
                      <SingleItem item={item} key={key} />
                    ))}
                </div>
              </div>
            </div>

           
          </div>
        </section>
      ) : (
        <>
       <div className="text-center mt-8">
  <div className="mx-auto pb-7.5 flex flex-col items-center gap-4">
    <div className="bg-black rounded-full p-4 inline-flex items-center justify-center">
      <MdOutlineShoppingCart size={48} className="text-white" />
    </div>
    <p className="py-8">{t("Your_cart_is_empty")}</p>
  </div>

  <Link
    href={{ pathname: "/", query: { focus: "categories" } }}
    className="inline-flex items-center gap-2 font-medium text-white bg-black py-3 px-6 rounded-md ease-out duration-200"
  >
    {t("continue_shopping")}
  </Link>
</div>

        </>
      )}
    </>
  );
};

export default Cart;
