import Link from "next/link";

type CardProps = {
  name: string;
  path: string;
};

export default function Card({ name, path }: CardProps) {
  return (
    <Link href={path}>
       
      <div className="bg-blue-light text-white rounded-xl shadow-md py-14 px-6 flex flex-col items-center transform transition-transform duration-500 hover:scale-110">
        <p className="text-3xl font-bold text-blue-600">{name}</p>
      </div>
    
    </Link>
  );
}
