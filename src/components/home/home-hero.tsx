"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { duration, easeOutExpo } from "@/lib/animations/presets";

const heroRoute = [
  { x: 28, y: 72, label: "Melbourne" },
  { x: 52, y: 48, label: "Sydney" },
  { x: 72, y: 28, label: "Brisbane" },
];

export function HomeHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(25,195,177,0.25), transparent 40%), radial-gradient(circle at 80% 10%, rgba(94,234,212,0.12), transparent 35%), linear-gradient(180deg, rgba(7,17,31,0.2), rgba(7,17,31,1))",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-28 md:px-6 md:pb-28 md:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-2">
            Australian logistics technology
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight md:text-6xl">
            Move anything.
            <br />
            Know everything.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
            Fast, trackable parcel delivery across Australia — built for people
            and businesses that need certainty.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary transition hover:bg-accent-2"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              Track a Parcel
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px] rounded-3xl border border-white/10 bg-primary/40 p-4 md:min-h-[380px]">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            role="img"
            aria-label="Animated logistics route from Melbourne to Brisbane"
          >
            <defs>
              <linearGradient id="heroRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#19C3B1" />
                <stop offset="100%" stopColor="#5EEAD4" />
              </linearGradient>
            </defs>

            {[20, 40, 60, 80].map((y) => (
              <line
                key={`h-${y}`}
                x1="8"
                x2="92"
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.4"
              />
            ))}
            {[20, 40, 60, 80].map((x) => (
              <line
                key={`v-${x}`}
                y1="8"
                y2="92"
                x1={x}
                x2={x}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.4"
              />
            ))}

            <motion.path
              d={`M ${heroRoute[0].x} ${heroRoute[0].y} Q 40 58, ${heroRoute[1].x} ${heroRoute[1].y} T ${heroRoute[2].x} ${heroRoute[2].y}`}
              fill="none"
              stroke="url(#heroRouteGrad)"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: duration.cinematic, ease: easeOutExpo }}
            />

            {heroRoute.map((node, index) => (
              <g key={node.label}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="2.2"
                  fill="#19C3B1"
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 + index * 0.25, duration: 0.4 }}
                />
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="4.5"
                  fill="none"
                  stroke="#5EEAD4"
                  strokeOpacity="0.45"
                  initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                  animate={
                    reduce
                      ? { scale: 1, opacity: 0.4 }
                      : { scale: [0.8, 1.35, 0.8], opacity: [0.55, 0.15, 0.55] }
                  }
                  transition={{
                    delay: 0.6 + index * 0.25,
                    duration: 2.4,
                    repeat: Infinity,
                  }}
                />
                <text
                  x={node.x + 4}
                  y={node.y - 3}
                  fill="rgba(255,255,255,0.78)"
                  fontSize="3.4"
                >
                  {node.label}
                </text>
              </g>
            ))}

            {!reduce && (
              <motion.circle
                r="1.8"
                fill="#F5B942"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
                style={{
                  offsetPath: `path('M ${heroRoute[0].x} ${heroRoute[0].y} Q 40 58, ${heroRoute[1].x} ${heroRoute[1].y} T ${heroRoute[2].x} ${heroRoute[2].y}')`,
                }}
              />
            )}
          </svg>

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {["SCAN", "CHECK", "DISPATCH"].map((label, index) => (
              <motion.span
                key={label}
                className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-accent-2"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.35 }}
              >
                {label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
