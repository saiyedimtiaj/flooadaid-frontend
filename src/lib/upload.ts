const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const MAX_FILE_SIZE_MB = 8;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export type UploadFolder = "sos" | "missing-persons" | "relief" | "shelters" | "general";

export function uploadImage(
  file: File,
  options: { folder?: UploadFolder; onProgress?: (percent: number) => void } = {},
): Promise<string> {
  if (file.type && !ACCEPTED_TYPES.includes(file.type)) {
    return Promise.reject(new Error("Please upload a JPG, PNG, WEBP or HEIC image."));
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return Promise.reject(new Error(`Image must be smaller than ${MAX_FILE_SIZE_MB} MB.`));
  }

  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/uploads/image?folder=${options.folder ?? "general"}`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let body: { url?: string; message?: string | string[] } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        body = {};
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.url) {
        resolve(body.url);
        return;
      }
      if (xhr.status === 413) {
        reject(new Error(`Image must be smaller than ${MAX_FILE_SIZE_MB} MB.`));
        return;
      }
      if (xhr.status === 429) {
        reject(new Error("Too many uploads — please wait a minute and try again."));
        return;
      }
      const message = Array.isArray(body.message) ? body.message[0] : body.message;
      reject(new Error(message || "Upload failed. Please try again."));
    };

    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    xhr.send(formData);
  });
}
