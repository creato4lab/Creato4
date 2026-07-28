"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { getProductById, updateProduct } from "@/actions/admin";
import { FileUpload } from "@/components/admin/FileUpload";
import { CadViewer } from "@/components/admin/CadViewer";
import { GerberViewer } from "@/components/admin/GerberViewer";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";

type Product = Awaited<ReturnType<typeof getProductById>>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [product, setProduct] = useState<Product>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cadFile, setCadFile] = useState<File | null>(null);
  const [gerberFile, setGerberFile] = useState<File | null>(null);

  // File path state (managed by FileUpload components)
  const [sourceCodePath, setSourceCodePath] = useState("");
  const [cadFilePath, setCadFilePath] = useState("");
  const [pdfDocPath, setPdfDocPath] = useState("");
  const [pcbGerberPath, setPcbGerberPath] = useState("");
  const [firmwareBinPath, setFirmwareBinPath] = useState("");
  const [firmwareUf2Path, setFirmwareUf2Path] = useState("");
  const [imagesValue, setImagesValue] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const p = await getProductById(id);
        if (!p) {
          setError("Product not found.");
          setFetching(false);
          return;
        }
        setProduct(p);
        setSourceCodePath(p.sourceCodePath ?? "");
        setCadFilePath(p.cadFilePath ?? "");
        setPdfDocPath(p.pdfDocPath ?? "");
        setPcbGerberPath(p.pcbGerberPath ?? "");
        setFirmwareBinPath(p.firmwareBinPath ?? "");
        setFirmwareUf2Path(p.firmwareUf2Path ?? "");
        setImagesValue(p.images?.join(",") ?? "");
      } catch {
        setError("Failed to load product.");
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries()) as Record<string, string>;

      // Override file paths with state (managed by FileUpload)
      data.sourceCodePath = sourceCodePath;
      data.cadFilePath = cadFilePath;
      data.pdfDocPath = pdfDocPath;
      data.pcbGerberPath = pcbGerberPath;
      data.firmwareBinPath = firmwareBinPath;
      data.firmwareUf2Path = firmwareUf2Path;
      data.images = imagesValue;

      const result = await updateProduct(id, data as Parameters<typeof updateProduct>[1]);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/admin/products"), 1200);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#C4A35A]" />
        <span className="text-[#1A3C2F]/60 font-medium">Loading product…</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-bold">{error ?? "Product not found."}</p>
        <Link href="/admin/products" className="mt-4 inline-block text-sm text-[#1A3C2F] underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 bg-white rounded-xl shadow-sm border border-[#1A3C2F]/10 hover:bg-[#FAF8F5] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A3C2F]" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1A3C2F] tracking-tight">Edit Product</h1>
          <p className="text-[#1A3C2F]/60 text-sm font-medium font-mono">{product.slug}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#1A3C2F]/10 overflow-hidden w-full max-w-[1500px]">
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border border-green-100">
              ✓ Product updated! Redirecting…
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1A3C2F]/40 border-b border-[#1A3C2F]/5 pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Product Title *</label>
                <input
                  required type="text" name="title"
                  defaultValue={product.title}
                  className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Base Price (INR) *</label>
                <input
                  required type="number" min="0" name="price"
                  defaultValue={product.price}
                  className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Short Description *</label>
              <input
                required type="text" name="shortDescription"
                defaultValue={product.shortDescription}
                className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Full Description *</label>
              <textarea
                required name="description" rows={5}
                defaultValue={product.description}
                className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]"
              />
            </div>
          </div>

          {/* Categorization */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1A3C2F]/40 border-b border-[#1A3C2F]/5 pb-2">Categorization</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Category *</label>
                <select name="category" defaultValue={product.category} className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]">
                  <option value="ARDUINO">Arduino</option>
                  <option value="ESP32">ESP32</option>
                  <option value="STM32">STM32</option>
                  <option value="RASPBERRY_PI">Raspberry Pi</option>
                  <option value="PCB_DESIGN">PCB Design</option>
                  <option value="CAD_MODEL">CAD Model</option>
                  <option value="EMBEDDED_CODE">Embedded Code</option>
                  <option value="COURSE">Course</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Difficulty *</label>
                <select name="difficulty" defaultValue={product.difficulty} className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]">
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1A3C2F]/40 border-b border-[#1A3C2F]/5 pb-2">Technical Details</h2>
            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Hardware Used (Comma separated)</label>
              <input type="text" name="hardwareUsed" defaultValue={product.hardwareUsed?.join(", ") ?? ""} className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Software Used (Comma separated)</label>
              <input type="text" name="softwareUsed" defaultValue={product.softwareUsed?.join(", ") ?? ""} className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">What's Included? (Comma separated)</label>
              <input type="text" name="whatsIncluded" defaultValue={product.whatsIncluded?.join(", ") ?? ""} className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]" />
            </div>

            <MultiImageUpload
              name="images"
              label="Product Gallery Images (Unlimited Direct Uploads)"
              value={product.images?.join(",") ?? ""}
              onChange={(val) => setImagesValue(val)}
            />

            <div>
              <FileUpload
                name="videoUrl"
                label="Product Demo Video (.MP4 / .WEBM Video File or YouTube Link)"
                prefix="videos"
                accept=".mp4,.webm,.mov"
                value={product.videoUrl ?? ""}
                onChange={(val) => {/* videoUrl handled via form name */}}
              />
            </div>
          </div>

          {/* Digital Deliverables */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1A3C2F]/40 border-b border-[#1A3C2F]/5 pb-2">Digital Deliverables & File Uploads</h2>
            <p className="text-xs text-[#1A3C2F]/50">Replace any file below by uploading a new one. Leave unchanged to keep the existing file.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FileUpload
                name="sourceCodePath"
                label="Arduino .INO / Source Code (.ZIP / .INO)"
                prefix="source-code"
                accept=".zip,.ino,.c,.cpp,.rar,.tar.gz"
                value={product.sourceCodePath ?? ""}
                onChange={(val) => setSourceCodePath(val)}
              />

              <div className="flex flex-col gap-2">
                <FileUpload
                  name="pcbGerberPath"
                  label="PCB Gerber Manufacturing (.ZIP / .GRB)"
                  prefix="gerber"
                  accept=".zip,.grb,.gbr"
                  value={product.pcbGerberPath ?? ""}
                  onChange={(val) => setPcbGerberPath(val)}
                  onFileSelected={(file) => setGerberFile(file)}
                />
                <GerberViewer file={gerberFile} />
              </div>

              <div className="flex flex-col gap-2">
                <FileUpload
                  name="cadFilePath"
                  label="3D CAD Model (.ZIP / .STEP / .STL)"
                  prefix="cad-files"
                  accept=".zip,.step,.stl,.f3d"
                  value={product.cadFilePath ?? ""}
                  onChange={(val) => setCadFilePath(val)}
                  onFileSelected={(file) => setCadFile(file)}
                />
                <CadViewer file={cadFile} />
              </div>

              <FileUpload
                name="pdfDocPath"
                label="Documentation (.PDF / .DOCX)"
                prefix="docs"
                accept=".pdf,.docx,.doc"
                value={product.pdfDocPath ?? ""}
                onChange={(val) => setPdfDocPath(val)}
              />

              <FileUpload
                name="firmwareBinPath"
                label="Pre-Compiled Firmware Binary (.BIN / .HEX)"
                prefix="firmware"
                accept=".bin,.hex"
                value={product.firmwareBinPath ?? ""}
                onChange={(val) => setFirmwareBinPath(val)}
              />

              <FileUpload
                name="firmwareUf2Path"
                label="UF2 Firmware Image (.UF2)"
                prefix="firmware"
                accept=".uf2"
                value={product.firmwareUf2Path ?? ""}
                onChange={(val) => setFirmwareUf2Path(val)}
              />

              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-[#1A3C2F] mb-2 uppercase tracking-wide">Firmware Build Version</label>
                <input
                  type="text" name="firmwareBuildVersion"
                  defaultValue={product.firmwareBuildVersion ?? "v1.0.0"}
                  className="w-full bg-[#FAF8F5] border border-[#1A3C2F]/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1A3C2F]/5 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#1A3C2F] text-[#FAF8F5] px-8 py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Saving Changes…" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
