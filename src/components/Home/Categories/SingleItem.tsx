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
        <div className="w-[250px] h-[250px] sm:w-[220px] sm:h-[220px] flex items-center justify-center">
          <Image
            src={item.image}
            alt="Category"
            width={160}
            height={160}
            className="sm:w-[160px] sm:h-[160px]"
          />
        </div>

        {/* اسم التصنيف */}
        <div className="flex justify-center">
         <h3 className="inline-block text-xl sm:text-2xl font-semibold text-center ...">
  {item.name}
</h3>

        </div>
      </Link>
    </motion.div>
  );
};

export default SingleItem;
