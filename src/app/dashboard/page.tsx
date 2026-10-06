import type { Metadata } from "next";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description: "ZA Courier customer shipping dashboard preview.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <CustomerDashboard />
    </div>
  );
}
