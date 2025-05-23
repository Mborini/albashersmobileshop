import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Card from "./Card";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth || auth.value !== "true") {
    redirect("/signin");
  }

  const cards = [
    { name: "Categories", path: "managment/categories" },
    { name: "Sub Categories", path: "managment/subCategories" },
    { name: "Products", path: "/products" },
    { name: "Brands", path: "managment/brands" },
    { name: "Images", path: "/images" },
    { name: "Orders", path: "/orders" },
    { name: "Clients", path: "/clients" },
  ];

  return (
    <div className="overflow-hidden min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer">
        {cards.map((card) => (
          <Card key={card.name} name={card.name} path={card.path} />
        ))}
      </div>
    </div>
  );
}
