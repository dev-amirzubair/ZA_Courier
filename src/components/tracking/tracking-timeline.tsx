"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ShipmentTracking, TrackingStatus } from "@/types/shipping";
import { TRACKING_STAGES } from "@/types/shipping";
import { cn } from "@/lib/utils";

const stageLabels: Record<TrackingStatus, string> = {
  BOOKED: "Booked",
  PICKED_UP: "Picked up",
  SORTED: "Sorted",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  ATTEMPTED: "Attempted",
  EXCEPTION: "Exception",
};

export function TrackingTimeline({ shipment }: { shipment: ShipmentTracking }) {
  const reduce = useReducedMotion();
  const activeIndex = shipment.currentIndex;

  return (
    <div className="rounded-3xl border border-secondary/10 bg-white p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Shipment journey
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">
            {shipment.trackingNumber}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {shipment.origin.suburb} {shipment.origin.state} →{" "}
            {shipment.destination.suburb} {shipment.destination.state} ·{" "}
            {shipment.serviceName}
          </p>
        </div>
        <div className="rounded-2xl bg-accent/10 px-4 py-3 text-right">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
            Status
          </p>
          <p className="text-sm font-semibold text-secondary">
            {shipment.statusLabel}
          </p>
          <p className="mt-1 text-xs text-muted">ETA {shipment.estimatedDelivery}</p>
        </div>
      </div>

      <div className="mt-8 hidden md:block">
        <div className="relative px-2">
          <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-secondary/10" />
          <motion.div
            className="absolute left-0 top-4 h-1 rounded-full bg-accent"
            initial={reduce ? false : { width: "0%" }}
            animate={{
              width: `${(activeIndex / (TRACKING_STAGES.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          {!reduce && (
            <motion.div
              className="absolute top-2.5 h-4 w-4 -translate-x-1/2 rounded-md bg-highlight shadow"
              initial={{ left: "0%" }}
              animate={{
                left: `${(activeIndex / (TRACKING_STAGES.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden
            />
          )}
          <ol className="relative grid grid-cols-6 gap-2">
            {TRACKING_STAGES.map((stage, index) => {
              const done = index <= activeIndex;
              const active = index === activeIndex;
              return (
                <li key={stage} className="flex flex-col items-center pt-1 text-center">
                  <span
                    className={cn(
                      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold",
                      done
                        ? "bg-accent text-primary"
                        : "bg-secondary/10 text-muted",
                      active && "ring-4 ring-accent/20",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      "mt-3 text-xs font-medium",
                      done ? "text-foreground" : "text-muted",
                    )}
                  >
                    {stageLabels[stage]}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <ol className="mt-8 space-y-3 md:mt-10">
        {shipment.events.map((event, index) => {
          const active = index === activeIndex;
          return (
            <motion.li
              key={event.id}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "rounded-2xl border px-4 py-3",
                event.completed
                  ? "border-accent/20 bg-accent/5"
                  : "border-secondary/10 bg-background",
                active && "ring-2 ring-accent/30",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-foreground">{event.label}</p>
                <p className="text-xs text-muted">
                  {event.occurredAt
                    ? new Date(event.occurredAt).toLocaleString("en-AU")
                    : "Pending"}
                </p>
              </div>
              <p className="mt-1 text-sm text-muted">{event.description}</p>
              <p className="mt-1 text-xs font-medium text-secondary">
                {event.location}
              </p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
