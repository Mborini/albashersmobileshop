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
     <div className="w-[120px] h-[120px] max-w-[120px] max-h-[120px] sm:w-[150px] sm:h-[150px] sm:max-w-[150px] sm:max-h-[150px] bg-[#F2F3F8] border-2 border-blue-light rounded-full flex items-center justify-center ">
  <Image src={item.image} alt="Category" width={70} height={70} className="sm:w-[90px] sm:h-[90px]" />
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
