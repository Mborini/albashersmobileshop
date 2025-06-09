import { Category } from "@/types/category";

const API_URL = "/api/Admin/categories";

export async function fetchCategories() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return await res.json();
}

export async function addCategory(category :Category) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Failed to add category");
  return await res.json();
}

export async function updateCategory(id, category) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return await res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete category");
  return true;
}
export async function uploadImage(file: File, oldImageUrl?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  if (oldImageUrl) {
    formData.append("oldImageUrl", oldImageUrl);
    formData.append("folder", "categories");
  }

  const res = await fetch("/api/Admin/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.url;
}