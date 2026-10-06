"use client";

import { trustStats } from "@/data/home";
import {
  Reveal,
  SectionShell,
  Stagger,
  StaggerItem,
} from "@/components/ui/section";

export function TrustStatsSection() {
  return (
    <SectionShell className="py-12 md:py-16">
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Network certainty
        </p>
      </Reveal>
      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trustStats.map((stat) => (
          <StaggerItem key={stat.id}>
            <div className="rounded-2xl border border-secondary/10 bg-white px-5 py-6 text-center">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-secondary">
                {stat.label}
              </p>
              <p className="mt-1 text-xs text-muted">{stat.detail}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  );
}
