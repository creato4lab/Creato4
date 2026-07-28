"use client";

import React from "react";
import { InteractiveHardwareStudio } from "@/components/InteractiveHardwareStudio";

interface Product3DStudioProps {
  title: string;
  gerberPath?: string | null;
  cadPath?: string | null;
  pcbImage?: string | null;
  assemblyZipPath?: string | null;
}

export function Product3DStudio({
  title,
  gerberPath,
  cadPath,
  pcbImage,
  assemblyZipPath,
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
    />
  );
}

