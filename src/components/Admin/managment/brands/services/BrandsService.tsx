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
}export async function uploadImage(file: File, oldImageUrl?: string): Promise<string> {
  // Step 1: طلب التوقيع من السيرفر
  const signatureData = new FormData();
  signatureData.append("folder", "brands");
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

  // Step 2: رفع الصورة مباشرة إلى Cloudinary
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
  return result.secure_url; // رابط الصورة النهائي
}
