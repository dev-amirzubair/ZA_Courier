"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { serviceOfferings } from "@/data/home";
import {
  Reveal,
  SectionHeading,
  SectionShell,
  Stagger,
  StaggerItem,
} from "@/components/ui/section";

export function ServicesSection() {
  return (
    <SectionShell id="services">
      <Reveal>
        <SectionHeading
          eyebrow="Services"
          title="Shipping modes with motion that means something"
          description="Each service card carries a micro-animation of the operational idea — not a generic icon strip."
        />
      </Reveal>

      <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceOfferings.map((service) => (
          <StaggerItem key={service.id}>
            <Link
              href={service.href}
              className="group flex h-full flex-col rounded-2xl border border-secondary/10 bg-white p-5 transition hover:border-accent/40"
            >
              <ServiceMotion kind={service.kind} />
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
              <span className="mt-4 text-sm font-semibold text-accent transition group-hover:text-secondary">
                Explore →
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  );
}

function ServiceMotion({
  kind,
}: {
  kind: (typeof serviceOfferings)[number]["kind"];
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative h-28 overflow-hidden rounded-xl bg-secondary/5">
      {kind === "domestic" && (
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <House />
          <motion.div
            className="h-4 w-4 rounded-sm bg-accent"
            animate={reduce ? undefined : { x: [-36, 36, -36] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <House />
        </div>
      )}

      {kind === "express" && (
        <div className="absolute inset-0 flex items-center px-5">
          <motion.div
            className="h-1 flex-1 rounded-full bg-secondary/15"
            initial={false}
          >
            <motion.div
              className="h-full w-1/3 rounded-full bg-highlight"
              animate={reduce ? undefined : { x: ["0%", "200%", "0%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      )}

      {kind === "interstate" && (
        <svg viewBox="0 0 120 60" className="h-full w-full p-3">
          <motion.path
            d="M10 45 Q 40 10, 60 30 T 110 18"
            fill="none"
            stroke="#19C3B1"
            strokeWidth="2"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          />
          <circle cx="10" cy="45" r="3" fill="#14213D" />
          <circle cx="110" cy="18" r="3" fill="#14213D" />
        </svg>
      )}

      {kind === "ecommerce" && (
        <div className="absolute inset-0 flex items-center justify-around px-4">
          <Box label="Orders" />
          <motion.div
            className="h-3 w-3 rounded-full bg-accent"
            animate={reduce ? undefined : { x: [-10, 10, -10] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
          <Box label="Hub" />
          <motion.div
            className="h-3 w-3 rounded-full bg-highlight"
            animate={reduce ? undefined : { x: [-10, 10, -10] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
          />
          <Box label="Customer" />
        </div>
      )}

      {kind === "business" && (
        <div className="absolute inset-0 flex items-end justify-center gap-2 pb-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-sm bg-accent"
              animate={
                reduce
                  ? undefined
                  : { y: [0, -18 - i * 4, 0], opacity: [0.5, 1, 0.5] }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      )}

      {kind === "returns" && (
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <Box label="Customer" />
          <motion.div
            className="h-3 w-8 rounded-full bg-secondary/20"
            animate={reduce ? undefined : { rotate: [0, 180, 360] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />
          <Box label="Depot" />
        </div>
      )}
    </div>
  );
}

function House() {
  return <div className="h-8 w-8 rounded-md bg-secondary/80" />;
}

function Box({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-7 w-7 rounded-md bg-secondary/70" />
      <span className="text-[9px] uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
    </div>
  );
}
