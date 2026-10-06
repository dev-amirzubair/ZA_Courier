"use client";

import Link from "next/link";
import { Reveal, SectionShell } from "@/components/ui/section";

export function FinalCtaSection() {
  return (
    <SectionShell className="pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-white md:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 20%, rgba(25,195,177,0.35), transparent 35%), radial-gradient(circle at 10% 80%, rgba(245,185,66,0.18), transparent 30%)",
            }}
          />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-2">
              Ready when you are
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Your next parcel already has a route.
            </h2>
            <p className="mt-4 text-base text-white/70">
              Calculate a quote, compare services, and move with unambiguous
              tracking from the first scan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary hover:bg-accent-2"
              >
                Get a Quote
              </Link>
              <Link
                href="/track"
                className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
              >
                Track a Parcel
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
