"use client";

import { useState, useTransition } from "react";
import { trackingService } from "@/lib/api/tracking-service";
import type { ShipmentTracking } from "@/types/shipping";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";
import { cn } from "@/lib/utils";

const examples = ["AU100239482", "AU100239483", "AU100239484"];

export function TrackingFlow({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [input, setInput] = useState(initialQuery || examples[0]);
  const [results, setResults] = useState<ShipmentTracking[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onTrack = () => {
    setError(null);
    const numbers = input
      .split(/[\n,]+/)
      .map((value) => value.trim())
      .filter(Boolean);

    if (numbers.length === 0) {
      setError("Enter one or more tracking numbers.");
      return;
    }

    startTransition(async () => {
      const response = await trackingService.getTrackingMany(numbers);
      setResults(response.found);
      setMissing(response.missing);
      setSearched(true);
      if (response.found.length === 0 && response.missing.length > 0) {
        setError(
          "No shipments matched those tracking numbers. Try AU100239482.",
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-secondary/10 bg-white p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Track
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Where is your parcel?
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Enter one tracking number, or paste several separated by commas or new
          lines.
        </p>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-sm font-medium text-secondary">
            Tracking number(s)
          </span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-secondary/15 bg-background px-4 py-3 text-sm outline-none focus:border-accent"
            placeholder="AU100239482"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setInput(example)}
              className="rounded-full bg-background px-3 py-1 text-xs font-medium text-secondary hover:bg-accent/10"
            >
              {example}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onTrack}
          disabled={isPending}
          className={cn(
            "mt-5 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary hover:bg-accent-2",
            isPending && "opacity-70",
          )}
        >
          {isPending ? "Finding your parcel…" : "Track"}
        </button>
      </div>

      {searched && results.length === 0 && !isPending && !error && (
        <div className="rounded-3xl border border-dashed border-secondary/20 bg-white p-8 text-center text-sm text-muted">
          Enter a tracking number to see your parcel&apos;s journey.
        </div>
      )}

      {missing.length > 0 && results.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Not found: {missing.join(", ")}
        </div>
      )}

      <div className="space-y-6">
        {results.map((shipment) => (
          <TrackingTimeline key={shipment.trackingNumber} shipment={shipment} />
        ))}
      </div>
    </div>
  );
}
