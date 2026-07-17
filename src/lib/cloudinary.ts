export class CloudinaryConfigError extends Error {}

const MAX_FILE_SIZE_MB = 8;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  );
}

/**
 * Uploads a single image directly from the browser to Cloudinary using an
 * unsigned upload preset — the backend never sees the file, only the
 * resulting secure_url that gets saved on the SOS/relief/shelter record.
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new CloudinaryConfigError(
      "Image upload isn't configured yet. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and " +
        "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local (see .env.example).",
    );
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, WEBP, or HEIC image.");
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) {
          resolve(body.secure_url as string);
        } else {
          reject(new Error(body.error?.message || "Upload failed. Please try again."));
        }
      } catch {
        reject(new Error("Upload failed. Please try again."));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    xhr.send(formData);
  });
}
