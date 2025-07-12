import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ColorTable from "./ColorTable";

export default async function ColorsManagement() {
const cookieStore = await cookies();
  const auth = cookieStore.get("auth");

  if (!auth || auth.value !== "true") {
    redirect("/signin");
  }
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Manage Colors</h1>
      <ColorTable  />
    </div>
  );
}
