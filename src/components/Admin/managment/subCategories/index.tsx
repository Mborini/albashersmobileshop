import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import SubCategoriesCard from "./Card";

export default async function SubCategoriesManagement() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth || auth.value !== "true") {
    redirect("/signin");
  }

  return <SubCategoriesCard />;
}
