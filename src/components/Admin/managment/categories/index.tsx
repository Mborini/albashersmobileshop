import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import CategoriesCard from "./Card";

export default async function CategoriesManagement() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth || auth.value !== "true") {
    redirect("/signin");
  }

  return <CategoriesCard />;
}
