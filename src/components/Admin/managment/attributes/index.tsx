import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import CategoriesCard from "./Card";
import AttrCard from "./Card";

export default async function AttributsManagement() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth || auth.value !== "true") {
    redirect("/signin");
  }

  return <AttrCard />;
}
