import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import BrandsCard from "./Card";

export default async function BrandsManagement() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth || auth.value !== "true") {
    redirect("/signin");
  }

  return <BrandsCard />;
}
