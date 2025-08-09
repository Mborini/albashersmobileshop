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
<div
  className="
    w-[100px] h-[100px] md:w-[130px] md:h-[130px] 
    lg:w-[150px] lg:h-[150px] xl:w-[180px] xl:h-[180px] 
    rounded-full bg-gray-3 shadow-md overflow-hidden
    relative
    flex items-center justify-center
    transition-colors duration-300
    group-hover:bg-gray-4
  "
>
  <div className="w-[80%] h-[80%] relative">
    <Image
      src={item.image}
      alt="Category"
      fill
      style={{ objectFit: "contain", backgroundColor: "transparent" }}
      sizes="(max-width: 640px) 80px, (max-width: 768px) 104px, (max-width: 1024px) 120px, 144px"
      priority
    />
  </div>
</div>



        {/* اسم التصنيف */}
        <div className="flex justify-center mt-3">
          <h3 className="inline-block text-base sm:text-lg md:text-xl font-semibold text-center">
            {item.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default SingleSubCategory;
