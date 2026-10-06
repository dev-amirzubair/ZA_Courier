"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { networkCities, networkRoutes } from "@/data/home";
import {
  Reveal,
  SectionHeading,
  SectionShell,
} from "@/components/ui/section";
import { duration, easeOutExpo, mapNodeReveal, routeDraw } from "@/lib/animations/presets";
import { cn } from "@/lib/utils";

export function AustraliaNetworkMap() {
  const [activeId, setActiveId] = useState<string>("sydney");
  const reduce = useReducedMotion();

  const cityMap = useMemo(() => {
    return Object.fromEntries(networkCities.map((city) => [city.id, city]));
  }, []);

  const active = cityMap[activeId] ?? networkCities[4];

  return (
    <SectionShell id="network" dark className="bg-primary">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 30%, rgba(25,195,177,0.28), transparent 35%)",
        }}
      />

      <Reveal>
        <SectionHeading
          light
          eyebrow="Australia network"
          title="A living logistics map"
          description="Hover or select a city to inspect depot activity, shipment volume and average delivery time. Routes draw as the section enters view."
        />
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-dark/60 p-3 md:p-5">
          <svg
            viewBox="0 0 100 100"
            className="aspect-[4/3] w-full"
            role="img"
            aria-label="Animated Australia logistics network map"
          >
            <defs>
              <linearGradient id="netRoute" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#19C3B1" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#19C3B1" />
                <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            <path
              d="M18 55 C 22 40, 30 28, 42 18 C 52 10, 62 12, 70 20 C 82 32, 90 48, 88 62 C 86 78, 74 88, 58 90 C 42 92, 28 84, 20 70 Z"
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.6"
            />

            {networkRoutes.map((route, index) => {
              const from = cityMap[route.from];
              const to = cityMap[route.to];
              if (!from || !to) return null;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2 - 4;
              const d = `M ${from.x} ${from.y} Q ${midX} ${midY}, ${to.x} ${to.y}`;

              return (
                <g key={route.id}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="url(#netRoute)"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    variants={routeDraw}
                    initial={reduce ? false : "hidden"}
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: index * 0.08, duration: duration.cinematic, ease: easeOutExpo }}
                  />
                  {!reduce && (
                    <motion.circle
                      r="1.1"
                      fill="#F5B942"
                      style={{ offsetPath: `path('${d}')` }}
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      transition={{
                        duration: 5 + index,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.4,
                      }}
                    />
                  )}
                </g>
              );
            })}

            {networkCities.map((city, index) => {
              const selected = city.id === activeId;
              return (
                <g key={city.id}>
                  <motion.circle
                    cx={city.x}
                    cy={city.y}
                    r={selected ? 2.6 : 2}
                    fill={selected ? "#F5B942" : "#19C3B1"}
                    variants={mapNodeReveal}
                    initial={reduce ? false : "hidden"}
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="cursor-pointer"
                    onClick={() => setActiveId(city.id)}
                    onMouseEnter={() => setActiveId(city.id)}
                  />
                  <text
                    x={city.x + 3.2}
                    y={city.y + 1.2}
                    fill={selected ? "#FFFFFF" : "rgba(255,255,255,0.72)"}
                    fontSize="2.8"
                    className="cursor-pointer"
                    onClick={() => setActiveId(city.id)}
                    onMouseEnter={() => setActiveId(city.id)}
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <motion.aside
          key={active.id}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-2">
            Depot insight
          </p>
          <h3 className="mt-2 text-2xl font-semibold">
            {active.name}
            <span className="ml-2 text-base font-medium text-white/50">
              {active.state}
            </span>
          </h3>
          <dl className="mt-6 space-y-4 text-sm">
            <InfoRow label="Depot" value={active.depot} />
            <InfoRow
              label="Shipments today"
              value={active.shipmentsToday.toLocaleString("en-AU")}
            />
            <InfoRow
              label="Average delivery"
              value={`${active.avgDeliveryHours} hrs`}
            />
            <InfoRow
              label="Service availability"
              value={active.available ? "Online" : "Limited"}
            />
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            {networkCities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setActiveId(city.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition",
                  city.id === activeId
                    ? "bg-accent text-primary"
                    : "bg-white/10 text-white/75 hover:bg-white/15",
                )}
              >
                {city.name}
              </button>
            ))}
          </div>
        </motion.aside>
      </div>
    </SectionShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
      <dt className="text-white/55">{label}</dt>
      <dd className="font-semibold text-white">{value}</dd>
    </div>
  );
}
