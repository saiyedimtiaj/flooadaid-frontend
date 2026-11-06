"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { localizeUploadError, uploadImage, type UploadFolder } from "@/lib/upload";
import { useT } from "@/lib/i18n/use-t";

export function ImageUpload({
  value,
  onChange,
  label = "Add photo",
  className,
  folder = "general",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
  folder?: UploadFolder;
}) {
  const { tr, lang } = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file, { folder, onProgress: setProgress });
      onChange(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed. Please try again.";
      toast.error(localizeUploadError(message, lang));
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (value) {
    return (
      <div className={cn("relative w-full max-w-40 rounded-xl overflow-hidden border border-border", className)}>
        <Image src={value} alt={tr("Uploaded photo", "আপলোড করা ছবি")} width={160} height={160} className="w-full h-40 object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-1.5 right-1.5 flex items-center justify-center h-6 w-6 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          aria-label={tr("Remove photo", "ছবি সরান")}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={isUploading}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 w-full max-w-40 h-40 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-60",
        className,
      )}
    >
      {isUploading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-xs font-semibold">{progress}%</span>
        </>
      ) : (
        <>
          <ImagePlus className="h-5 w-5" />
          <span className="text-xs font-semibold">{label === "Add photo" ? tr("Add photo", "ছবি যোগ করুন") : label}</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </button>
  );
}
