import type { Metadata } from "next";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin",
  description: "ZA Courier admin operations dashboard demo.",
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <AdminDashboard />
    </div>
  );
}
