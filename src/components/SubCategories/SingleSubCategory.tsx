"use client";

import Link from "next/link";
import { subCategory } from "@/types/subCategory";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setSelectedSubCategoryName } from "@/redux/features/subCategory-slice";
import { motion } from "framer-motion";

const SingleSubCategory = ({ item }: { item: subCategory }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <Link
        href={`../../products?subCategoryId=${item.id}`}
        onClick={() => dispatch(setSelectedSubCategoryName(item.name))}
        className="group flex flex-col items-center"
      >
        <div className="flex flex-col items-center justify-center text-center">
        <div className="w-[200px] h-[200px] sm:w-[180px] sm:h-[180px] flex items-center justify-center">
            <Image
              src={item.image}
              alt="Category"
              width={110}
              height={110}
              className="sm:w-[110px] sm:h-[110px]"
            />
          </div>

          <div className="flex justify-center">
          <h3 className="inline-block text-lg sm:text-xl font-semibold text-center text-dark bg-gradient-to-r from-gray-7 to-gary-7 bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-gray-6">
          {item.name}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SingleSubCategory;
