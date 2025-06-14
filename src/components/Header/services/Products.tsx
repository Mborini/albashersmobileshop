// services/Products.ts
const API_URL = "/api/products";

export async function fetchAllProducts(search: string) {
  const res = await fetch(`${API_URL}?search=${encodeURIComponent(search)}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}
