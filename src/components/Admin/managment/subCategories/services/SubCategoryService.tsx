import { subCategory } from "@/types/subCategory";

const API_URL = "/api/Admin/subCategories";

export async function fetchSubCategories() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch SubCategories");
  return await res.json();
}

export async function addSubCategory(subCategory:subCategory) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subCategory),
  });
  if (!res.ok) throw new Error("Failed to add SubCategory");
  return await res.json();
}

export async function updateSubCategory(id: number, subCategory: subCategory) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subCategory),
  });
  if (!res.ok) throw new Error("Failed to update subCategory");
  return await res.json();
}

export async function deleteSubCategory(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete subCategory");
  }

  return true;
}


export async function uploadImage(file: File, oldImageUrl?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  if (oldImageUrl) {
    formData.append("oldImageUrl", oldImageUrl);
    formData.append("folder", "subCategories");
  }

  const res = await fetch("/api/Admin/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.url;
}