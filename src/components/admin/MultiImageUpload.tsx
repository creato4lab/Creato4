"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  key: string;
  status: "uploading" | "success" | "error";
  progress: number;
  errorMsg?: string;
}

interface MultiImageUploadProps {
  name: string; // Form field name (e.g. "images")
  label: string;
}

export function MultiImageUpload({ name, label }: MultiImageUploadProps) {
  const [items, setItems] = useState<ImageFileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadSingleFile = async (item: ImageFileItem) => {
    try {
      // 1. Get presigned URL
      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: item.file.name,
          contentType: item.file.type || "image/jpeg",
          prefix: "images",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to get upload URL");
      }

      const { uploadUrl, key } = data;

      // 2. Upload to R2 with progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", item.file.type || "image/jpeg");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            setItems((prev) =>
              prev.map((i) => (i.id === item.id ? { ...i, progress: pct } : i))
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(item.file);
      });

      // 3. Mark success
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "success", key, progress: 100 } : i
        )
      );
    } catch (err: any) {
      console.error("Image upload error:", err);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: "error", errorMsg: err.message || "Failed" }
            : i
        )
      );
    }
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: ImageFileItem[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const item: ImageFileItem = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        file,
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        key: "",
        status: "uploading",
        progress: 0,
      };

      newItems.push(item);
    });

    setItems((prev) => [...prev, ...newItems]);

    // Start upload for each file
    newItems.forEach((item) => {
      uploadSingleFile(item);
    });
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Comma-separated list of successfully uploaded image keys/urls
  const successfulKeys = items
    .filter((i) => i.status === "success" && i.key)
    .map((i) => i.key)
    .join(",");

  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold text-[#1A3C2F] uppercase tracking-wide">
        {label}
      </label>

      {/* Hidden input storing comma-separated keys for form submission */}
      <input type="hidden" name={name} value={successfulKeys} />

      {/* Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#1A3C2F]/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-[#C4A35A]/50 transition-colors bg-[#FAF8F5]"
      >
        <UploadCloud className="w-8 h-8 text-[#1A3C2F]/40 mb-2" />
        <p className="text-sm font-bold text-[#1A3C2F]">Click to upload product images</p>
        <p className="text-xs text-[#1A3C2F]/50 mt-1">Select multiple images (PNG, JPG, WEBP, GIF)</p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFilesSelected(e.target.files)}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* Uploaded Thumbnails Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group bg-white border border-[#1A3C2F]/10 rounded-2xl overflow-hidden shadow-sm aspect-square flex flex-col"
            >
              {/* Preview Image */}
              <img
                src={item.previewUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />

              {/* Status Badge Overlay */}
              {item.status === "uploading" && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-white text-center">
                  <Loader2 className="w-6 h-6 animate-spin mb-1 text-[#C4A35A]" />
                  <span className="text-[0.65rem] font-bold">{item.progress}%</span>
                </div>
              )}

              {item.status === "success" && (
                <div className="absolute top-2 left-2 bg-emerald-500 text-white rounded-full p-1 shadow">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}

              {item.status === "error" && (
                <div className="absolute inset-0 bg-red-900/80 p-2 flex flex-col items-center justify-center text-white text-center">
                  <AlertCircle className="w-5 h-5 text-red-300 mb-1" />
                  <span className="text-[0.6rem] leading-tight">Failed</span>
                </div>
              )}

              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors shadow"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
