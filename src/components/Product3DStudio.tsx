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
  const resolvedGerberPath = gerberPath || (cadPath?.toLowerCase().endsWith(".zip") ? cadPath : null);
  const resolvedAssemblyPath = assemblyZipPath || (cadPath?.toLowerCase().endsWith(".zip") ? cadPath : undefined);
  const resolvedCadPath = cadPath || gerberPath;

  return (
    <InteractiveHardwareStudio
      title={title}
      gerberPath={resolvedGerberPath}
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

