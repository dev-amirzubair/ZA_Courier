"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Clock3,
  MapPin,
  PackageCheck,
  Shield,
  Truck,
} from "lucide-react";
import type { NormalizedQuoteOffer, QuoteResult } from "@/types/pricing";
import { cn, formatAud } from "@/lib/utils";

interface QuoteResultsProps {
  result: QuoteResult | null;
  selectedOfferId?: string | null;
  onSelect?: (offer: NormalizedQuoteOffer) => void;
  isLoading?: boolean;
}

export function QuoteResults({
  result,
  selectedOfferId,
  onSelect,
  isLoading,
}: QuoteResultsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-primary/80 p-6 text-white">
        <div className="flex items-center gap-3">
          <motion.div
            className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"
            initial={false}
          >
            <motion.div
              className="h-full w-1/3 rounded-full bg-accent"
              animate={{ x: ["-20%", "220%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
        <p className="mt-4 text-sm text-white/70">Calculating your route and chargeable weight…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-secondary/20 bg-white p-8 text-center">
        <PackageCheck className="mx-auto h-8 w-8 text-accent" />
        <p className="mt-3 text-sm text-muted">
          Enter route and package details to see live service options and prices.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WeightSummary result={result} />

      {result.errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {result.errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      {result.warnings.map((warning) => (
        <div
          key={warning}
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {warning}
        </div>
      ))}

      <AnimatePresence mode="popLayout">
        {result.offers.map((offer, index) => (
          <motion.article
            key={offer.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
            className={cn(
              "rounded-2xl border bg-white p-5 shadow-sm transition",
              selectedOfferId === offer.id
                ? "border-accent ring-2 ring-accent/30"
                : "border-secondary/10 hover:border-accent/40",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {offer.carrierName} · {offer.serviceLevel.replace("_", " ")}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">
                  {offer.serviceName}
                </h3>
                <p className="mt-1 text-sm text-muted">{offer.serviceCode}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-foreground">
                  {formatAud(offer.price.amount)}
                </p>
                <p className="text-xs text-muted">inc. surcharges & fuel levy</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetaChip
                icon={<Clock3 className="h-4 w-4" />}
                label="Delivery"
                value={offer.estimatedDelivery.label}
              />
              <MetaChip
                icon={<Truck className="h-4 w-4" />}
                label="Pickup"
                value={
                  offer.pickup.available
                    ? `Available${offer.pickup.cutoffLocalTime ? ` · before ${offer.pickup.cutoffLocalTime}` : ""}`
                    : "Depot drop-off"
                }
              />
              <MetaChip
                icon={<Shield className="h-4 w-4" />}
                label="Cover"
                value={
                  offer.insurance.included
                    ? `Included up to ${formatAud(offer.insurance.coverAmountAud)}`
                    : "Optional at booking"
                }
              />
              <MetaChip
                icon={<MapPin className="h-4 w-4" />}
                label="Chargeable"
                value={`${offer.chargeableWeightKg} kg`}
              />
            </div>

            {offer.pickup.notes && (
              <p className="mt-3 text-sm text-muted">{offer.pickup.notes}</p>
            )}

            {offer.insurance.notes && (
              <p className="mt-1 text-sm text-muted">{offer.insurance.notes}</p>
            )}

            <ul className="mt-4 flex flex-wrap gap-2">
              {offer.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full bg-background px-3 py-1 text-xs font-medium text-secondary"
                >
                  {feature}
                </li>
              ))}
            </ul>

            <details className="mt-4 rounded-xl bg-background px-3 py-2 text-sm">
              <summary className="cursor-pointer font-medium text-secondary">
                Price breakdown
              </summary>
              <ul className="mt-2 space-y-1 text-muted">
                {offer.breakdown.map((line) => (
                  <li
                    key={`${offer.id}-${line.code}-${line.label}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <span>{line.label}</span>
                    <span>{formatAud(line.amount.amount)}</span>
                  </li>
                ))}
              </ul>
            </details>

            <button
              type="button"
              onClick={() => onSelect?.(offer)}
              className={cn(
                "mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                selectedOfferId === offer.id
                  ? "bg-accent text-primary"
                  : "bg-primary text-white hover:bg-secondary",
              )}
            >
              {selectedOfferId === offer.id ? (
                <>
                  <Check className="h-4 w-4" /> Selected
                </>
              ) : (
                "Select service"
              )}
            </button>
          </motion.article>
        ))}
      </AnimatePresence>

      {result.offers.length === 0 &&
        result.errors.length === 0 &&
        result.warnings.length === 0 && (
          <div className="rounded-2xl border border-secondary/10 bg-white p-8 text-center text-sm text-muted">
            No services matched this quote. Try different package types or destinations.
          </div>
        )}
    </div>
  );
}

function WeightSummary({ result }: { result: QuoteResult }) {
  return (
    <div className="rounded-2xl border border-secondary/10 bg-white p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
        Chargeable weight
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <Stat label="Actual" value={`${result.weight.totalActualWeightKg} kg`} />
        <Stat
          label="Volumetric"
          value={`${result.weight.totalVolumetricWeightKg} kg`}
        />
        <Stat
          label="Chargeable"
          value={`${result.weight.totalChargeableWeightKg} kg`}
          emphasize
        />
        <Stat
          label="Divisor"
          value={`L×W×H ÷ ${result.weight.volumetricDivisor}`}
        />
      </div>
      <p className="mt-3 text-xs text-muted">
        Chargeable weight is the higher of actual weight and volumetric weight for
        each package line, then summed. Volumetric = (cm³) ÷ {result.weight.volumetricDivisor}.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2",
        emphasize ? "bg-accent/10 text-secondary" : "bg-background",
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function MetaChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-background px-3 py-2">
      <div className="flex items-center gap-1.5 text-accent">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted">
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
