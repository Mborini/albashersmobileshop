import { ImSpinner8 } from "react-icons/im";

export default function PreLoader() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white">
      <ImSpinner8
        size={64}
       
        className=" text-blue-light custom-spin"
      />
    </div>
  );
}
