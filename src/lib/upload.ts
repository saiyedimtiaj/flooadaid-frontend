const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/+$/, "");

const MAX_FILE_SIZE_MB = 8;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export type UploadFolder = "sos" | "missing-persons" | "relief" | "shelters" | "general";

const UPLOAD_ERRORS_BN: Record<string, string> = {
  "The selected image is empty.": "নির্বাচিত ছবিটি খালি।",
  "Please upload a JPG, PNG, WEBP or HEIC image.": "JPG, PNG, WEBP বা HEIC ছবি আপলোড করুন।",
  "Image must be smaller than 8 MB.": "ছবির আকার ৮ MB-এর কম হতে হবে।",
  "Too many uploads — please wait a minute and try again.": "খুব বেশি আপলোড হয়েছে—এক মিনিট অপেক্ষা করে আবার চেষ্টা করুন।",
  "Upload failed. Please try again.": "আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
  "Upload failed. Check your connection and try again.": "আপলোড ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
  "Upload timed out. Please try again.": "আপলোডের সময়সীমা শেষ হয়েছে। আবার চেষ্টা করুন।",
  "Upload was cancelled.": "আপলোড বাতিল হয়েছে।",
  "Image upload is not configured on the server yet.": "সার্ভারে ছবি আপলোড এখনো কনফিগার করা হয়নি।",
  "Image upload service authentication failed. Please contact support.": "ছবি আপলোড সেবার পরিচয় যাচাই ব্যর্থ হয়েছে। সহায়তা দলের সঙ্গে যোগাযোগ করুন।",
  "Image upload service could not be reached. Please try again shortly.": "ছবি আপলোড সেবায় পৌঁছানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
  "Could not upload the image right now. Please try again.": "এই মুহূর্তে ছবিটি আপলোড করা যায়নি। আবার চেষ্টা করুন।",
};

export function localizeUploadError(message: string, lang: "en" | "bn"): string {
  return lang === "bn" ? (UPLOAD_ERRORS_BN[message] ?? "ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।") : message;
}

export function uploadImage(
  file: File,
  options: { folder?: UploadFolder; onProgress?: (percent: number) => void } = {},
): Promise<string> {
  if (!file.size) {
    return Promise.reject(new Error("The selected image is empty."));
  }
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
    xhr.open(
      "POST",
      `${API_URL}/uploads/image?folder=${encodeURIComponent(options.folder ?? "general")}`,
    );
    xhr.withCredentials = true;
    xhr.timeout = 45_000;

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
    xhr.ontimeout = () => reject(new Error("Upload timed out. Please try again."));
    xhr.onabort = () => reject(new Error("Upload was cancelled."));
    xhr.send(formData);
  });
}
