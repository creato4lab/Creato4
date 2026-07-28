"use client";

import React, { useState, useRef, useEffect } from "react";
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
  value?: string; // Comma-separated existing image keys/URLs (for edit mode)
  onChange?: (value: string) => void;
}

export function MultiImageUpload({ name, label, value = "", onChange }: MultiImageUploadProps) {
  const [items, setItems] = useState<ImageFileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // Pre-populate with existing images when `value` is provided (edit mode)
  useEffect(() => {
    if (initializedRef.current || !value) return;
    initializedRef.current = true;
    const existingKeys = value.split(",").map((s) => s.trim()).filter(Boolean);
    const prePopulated: ImageFileItem[] = existingKeys.map((key, i) => ({
      id: `existing_${i}_${key.slice(-8)}`,
      file: new File([], key.split("/").pop() ?? key),
      name: key.split("/").pop() ?? key,
      previewUrl: key.startsWith("http") ? key : `/api/admin/image-proxy?key=${encodeURIComponent(key)}`,
      key,
      status: "success" as const,
      progress: 100,
    }));
    setItems(prePopulated);
  }, [value]);

  const uploadSingleFile = async (item: ImageFileItem) => {
    try {
      const keyResult = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload-file", true);
        xhr.setRequestHeader("x-filename", encodeURIComponent(item.file.name));
        xhr.setRequestHeader("x-prefix", "images");
        if (item.file.type) {
          xhr.setRequestHeader("Content-Type", item.file.type);
        }

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
            try {
              const resData = JSON.parse(xhr.responseText);
              if (resData.key) {
                resolve(resData.key);
              } else {
                reject(new Error(resData.error || "Upload failed"));
              }
            } catch {
              reject(new Error("Invalid server response"));
            }
          } else {
            try {
              const errData = JSON.parse(xhr.responseText);
              reject(new Error(errData.error || `Server upload status ${xhr.status}`));
            } catch {
              reject(new Error(`Server upload status ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network connection error during upload."));
        xhr.send(item.file);
      });

      // Mark success
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "success", key: keyResult, progress: 100 } : i
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

  const handleRemove = async (id: string) => {
    const itemToRemove = items.find((i) => i.id === id);
    if (itemToRemove?.key) {
      try {
        await fetch("/api/admin/delete-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: itemToRemove.key }),
        });
      } catch (err) {
        console.error("Failed to delete image from R2:", err);
      }
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Comma-separated list of successfully uploaded image keys/urls
  const successfulKeys = items
    .filter((i) => i.status === "success" && i.key)
    .map((i) => i.key)
    .join(",");

  // Notify parent of changes
  useEffect(() => {
    onChange?.(successfulKeys);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successfulKeys]);

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
