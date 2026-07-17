"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageOff, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { isCloudinaryConfigured, uploadImageToCloudinary } from "@/lib/cloudinary";

export function ImageUpload({
  value,
  onChange,
  label = "Add photo",
  className,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);
    try {
      const url = await uploadImageToCloudinary(file, setProgress);
      onChange(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  if (value) {
    return (
      <div className={cn("relative w-full max-w-40 rounded-xl overflow-hidden border border-border", className)}>
        <Image src={value} alt="Uploaded photo" width={160} height={160} className="w-full h-40 object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-1.5 right-1.5 flex items-center justify-center h-6 w-6 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          aria-label="Remove photo"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  if (!isCloudinaryConfigured()) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1.5 w-full max-w-40 h-40 rounded-xl border-2 border-dashed border-border text-muted-foreground/60",
          className,
        )}
        title="Photo upload isn't configured — set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
      >
        <ImageOff className="h-5 w-5" />
        <span className="text-xs font-semibold text-center px-2">Photo upload not configured</span>
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
          <span className="text-xs font-semibold">{label}</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </button>
  );
}
