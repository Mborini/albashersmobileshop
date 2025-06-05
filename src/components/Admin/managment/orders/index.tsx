import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrderCard from "./Card";




export default async function OrdersManagement() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth || auth.value !== "true") {
    redirect("/signin");
  }

  return <OrderCard />;
}
