
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
    formData.append("folder", "Ads");
  }

  const res = await fetch("/api/Admin/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.url;
}