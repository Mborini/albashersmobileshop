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
  // Step 1: Get signature from server
  const signatureData = new FormData();
  signatureData.append("folder", "categories");
  if (oldImageUrl) {
    signatureData.append("oldImageUrl", oldImageUrl);
  }

  const signatureRes = await fetch("/api/Admin/uploadImage", {
    method: "POST",
    body: signatureData,
  });

  if (!signatureRes.ok) {
    throw new Error("Failed to get Cloudinary signature");
  }

  const { timestamp, signature, apiKey, cloudName, folder } = await signatureRes.json();

  // Step 2: Upload file directly to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!cloudinaryRes.ok) {
    const errText = await cloudinaryRes.text();
    throw new Error("Cloudinary upload failed: " + errText);
  }

  const result = await cloudinaryRes.json();
  return result.secure_url; // This is the final image URL
}
