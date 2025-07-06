import { motion } from "framer-motion"; // تأكد من الاستيراد
import Link from "next/link";
import { Category } from "@/types/category";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setSelectedCategoryName } from "@/redux/features/category-slice";
import { AppDispatch } from "@/redux/store";

const SingleItem = ({ item }: { item: Category }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <Link
        href={`../../SubCategories?categoryId=${item.id}`}
        onClick={() => dispatch(setSelectedCategoryName(item.name))}
        className="group flex flex-col items-center"
      >
        <div className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] lg:w-[150px] lg:h-[150px] xl:w-[180px] xl:h-[180px] flex items-center justify-center">
          <Image
            src={item.image}
            alt="Category"
            width={160}
            height={160}
            className="w-full h-full object-contain"
          />
        </div>

        {/* اسم التصنيف */}
        <div className="flex justify-center">
          <h3 className="inline-block text-base sm:text-lg md:text-xl font-semibold text-center">
            {item.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default SingleItem;
