"use client";

import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import { Loader2 } from "lucide-react";
import * as THREE from "three";

interface CadViewerProps {
  file: File | null;
}

export function CadViewer({ file }: CadViewerProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setGeometry(null);
      return;
    }

    const loadZip = async () => {
      setLoading(true);
      setError("");
      try {
        const zip = new JSZip();
        const zipData = await zip.loadAsync(file);

        // Find the first .stl file in the zip
        let stlFileObj = null;
        for (const [filename, fileObj] of Object.entries(zipData.files)) {
          if (!fileObj.dir && filename.toLowerCase().endsWith(".stl")) {
            stlFileObj = fileObj;
            break;
          }
        }

        if (!stlFileObj) {
          setError("No .STL file found inside the ZIP.");
          setLoading(false);
          return;
        }

        const arrayBuffer = await stlFileObj.async("arraybuffer");
        const loader = new STLLoader();
        const geo = loader.parse(arrayBuffer);
        
        // Center and scale geometry for easier viewing
        geo.computeBoundingSphere();
        geo.computeVertexNormals();

        setGeometry(geo);
      } catch (err: any) {
        console.error("Error extracting CAD zip:", err);
        setError(err.message || "Failed to extract ZIP file.");
      } finally {
        setLoading(false);
      }
    };

    loadZip();
  }, [file]);

  if (!file) return null;

  return (
    <div className="w-full h-[400px] bg-[#FAF8F5] rounded-xl border border-[#1A3C2F]/10 overflow-hidden relative mt-4">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4A35A] mb-2" />
          <p className="text-sm font-bold text-[#1A3C2F]">Extracting CAD Model...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-10">
          <p className="text-sm font-bold text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && geometry && (
        <>
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="bg-[#1A3C2F] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              Live 3D Preview
            </span>
          </div>
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            <span className="bg-black/50 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full">
              Scroll to zoom • Drag to rotate
            </span>
          </div>
          <Canvas shadows camera={{ position: [0, 0, 150], fov: 45 }}>
            <color attach="background" args={["#FAF8F5"]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[100, 100, 100]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-100, -100, -100]} intensity={0.5} />
            <Stage environment="city" intensity={0.5}>
              <mesh geometry={geometry} castShadow receiveShadow>
                <meshStandardMaterial color="#C4A35A" roughness={0.4} metalness={0.6} />
              </mesh>
            </Stage>
            <OrbitControls makeDefault autoRotate autoRotateSpeed={2} />
          </Canvas>
        </>
      )}
    </div>
  );
}
