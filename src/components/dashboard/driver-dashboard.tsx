"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const jobs = [
  {
    id: "j1",
    type: "Pickup",
    address: "88 Collins St, Melbourne VIC 3000",
    window: "09:00–11:00",
    parcels: 2,
    status: "Next",
  },
  {
    id: "j2",
    type: "Delivery",
    address: "12 Flinders Lane, Melbourne VIC 3000",
    window: "11:30–13:00",
    parcels: 1,
    status: "Queued",
  },
  {
    id: "j3",
    type: "Delivery",
    address: "45 Chapel St, South Yarra VIC 3141",
    window: "14:00–16:00",
    parcels: 3,
    status: "Queued",
  },
];

export function DriverDashboard() {
  const [activeId, setActiveId] = useState(jobs[0].id);
  const [podDone, setPodDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const active = jobs.find((job) => job.id === activeId) ?? jobs[0];

  return (
    <div className="mx-auto max-w-md space-y-4">
      <header className="rounded-3xl bg-primary p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-2">
          Driver
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Today&apos;s jobs</h1>
        <p className="mt-1 text-sm text-white/70">Mobile-first route preview</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Stops" value="12" />
          <Stat label="Done" value="4" />
          <Stat label="ETA end" value="16:40" />
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-secondary/10 bg-white">
        <div className="relative h-40 bg-dark">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 35% 45%, rgba(25,195,177,0.45), transparent 30%), radial-gradient(circle at 70% 60%, rgba(245,185,66,0.35), transparent 28%)",
            }}
          />
          <motion.span
            className="absolute left-[35%] top-[45%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            animate={{ x: [0, 40, 70], y: [0, -10, 20] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="absolute bottom-3 left-3 text-xs text-white/70">
            Live route · mock GPS
          </p>
        </div>

        <div className="space-y-3 p-4">
          {jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => {
                setActiveId(job.id);
                setPodDone(false);
                setFailed(false);
              }}
              className={cn(
                "w-full rounded-2xl border p-3 text-left",
                activeId === job.id
                  ? "border-accent bg-accent/10"
                  : "border-secondary/10",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{job.type}</p>
                <span className="text-xs text-muted">{job.window}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{job.address}</p>
              <p className="mt-1 text-xs font-medium text-secondary">
                {job.parcels} parcel{job.parcels > 1 ? "s" : ""} · {job.status}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-secondary/10 bg-white p-4">
        <h2 className="font-semibold">Active stop</h2>
        <p className="mt-1 text-sm text-muted">{active.address}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setPodDone(true);
              setFailed(false);
            }}
            className="rounded-xl bg-accent px-3 py-3 text-sm font-semibold text-primary"
          >
            Proof of delivery
          </button>
          <button
            type="button"
            onClick={() => {
              setFailed(true);
              setPodDone(false);
            }}
            className="rounded-xl bg-secondary px-3 py-3 text-sm font-semibold text-white"
          >
            Failed delivery
          </button>
        </div>
        {podDone && (
          <p className="mt-3 rounded-xl bg-accent/10 px-3 py-2 text-sm text-secondary">
            POD captured — signature + photo mock saved.
          </p>
        )}
        {failed && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Failed attempt logged — recipient can book redelivery.
          </p>
        )}
        <button
          type="button"
          className="mt-3 w-full rounded-xl border border-secondary/15 px-3 py-3 text-sm font-semibold text-secondary"
        >
          Open navigation
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-2 py-2">
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/55">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
