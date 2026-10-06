"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { howItWorksSteps } from "@/data/home";
import {
  Reveal,
  SectionHeading,
  SectionShell,
} from "@/components/ui/section";

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 40%"],
  });

  const parcelX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["8%", "100%"]);

  return (
    <SectionShell id="send">
      <Reveal>
        <SectionHeading
          eyebrow="How it works"
          title="Book. Collect. Track. Deliver."
          description="As you scroll, the parcel moves through each operational stage — the interface explains the journey, not just the labels."
        />
      </Reveal>

      <div ref={ref} className="relative mt-12">
        <div className="mb-10 hidden h-2 overflow-hidden rounded-full bg-secondary/10 md:block">
          <motion.div
            className="h-full rounded-full bg-accent"
            style={{ width: reduce ? "100%" : progressWidth }}
          />
        </div>

        <div className="relative grid gap-6 md:grid-cols-4">
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute top-[-1.75rem] z-10 hidden h-8 w-8 -translate-x-1/2 items-center justify-center rounded-lg bg-highlight text-[10px] font-bold text-primary shadow-lg md:flex"
              style={{ left: parcelX }}
              aria-hidden
            >
              ZA
            </motion.div>
          )}

          {howItWorksSteps.map((step, index) => (
            <motion.article
              key={step.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-secondary/10 bg-white p-5"
            >
              <p className="text-xs font-semibold tracking-[0.18em] text-accent">
                {step.number}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
              <StepVisual kind={step.id} />
            </motion.article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function StepVisual({ kind }: { kind: string }) {
  if (kind === "book") {
    return (
      <div className="mt-5 flex h-16 items-center justify-center rounded-xl bg-background">
        <div className="relative h-10 w-14 rounded-md border border-accent/40 bg-accent/20">
          <div className="absolute inset-x-1 top-1 h-2 rounded-sm bg-accent" />
          <div className="absolute bottom-1 right-1 h-3 w-5 rounded-sm bg-primary/70" />
        </div>
      </div>
    );
  }

  if (kind === "collect") {
    return (
      <div className="mt-5 flex h-16 items-center justify-center rounded-xl bg-background">
        <div className="flex items-end gap-2">
          <div className="h-8 w-10 rounded-md bg-secondary/80" />
          <div className="h-5 w-5 rounded bg-accent" />
        </div>
      </div>
    );
  }

  if (kind === "track") {
    return (
      <div className="mt-5 flex h-16 items-center justify-center rounded-xl bg-background px-4">
        <div className="h-1 w-full rounded-full bg-secondary/15">
          <motion.div
            className="h-full w-1/2 rounded-full bg-accent"
            animate={{ x: ["0%", "90%", "0%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 flex h-16 items-center justify-center rounded-xl bg-background">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-accent" />
        <div className="h-8 w-8 rounded-full border-2 border-highlight/70" />
      </div>
    </div>
  );
}
