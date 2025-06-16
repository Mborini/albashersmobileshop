
const API_URL = "/api/Admin/attributes";

export async function fetchAttrs() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch attributes");
  return await res.json();
}

