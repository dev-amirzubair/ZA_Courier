import type { Metadata } from "next";
import { DriverDashboard } from "@/components/dashboard/driver-dashboard";

export const metadata: Metadata = {
  title: "Driver",
  description: "ZA Courier driver app preview — jobs, navigation and POD.",
};

export default function DriverPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <DriverDashboard />
    </div>
  );
}
