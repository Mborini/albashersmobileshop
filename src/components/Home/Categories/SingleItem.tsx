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
        {/* صورة التصنيف */}
        <div className="w-[200px] h-[200px] sm:w-[180px] sm:h-[180px] flex items-center justify-center">
        <Image
            src={item.image}
            alt="Category"
            width={110}
            height={110}
            className="sm:w-[110px] sm:h-[110px]"
          />
        </div>

        {/* اسم التصنيف */}
        <div className="flex justify-center">
        <h3 className="inline-block text-lg sm:text-xl font-semibold text-center text-dark bg-gradient-to-r from-gray-7 to-gary-7 bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-gray-6">
        {item.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default SingleItem;
