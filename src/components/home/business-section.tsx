"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { businessFeatures } from "@/data/home";
import {
  Reveal,
  SectionHeading,
  SectionShell,
} from "@/components/ui/section";

const DashboardPreview = dynamic(
  () =>
    import("@/components/home/dashboard-preview").then(
      (mod) => mod.DashboardPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[420px] animate-pulse rounded-3xl bg-white/5" />
    ),
  },
);

export function BusinessSection() {
  return (
    <SectionShell id="business" dark>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <SectionHeading
            light
            eyebrow="Business platform"
            title="Built for businesses that ship more."
            description="Bulk shipping, reporting, API hooks and multi-user control — with a dashboard that reveals clarity, not noise."
          />
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {businessFeatures.map((feature) => (
              <li
                key={feature}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/80"
              >
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/quote"
            className="mt-8 inline-flex rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary hover:bg-accent-2"
          >
            Explore business shipping
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <DashboardPreview />
        </Reveal>
      </div>
    </SectionShell>
  );
}
