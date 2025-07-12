import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PromoCodeTable from "./PromoCodeTable";


export default async function ProductsManagement() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth || auth.value !== "true") {
    redirect("/signin");
  }
  return <PromoCodeTable />;
}
