import type { Metadata } from "next";
import { TrackingFlow } from "@/components/tracking/tracking-flow";

export const metadata: Metadata = {
  title: "Track a Parcel",
  description: "Track ZA Courier shipments with an animated journey timeline.",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <TrackingFlow initialQuery={params.q ?? ""} />
    </div>
  );
}
