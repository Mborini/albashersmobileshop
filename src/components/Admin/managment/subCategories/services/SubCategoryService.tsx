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
  // Step 1: Request signature from your server
  const signatureData = new FormData();
  signatureData.append("folder", "subCategories");
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

  // Step 2: Upload the file directly to Cloudinary
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
