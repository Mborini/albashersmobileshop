import Link from "next/link";
import { subCategory } from "@/types/subCategory";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setSelectedSubCategoryName } from "@/redux/features/subCategory-slice";

const SingleSubCategory = ({ item }: { item: subCategory }) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Link
      href={`../../products?subCategoryId=${item.id}`}
      onClick={() => dispatch(setSelectedSubCategoryName(item.name))}
      className="group flex flex-col items-center"
    >
      <div className="flex flex-col items-center justify-center text-center">
      <div className="max-w-[150px] w-75 bg-[#F2F3F8] h-75 max-h-[150px] border-2 border-blue-light rounded-full flex items-center justify-center mb-4">
             <Image
            src={"/images/categories/laptop.png"}
            alt="subCategory"
            width={90}
            height={90}
          />
        </div>

        <div className="flex justify-center">
          <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
            {item.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default SingleSubCategory;
