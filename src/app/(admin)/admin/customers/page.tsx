import React from "react";
import { getAdminCustomersList } from "@/actions/admin";
import { AdminCustomersClient } from "./AdminCustomersClient";

export const metadata = { title: "Customer Management — Admin" };

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomersList();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1A3C2F] tracking-tight mb-2">Customer Management</h1>
        <p className="text-[#1A3C2F]/60 font-medium">
          View all registered users, purchase history, active licenses, and manage admin privileges.
        </p>
      </div>

      <AdminCustomersClient customers={customers} />
    </div>
  );
}
