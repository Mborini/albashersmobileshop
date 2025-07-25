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

export async function updateBrand(id: number,brand: Brand & { oldImageUrl?: string }) {
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
export async function uploadImage(file: File, oldImageUrl?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "brands"); // فولدر S3 المطلوب

  if (oldImageUrl) {
    formData.append("oldImageUrl", oldImageUrl); // للحذف لو في صورة قديمة
  }

  const res = await fetch("/api/Admin/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("S3 Upload Failed: " + error);
  }

  const result = await res.json();

  if (!result.s3Url) {
    throw new Error("Upload response missing s3Url");
  }

  return result.s3Url;
}

