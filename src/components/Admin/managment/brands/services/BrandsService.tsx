import { Brand } from "@/types/brand";

const API_URL = "/api/Admin/brands";

export async function fetchBrands() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch SubCategories");
  return await res.json();
}

export async function addBrand(brand: Brand) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brand),
  });
  if (!res.ok) throw new Error("Failed to add Brand");
  return await res.json();
}

export async function updateBrand(id: number, brand: Brand) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brand),
  });
  if (!res.ok) throw new Error("Failed to update Brand");
  return await res.json();
}
export async function deleteBrand(id: number) {
  const response = await fetch(`/api/Admin/brands/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.error || "Failed to delete brand");
    throw error;
  }
  return true;
}
