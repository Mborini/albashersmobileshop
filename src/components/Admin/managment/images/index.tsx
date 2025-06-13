import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ImagesCard from "./Card";



export default async function ImagesManagement() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth || auth.value !== "true") {
    redirect("/signin");
  }

  return <ImagesCard />;
}
