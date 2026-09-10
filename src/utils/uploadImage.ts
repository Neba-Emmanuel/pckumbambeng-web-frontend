export async function uploadImage(
  file: File,
  type: "blog" | "training",
): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
    throw new Error("Choose a JPEG, PNG, WebP, or GIF image");
  }
  if (file.size > 4 * 1024 * 1024) throw new Error("Image must be 4 MB or smaller");
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Please sign in as an admin before uploading an image.");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await fetch(`${(import.meta.env.VITE_API_URL || "https://mtmkay-backend.vercel.app/api").replace(/\/$/, "")}/upload`, {
    method: "POST",
    signal: AbortSignal.timeout(30_000),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (res.status === 401) {
    throw new Error("Your session is no longer valid. Sign out, sign in again, and retry the upload.");
  }
  if (res.status === 403) {
    throw new Error("An admin account is required to upload images.");
  }

  const data = await res.json().catch(() => { throw new Error("Upload service is unavailable"); });

  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }

  if (!data.url || typeof data.url !== "string" || !data.url.startsWith("https://")) throw new Error("Upload service returned an invalid image URL");
  return data.url;
}
