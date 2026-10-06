import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About ZA Courier — Australian logistics technology.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <h1 className="text-4xl font-semibold">About ZA Courier</h1>
      <p className="mt-4 text-muted leading-relaxed">
        Every parcel has a destination. Every movement has a story. ZA Courier
        makes both visible with modern quoting, tracking and business tooling
        built for Australia.
      </p>
      <Link href="/contact" className="mt-8 inline-flex text-sm font-semibold text-accent">
        Contact us →
      </Link>
    </div>
  );
}
