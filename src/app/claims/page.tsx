import type { Metadata } from "next";
import { ClaimsFlow } from "@/components/shipping/claims-flow";

export const metadata: Metadata = {
  title: "Claims",
  description: "Lodge and track ZA Courier shipment claims.",
};

export default function ClaimsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <ClaimsFlow />
    </div>
  );
}
