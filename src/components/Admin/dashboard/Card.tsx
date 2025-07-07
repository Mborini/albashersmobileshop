"use client";

import {
  MdCategory,
  MdLayers,
  MdInventory,
  MdImage,
  MdShoppingCart,
  MdSettings,
  MdStorage,
} from "react-icons/md";
import { FiTag } from "react-icons/fi";

import { useRouter } from "next/navigation";
import path from "node:path";
import { TbTruckDelivery } from "react-icons/tb";

const mockdata = [
  {
    title: "Categories",
    icon: MdCategory,
    color: "text-yellow-dark",
    path: "managment/categories",
  },
  {
    title: "Sub Categories",
    icon: MdLayers,
    color: "text-violet",
    path: "managment/subCategories",
  },
  {
    title: "Products",
    icon: MdInventory,
    color: "text-green",
    path: "managment/products",
  },
  {
    title: "Brands",
    icon: FiTag,
    color: "text-teal",
    path: "managment/brands",
  },
  {
    title: "Images",
    icon: MdImage,
    color: "text-indigo",
    path: "managment/images",
  },
  {
    title: "Orders",
    icon: MdShoppingCart,
    color: "text-pink",
    path: "managment/orders",
  },
  {
    title: "Attributes",
    icon: MdSettings,
    color: "text-orange",
    path: "managment/attributes",
  },
  {
    title: "Delivery Price",
    icon: TbTruckDelivery,
    color: "text-blue",
    path: "managment/deliveryPrice",
  },
  {
    title: "Monitors",
    icon: MdStorage,

    color: "text-dark",
    path: "managment/monitors",
  },
];

export default function ActionsGrid() {
  const router = useRouter();

  return (
    <div className="bg-gray-2 rounded-lg p-6 ">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 ">
        {mockdata.map((item) => (
          <button
            key={item.title}
            onClick={() => router.push(`/${item.path}`)}
            className="flex flex-col items-center p-6 rounded-lg bg-white hover:cursor-pointer hover:scale-105 transform duration-200 hover:shadow-md "
          >
            <item.icon size={48} className={`${item.color}`} />
            <span className="text-sm mt-3 font-medium">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
