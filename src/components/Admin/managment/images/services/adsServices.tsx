
const API_URL = "/api/Admin/adsImages";

export async function fetchProducts() {
  const res = await fetch("/api/products/adds");
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
  
}
export async function fetchAdsImages() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch ads images");
  return await res.json();
}

export async function updateAdsImages(id, AdsImages) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(AdsImages),
  });
  if (!res.ok) throw new Error("Failed to update ads images");
  return await res.json();
}
export async function activatePromo(id, is_active) {
  const res = await fetch(`${API_URL}/promoActivation/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active }),
  });
  if (!res.ok) throw new Error("Failed to update ads images");
  return await res.json();
}
export async function uploadImage(file: File, oldImageUrl?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "Ads"); // فولدر S3 المطلوب

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


