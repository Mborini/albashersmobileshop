import React from "react";
import Link from "next/link";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

const EmptyCart = () => {
  const { closeCartModal } = useCartModalContext();

  return (
    <div className="text-center">
      <div className="mx-auto pb-7.5">
      
      </div>

      <p className="pb-6">Your cart is empty!</p>

      <Link
        onClick={() => closeCartModal()}
        href={{ pathname: "/", query: { focus: "categories" } }}

        className="w-full lg:w-10/12 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;