import type { Metadata } from "next";
import { QuoteFlow } from "@/components/shipping/quote-flow";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Calculate ZA Courier delivery prices from package dimensions, chargeable weight and route-based rate rules.",
};

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-24 md:px-6 md:pb-14 md:pt-28">
      <QuoteFlow />
    </div>
  );
}
