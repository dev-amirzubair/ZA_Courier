"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";

const claimTypes = [
  "Lost parcel",
  "Damaged parcel",
  "Missing contents",
  "Delivery issue",
];

const statuses = [
  "Submitted",
  "Under review",
  "Additional information",
  "Resolved",
] as const;

export function ClaimsFlow() {
  const { user } = useAuth();
  const [type, setType] = useState(claimTypes[0]);
  const [trackingNumber, setTrackingNumber] = useState("AU100239482");
  const [description, setDescription] = useState("");
  const [claimId, setClaimId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Please sign in to lodge a claim.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, trackingNumber, description }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to submit claim.");
        return;
      }
      setClaimId(data.claim.id);
    });
  };

  return (
    <div>
      <h1 className="text-4xl font-semibold">Claims</h1>
      <p className="mt-2 text-muted">
        {claimId
          ? `Claim ${claimId} received — status Under review.`
          : "Lodge a claim if a shipment was lost, damaged or incomplete."}
      </p>

      {!user && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          You need an account to submit claims.{" "}
          <Link href="/login?next=/claims" className="font-semibold underline">
            Sign in
          </Link>
        </p>
      )}

      {!claimId ? (
        <form
          className="mt-8 space-y-4 rounded-3xl border border-secondary/10 bg-white p-6"
          onSubmit={onSubmit}
        >
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Claim type</span>
            <select
              className="w-full rounded-xl border border-secondary/15 px-3 py-2.5"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {claimTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Tracking number</span>
            <input
              required
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full rounded-xl border border-secondary/15 px-3 py-2.5"
              placeholder="AU100239482"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Description</span>
            <textarea
              required
              minLength={10}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-secondary/15 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Upload photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="block w-full text-sm"
            />
          </label>
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending || !user}
            className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-primary disabled:opacity-50"
          >
            {isPending ? "Submitting…" : "Submit claim"}
          </button>
        </form>
      ) : (
        <div className="mt-8 rounded-3xl border border-secondary/10 bg-white p-6">
          <p className="font-semibold">Claim status</p>
          <ol className="mt-4 space-y-2">
            {statuses.map((status, index) => (
              <li
                key={status}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm",
                  index <= 1
                    ? "bg-accent/10 text-secondary"
                    : "bg-background text-muted",
                )}
              >
                {status}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
