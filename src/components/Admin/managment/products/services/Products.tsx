import { Product } from "@/types/product";

const API_URL = "/api/Admin/products";

export async function fetchProducts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch products");

  const flatData = await res.json();

  const grouped = new Map();

  for (const item of flatData) {
    const id = item.product_id;

    if (!grouped.has(id)) {
      grouped.set(id, {
        id: item.product_id,
        product_name: item.product_name,
        description: item.description,
        brand_name: item.brand_name,
        subcategory_name: item.subcategory_name,
        category_name: item.category_name,
        price: item.price,
        discountedPrice: item.discountedPrice,
        image: item.image,
        attributes: [],
      });
    }

    if (item.attribute_name && item.attribute_value) {
      grouped.get(id).attributes.push({
        name: item.attribute_name,
        value: item.attribute_value,
      });
    }
  }

  return Array.from(grouped.values());
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
  const response = await fetch(`/api/Admin/products/${id}`, {
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