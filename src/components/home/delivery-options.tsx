"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { deliveryOptionItems } from "@/data/home";
import {
  Reveal,
  SectionHeading,
  SectionShell,
} from "@/components/ui/section";
import { cn } from "@/lib/utils";

export function DeliveryOptionsSection() {
  const [selected, setSelected] = useState(deliveryOptionItems[0].id);
  const reduce = useReducedMotion();
  const active =
    deliveryOptionItems.find((item) => item.id === selected) ??
    deliveryOptionItems[0];

  return (
    <SectionShell id="delivery-options">
      <div id="receive" className="scroll-mt-24">
        <Reveal>
          <SectionHeading
            eyebrow="Delivery options"
            title="Choose how the last mile should land"
            description="Interactive delivery preferences help reduce missed deliveries without burying the choice in fine print."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {deliveryOptionItems.map((option) => {
              const isActive = option.id === selected;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  layout
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    isActive
                      ? "border-accent bg-accent/10 ring-2 ring-accent/25"
                      : "border-secondary/10 bg-white hover:border-accent/30",
                  )}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                >
                  <h3 className="text-base font-semibold text-foreground">
                    {option.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{option.description}</p>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.aside
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              className="rounded-3xl border border-secondary/10 bg-secondary p-6 text-white"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2">
                Selected
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{active.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {active.description}
              </p>
              <p className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm text-accent-2">
                This option may reduce the chance of a missed delivery.
              </p>
            </motion.aside>
          </AnimatePresence>
        </div>
      </div>
    </SectionShell>
  );
}
