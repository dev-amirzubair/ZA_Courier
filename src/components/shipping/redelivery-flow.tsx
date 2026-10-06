"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { redeliveryService } from "@/lib/api/redelivery-service";
import type { RedeliveryResult } from "@/types/shipping";
import { cn } from "@/lib/utils";

export function RedeliveryFlow() {
  const reduce = useReducedMotion();
  const [trackingNumber, setTrackingNumber] = useState("AU100239482");
  const [postcode, setPostcode] = useState("2000");
  const [result, setResult] = useState<RedeliveryResult | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const lookup = () => {
    setError(null);
    setConfirmation(null);
    startTransition(async () => {
      const response = await redeliveryService.lookupRedelivery({
        trackingNumber,
        postcode,
      });
      if (!response.ok) {
        setResult(null);
        setError(response.error);
        return;
      }
      setResult(response.result);
      setSelected(response.result.options[0]?.id ?? null);
    });
  };

  const confirm = () => {
    if (!result || !selected) return;
    startTransition(async () => {
      const response = await redeliveryService.confirmRedelivery({
        trackingNumber: result.trackingNumber,
        optionId: selected,
      });
      setConfirmation(response.message);
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-secondary/10 bg-white p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Receive
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Arrange a redelivery</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your tracking number and delivery postcode to see available
          options.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1.5 block font-medium">Tracking number</span>
            <input
              className={inputClass}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-medium">Postcode</span>
            <input
              className={inputClass}
              value={postcode}
              maxLength={4}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={lookup}
          disabled={isPending}
          className="mt-5 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary"
        >
          {isPending ? "Checking shipment…" : "Find redelivery options"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {result && !confirmation && (
          <motion.div
            key="options"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-secondary/10 bg-white p-6 md:p-8"
          >
            <h2 className="text-xl font-semibold">{result.trackingNumber}</h2>
            <p className="mt-1 text-sm text-muted">{result.shipmentSummary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="Previous attempt" value={result.previousAttempt} />
              <Info label="Reason" value={result.reason} />
            </div>

            <div className="mt-6 space-y-3">
              {result.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition",
                    selected === option.id
                      ? "border-accent bg-accent/10 ring-2 ring-accent/20"
                      : "border-secondary/10 hover:border-accent/30",
                  )}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="mt-1 text-sm text-muted">{option.description}</p>
                  <p className="mt-2 text-xs font-medium text-accent">
                    {option.availableOn}
                  </p>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={confirm}
              disabled={!selected || isPending}
              className="mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Confirm redelivery
            </button>
          </motion.div>
        )}

        {confirmation && (
          <motion.div
            key="done"
            initial={reduce ? false : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl border border-accent/30 bg-accent/10 p-8 text-center"
          >
            <p className="text-2xl font-semibold text-foreground">Confirmed</p>
            <p className="mt-2 text-sm text-muted">{confirmation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-secondary/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-accent";
