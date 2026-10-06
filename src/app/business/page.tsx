import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business",
  description: "ZA Courier business shipping, API and reporting.",
};

export default function BusinessPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Business
      </p>
      <h1 className="mt-2 max-w-3xl text-4xl font-semibold">
        Built for businesses that ship more.
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Bulk shipping, dashboards, team access and API hooks — without franchising
        complexity.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/quote"
          className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary"
        >
          Get a business quote
        </Link>
        <Link
          href="/dashboard"
          className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          View dashboard preview
        </Link>
      </div>
    </div>
  );
}
