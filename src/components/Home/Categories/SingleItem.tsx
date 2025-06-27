import Link from "next/link";
import { Category } from "@/types/category";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setSelectedCategoryName } from "@/redux/features/category-slice";
import { AppDispatch } from "@/redux/store";

const SingleItem = ({ item }: { item: Category }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Link
      href={`../../SubCategories?categoryId=${item.id}`}
      onClick={() => dispatch(setSelectedCategoryName(item.name))}
      className="group flex flex-col items-center"
    >
      {/* تكبير حجم الصورة والحاوية الخاصة بها */}
      <div className="w-[180px] h-[180px] max-w-[180px] max-h-[180px] sm:w-[160px] sm:h-[160px] sm:max-w-[160px] sm:max-h-[160px] flex items-center justify-center">
        <Image
          src={item.image}
          alt="Category"
          width={110} // أكبر من السابق
          height={110}
          className="sm:w-[110px] sm:h-[110px]"
        />
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {item.name}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
