import React from "react";
import { getAdminProducts } from "@/actions/admin";
import { FirmwarePushClient } from "./FirmwarePushClient";

export const metadata = { title: "Push Firmware Update — Admin" };

export default async function PushFirmwarePage() {
  const products = await getAdminProducts();
  const serializedProducts = products.map((p) => ({
    id: p.id,
    title: p.title,
    version: p.version,
    firmwareBuildVersion: p.firmwareBuildVersion,
    firmwareBinPath: p.firmwareBinPath,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1A3C2F] tracking-tight mb-2">Push Firmware Update</h1>
        <p className="text-[#1A3C2F]/60 font-medium">
          Deploy new firmware builds, update build version tags, and append version notes for product license holders.
        </p>
      </div>

      <FirmwarePushClient products={serializedProducts} />
    </div>
  );
}
