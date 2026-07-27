import React from "react";
import { getAdminActivationsList } from "@/actions/admin";
import { AdminActivationsClient } from "./AdminActivationsClient";

export const metadata = { title: "Device Activations — Admin" };

export default async function AdminActivationsPage() {
  const activations = await getAdminActivationsList();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1A3C2F] tracking-tight mb-2">Device Activations</h1>
        <p className="text-[#1A3C2F]/60 font-medium">
          Inspector panel of all hardware microcontrollers (ESP32 / Arduino) registered under user licenses.
        </p>
      </div>

      <AdminActivationsClient activations={activations} />
    </div>
  );
}
