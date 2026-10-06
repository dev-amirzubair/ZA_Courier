"use client";

import { testimonials } from "@/data/home";
import {
  Reveal,
  SectionHeading,
  SectionShell,
  Stagger,
  StaggerItem,
} from "@/components/ui/section";

export function TestimonialsSection() {
  return (
    <SectionShell>
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Customer voices"
          title="Certainty you can feel in operations"
          description="Original stories from teams that need visibility as much as velocity."
        />
      </Reveal>

      <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
        {testimonials.map((item) => (
          <StaggerItem key={item.id}>
            <figure className="flex h-full flex-col rounded-2xl border border-secondary/10 bg-white p-6">
              <blockquote className="flex-1 text-base leading-relaxed text-foreground">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-secondary/10 pt-4">
                <p className="font-semibold text-secondary">{item.name}</p>
                <p className="mt-1 text-sm text-muted">{item.role}</p>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  );
}
