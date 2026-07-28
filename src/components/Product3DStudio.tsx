"use client";

import React from "react";
import { InteractiveHardwareStudio } from "@/components/InteractiveHardwareStudio";

interface Product3DStudioProps {
  title: string;
  gerberPath?: string | null;
  cadPath?: string | null;
  pcbImage?: string | null;
  assemblyZipPath?: string | null;
  hasPcbAccess?: boolean;
  hasCadAccess?: boolean;
  hasFullAccess?: boolean;
  basePrice?: number;
}

export function Product3DStudio({
  title,
  gerberPath,
  cadPath,
  pcbImage,
  assemblyZipPath,
  hasPcbAccess,
  hasCadAccess,
  hasFullAccess,
  basePrice,
}: Product3DStudioProps) {
  // If assemblyZipPath is not explicitly passed, fallback to cadPath if it's a zip file or use cadPath for 3D PCB
  const resolvedAssemblyPath = assemblyZipPath || (cadPath?.toLowerCase().endsWith(".zip") ? cadPath : undefined);
  const resolvedCadPath = cadPath || gerberPath;

  return (
    <InteractiveHardwareStudio
      title={title}
      gerberPath={gerberPath}
      cadPath={resolvedCadPath}
      pcbImage={pcbImage}
      assemblyZipPath={resolvedAssemblyPath}
      hasPcbAccess={hasPcbAccess}
      hasCadAccess={hasCadAccess}
      hasFullAccess={hasFullAccess}
      basePrice={basePrice}
    />
  );
}

