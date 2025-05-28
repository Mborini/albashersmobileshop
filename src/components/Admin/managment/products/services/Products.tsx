import { Product } from "@/types/product";

const API_URL = "/api/Admin/products";

export async function fetchProducts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
  
}

export async function addProduct(product: Product) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to add product");
  return await res.json();
}

export async function updateProduct(id: number, product: Product) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return await res.json();
}
export async function deleteProduct(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.error || "Failed to delete product");
    throw error;
  }
  return true;
}
//fetchAttributes send id in body
export async function fetchAttributes(id) {
  const res = await fetch(`/api/Admin/attributes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch attributes");
  return await res.json();
}

// services/Products.js (or wherever you keep it)


export async function updateAttributes(id, data) {
  const res = await fetch(`${API_URL}/subCatProductAttr/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update product: ${errorText}`);
  }

  return await res.json();
}

