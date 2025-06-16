
const API_URL = "/api/Admin/adsImages";

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
export async function uploadImage(file: File, oldImageUrl?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  if (oldImageUrl) {
    formData.append("oldImageUrl", oldImageUrl);
  }
  formData.append("folder", "Ads");

  const sigRes = await fetch("/api/Admin/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!sigRes.ok) throw new Error("Failed to get Cloudinary signature");

  const { timestamp, signature, apiKey, cloudName, folder } = await sigRes.json();

  const cloudForm = new FormData();
  cloudForm.append("file", file);
  cloudForm.append("api_key", apiKey);
  cloudForm.append("timestamp", timestamp);
  cloudForm.append("signature", signature);
  cloudForm.append("folder", folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: cloudForm,
  });

  if (!uploadRes.ok) throw new Error("Upload to Cloudinary failed");
  const data = await uploadRes.json();

  return data.secure_url;
}

