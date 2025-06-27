import { LuLoader } from "react-icons/lu";

export default function PreLoader() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white">
      <LuLoader   
        size={64}
       
        className=" text-black custom-spin"
      />
    </div>
  );
}
