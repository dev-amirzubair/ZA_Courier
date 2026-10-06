import type { Metadata } from "next";
import { RedeliveryFlow } from "@/components/shipping/redelivery-flow";

export const metadata: Metadata = {
  title: "Redelivery",
  description: "Arrange a ZA Courier redelivery for a missed attempt.",
};

export default function RedeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <RedeliveryFlow />
    </div>
  );
}
