import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Send",
  description: "Send parcels with ZA Courier — quote, book and track.",
};

export default function SendPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <h1 className="text-4xl font-semibold">Send with ZA Courier</h1>
      <p className="mt-3 text-muted">
        Start with a quote, choose a service, then complete booking in one flow.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/quote"
          className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary"
        >
          Get a Quote
        </Link>
        <Link
          href="/booking"
          className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Start booking
        </Link>
      </div>
    </div>
  );
}
