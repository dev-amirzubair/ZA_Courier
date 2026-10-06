import type { Metadata } from "next";
import { BookingFlow, type BookingSeed } from "@/components/booking/booking-flow";

export const metadata: Metadata = {
  title: "Book a Shipment",
  description:
    "Multi-step ZA Courier booking with package builder, service selection and confirmation.",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const seed: BookingSeed = {
    originSuburb: params.fromSuburb,
    originState: params.fromState,
    originPostcode: params.fromPostcode,
    destinationSuburb: params.toSuburb,
    destinationState: params.toState,
    destinationPostcode: params.toPostcode,
    serviceCode: params.serviceCode,
    serviceName: params.serviceName,
    serviceLevel: params.serviceLevel,
    priceAud: params.price ? Number(params.price) : undefined,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <BookingFlow seed={seed} />
    </div>
  );
}
