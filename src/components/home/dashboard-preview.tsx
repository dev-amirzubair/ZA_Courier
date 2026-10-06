"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardSeries, dashboardShipments } from "@/data/home";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Total shipments", value: "12,480" },
  { label: "In transit", value: "1,942" },
  { label: "Delivered", value: "10,211" },
  { label: "Exceptions", value: "47" },
  { label: "Today's pickups", value: "286" },
];

export function DashboardPreview() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="rounded-3xl border border-white/10 bg-[#0B1220] p-4 shadow-2xl md:p-5"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2">
            Operations dashboard
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Live shipping overview
          </h3>
        </div>
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent-2">
          Preview
        </span>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="rounded-xl bg-white/5 px-3 py-2.5"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 * index }}
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">
              {metric.label}
            </p>
            <p className="mt-1 text-lg font-semibold text-white">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl bg-white/[0.04] p-3">
          <p className="mb-2 text-xs font-medium text-white/60">
            Shipments over time
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardSeries}>
                <defs>
                  <linearGradient id="shipFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#19C3B1" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#19C3B1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "#14213D",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="shipments"
                  stroke="#5EEAD4"
                  strokeWidth={2}
                  fill="url(#shipFill)"
                  isAnimationActive={!reduce}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-3">
          <p className="mb-3 text-xs font-medium text-white/60">Active map</p>
          <div className="relative h-44 overflow-hidden rounded-xl bg-dark">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 40%, rgba(25,195,177,0.35), transparent 30%), radial-gradient(circle at 70% 55%, rgba(245,185,66,0.25), transparent 25%)",
              }}
            />
            {!reduce && (
              <>
                <motion.span
                  className="absolute left-[28%] top-[42%] h-2.5 w-2.5 rounded-full bg-accent"
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                <motion.span
                  className="absolute left-[66%] top-[50%] h-2.5 w-2.5 rounded-full bg-highlight"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: 0.4 }}
                />
              </>
            )}
            <p className="absolute bottom-3 left-3 text-[11px] text-white/55">
              Active shipments across metro hubs
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white/[0.04]">
        <table className="min-w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.12em] text-white/45">
            <tr>
              <th className="px-3 py-2.5 font-medium">Tracking</th>
              <th className="px-3 py-2.5 font-medium">Destination</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">ETA</th>
            </tr>
          </thead>
          <tbody>
            {dashboardShipments.map((row) => (
              <tr key={row.tracking} className="border-t border-white/5">
                <td className="px-3 py-2.5 font-medium text-white">
                  {row.tracking}
                </td>
                <td className="px-3 py-2.5 text-white/70">{row.destination}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      row.status === "Delivered"
                        ? "bg-accent/20 text-accent-2"
                        : "bg-white/10 text-white/80",
                    )}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-white/70">{row.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
