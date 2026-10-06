"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { bookingService } from "@/lib/api/booking-service";
import type { BookingDraft, BookingConfirmation } from "@/types/shipping";
import { ParcelVisual } from "@/components/shipping/parcel-visual";
import { createPackageId, cn, formatAud } from "@/lib/utils";
import { PACKAGE_TYPE_OPTIONS } from "@/data/locations";

const steps = [
  "Pickup",
  "Delivery",
  "Package",
  "Service",
  "Review",
  "Payment",
  "Confirmation",
] as const;

const deliveryOptions = [
  { id: "home", label: "Home delivery" },
  { id: "safe-drop", label: "Safe drop" },
  { id: "neighbour", label: "Neighbour" },
  { id: "alt-day", label: "Alternative day" },
];

export interface BookingSeed {
  originSuburb?: string;
  originState?: string;
  originPostcode?: string;
  destinationSuburb?: string;
  destinationState?: string;
  destinationPostcode?: string;
  serviceCode?: string;
  serviceName?: string;
  serviceLevel?: string;
  priceAud?: number;
}

function buildInitialDraft(seed?: BookingSeed): BookingDraft {
  return {
    originSuburb: seed?.originSuburb ?? "Melbourne",
    originState: seed?.originState ?? "VIC",
    originPostcode: seed?.originPostcode ?? "3000",
    destinationSuburb: seed?.destinationSuburb ?? "Sydney",
    destinationState: seed?.destinationState ?? "NSW",
    destinationPostcode: seed?.destinationPostcode ?? "2000",
    serviceCode: seed?.serviceCode ?? "STD_ROAD",
    serviceName: seed?.serviceName ?? "Standard Road",
    serviceLevel: seed?.serviceLevel ?? "standard",
    priceAud: seed?.priceAud ?? 28.5,
    packages: [
      {
        id: createPackageId(),
        packageType: "carton",
        quantity: 1,
        weightKg: 5,
        lengthCm: 40,
        widthCm: 30,
        heightCm: 20,
      },
    ],
    deliveryOption: "home",
    pickupRequired: true,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  };
}

export function BookingFlow({ seed }: { seed?: BookingSeed }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>(() => buildInitialDraft(seed));
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const progress = ((step + 1) / steps.length) * 100;

  const totals = useMemo(() => {
    const totalItems = draft.packages.reduce((sum, pkg) => sum + pkg.quantity, 0);
    const totalWeight = draft.packages.reduce(
      (sum, pkg) => sum + pkg.weightKg * pkg.quantity,
      0,
    );
    return { totalItems, totalWeight };
  }, [draft.packages]);

  const update = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const canContinue = () => {
    if (step === 0) {
      return (
        draft.originSuburb &&
        draft.originState &&
        /^\d{4}$/.test(draft.originPostcode)
      );
    }
    if (step === 1) {
      return (
        draft.destinationSuburb &&
        draft.destinationState &&
        /^\d{4}$/.test(draft.destinationPostcode)
      );
    }
    if (step === 2) {
      return draft.packages.every(
        (pkg) =>
          pkg.quantity > 0 &&
          pkg.weightKg > 0 &&
          pkg.lengthCm > 0 &&
          pkg.widthCm > 0 &&
          pkg.heightCm > 0,
      );
    }
    if (step === 5) {
      return (
        draft.contactName.trim().length > 1 &&
        draft.contactEmail.includes("@") &&
        draft.contactPhone.trim().length >= 8
      );
    }
    return true;
  };

  const next = () => {
    setError(null);
    if (!canContinue()) {
      setError("Please complete the required fields before continuing.");
      return;
    }

    if (step === 5) {
      startTransition(async () => {
        try {
          const result = await bookingService.createBooking(draft);
          setConfirmation(result);
          setStep(6);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Payment failed. Please try again.",
          );
        }
      });
      return;
    }

    setStep((value) => Math.min(value + 1, steps.length - 1));
  };

  const back = () => setStep((value) => Math.max(value - 1, 0));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-secondary/10 bg-white p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Booking
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Create your shipment
        </h1>
        <p className="mt-2 text-sm text-muted">
          Animated multi-step booking — no page reloads between stages.
        </p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>
              Step {step + 1} of {steps.length}: {steps[step]}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary/10">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
          <div className="mt-3 hidden gap-1 md:flex">
            {steps.map((label, index) => (
              <span
                key={label}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
                  index === step
                    ? "bg-accent text-primary"
                    : index < step
                      ? "bg-accent/15 text-secondary"
                      : "bg-background text-muted",
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -18 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-secondary/10 bg-white p-6 md:p-8"
        >
          {step === 0 && (
            <AddressStep
              title="Pickup details"
              suburb={draft.originSuburb}
              state={draft.originState}
              postcode={draft.originPostcode}
              onSuburb={(v) => update("originSuburb", v)}
              onState={(v) => update("originState", v)}
              onPostcode={(v) => update("originPostcode", v)}
            />
          )}

          {step === 1 && (
            <AddressStep
              title="Delivery details"
              suburb={draft.destinationSuburb}
              state={draft.destinationState}
              postcode={draft.destinationPostcode}
              onSuburb={(v) => update("destinationSuburb", v)}
              onState={(v) => update("destinationState", v)}
              onPostcode={(v) => update("destinationPostcode", v)}
            />
          )}

          {step === 2 && (
            <PackageStep
              draft={draft}
              totals={totals}
              onChange={setDraft}
            />
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Service & delivery option</h2>
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
                <p className="text-sm text-muted">{draft.serviceLevel}</p>
                <p className="text-lg font-semibold">{draft.serviceName}</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatAud(draft.priceAud)}
                </p>
                <p className="text-xs text-muted">{draft.serviceCode}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => update("deliveryOption", option.id)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left text-sm font-medium",
                      draft.deliveryOption === option.id
                        ? "border-accent bg-accent/10"
                        : "border-secondary/10",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-accent">
                This option may reduce the chance of a missed delivery.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm">
              <h2 className="text-xl font-semibold">Review shipment</h2>
              <ReviewRow
                label="Route"
                value={`${draft.originSuburb} ${draft.originPostcode} → ${draft.destinationSuburb} ${draft.destinationPostcode}`}
              />
              <ReviewRow
                label="Packages"
                value={`${totals.totalItems} items · ${totals.totalWeight} kg`}
              />
              <ReviewRow label="Service" value={draft.serviceName} />
              <ReviewRow
                label="Delivery option"
                value={
                  deliveryOptions.find((o) => o.id === draft.deliveryOption)
                    ?.label ?? draft.deliveryOption
                }
              />
              <ReviewRow label="Total" value={formatAud(draft.priceAud)} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payment & contact</h2>
              <p className="text-sm text-muted">
                Simulated payment — no real card is charged.
              </p>
              <Field
                label="Full name"
                value={draft.contactName}
                onChange={(v) => update("contactName", v)}
              />
              <Field
                label="Email"
                value={draft.contactEmail}
                onChange={(v) => update("contactEmail", v)}
              />
              <Field
                label="Phone"
                value={draft.contactPhone}
                onChange={(v) => update("contactPhone", v)}
              />
              <div className="rounded-2xl bg-background p-4 text-sm">
                <p className="font-medium">Card ending ···· 4242</p>
                <p className="text-muted">Test payment method</p>
              </div>
            </div>
          )}

          {step === 6 && confirmation && (
            <div className="space-y-4 text-center">
              <motion.div
                initial={reduce ? false : { scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-xl font-bold text-primary"
              >
                ✓
              </motion.div>
              <h2 className="text-2xl font-semibold">Shipment confirmed</h2>
              <p className="text-sm text-muted">
                Booking {confirmation.bookingId}
              </p>
              <p className="text-lg font-semibold text-secondary">
                Tracking {confirmation.trackingNumber}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/track?q=${confirmation.trackingNumber}`)
                  }
                  className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-primary"
                >
                  Track shipment
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/quote")}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                >
                  New quote
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          {step < 6 && (
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={back}
                disabled={step === 0 || isPending}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={next}
                disabled={isPending}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary hover:bg-accent-2 disabled:opacity-70"
              >
                {isPending
                  ? "Creating your shipment…"
                  : step === 5
                    ? "Pay & confirm"
                    : "Continue"}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AddressStep(props: {
  title: string;
  suburb: string;
  state: string;
  postcode: string;
  onSuburb: (v: string) => void;
  onState: (v: string) => void;
  onPostcode: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{props.title}</h2>
      <Field label="Suburb" value={props.suburb} onChange={props.onSuburb} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="State" value={props.state} onChange={props.onState} />
        <Field
          label="Postcode"
          value={props.postcode}
          onChange={props.onPostcode}
        />
      </div>
    </div>
  );
}

function PackageStep({
  draft,
  totals,
  onChange,
}: {
  draft: BookingDraft;
  totals: { totalItems: number; totalWeight: number };
  onChange: (draft: BookingDraft) => void;
}) {
  const pkg = draft.packages[0];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Package builder</h2>
      {draft.packages.map((item, index) => (
        <div
          key={item.id}
          className="rounded-2xl border border-secondary/10 bg-background p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">Package {index + 1}</p>
            {draft.packages.length > 1 && (
              <button
                type="button"
                className="text-sm text-muted hover:text-red-600"
                onClick={() =>
                  onChange({
                    ...draft,
                    packages: draft.packages.filter((p) => p.id !== item.id),
                  })
                }
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Type</span>
              <select
                className={inputClass}
                value={item.packageType}
                onChange={(event) => {
                  const packages = draft.packages.map((p) =>
                    p.id === item.id
                      ? { ...p, packageType: event.target.value }
                      : p,
                  );
                  onChange({ ...draft, packages });
                }}
              >
                {PACKAGE_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            {(
              [
                ["quantity", "Qty"],
                ["weightKg", "Weight kg"],
                ["lengthCm", "Length"],
                ["widthCm", "Width"],
                ["heightCm", "Height"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="text-sm">
                <span className="mb-1 block font-medium">{label}</span>
                <input
                  type="number"
                  className={inputClass}
                  value={item[key]}
                  onChange={(event) => {
                    const packages = draft.packages.map((p) =>
                      p.id === item.id
                        ? { ...p, [key]: Number(event.target.value) }
                        : p,
                    );
                    onChange({ ...draft, packages });
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange({
            ...draft,
            packages: [
              ...draft.packages,
              {
                id: createPackageId(),
                packageType: "carton",
                quantity: 1,
                weightKg: 2,
                lengthCm: 30,
                widthCm: 20,
                heightCm: 15,
              },
            ],
          })
        }
        className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white"
      >
        Add another package
      </button>

      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <ParcelVisual
          lengthCm={pkg.lengthCm}
          widthCm={pkg.widthCm}
          heightCm={pkg.heightCm}
          weightKg={pkg.weightKg}
        />
        <div className="rounded-2xl bg-background p-4 text-sm">
          <p>
            Total items: <strong>{totals.totalItems}</strong>
          </p>
          <p className="mt-1">
            Total weight: <strong>{totals.totalWeight} kg</strong>
          </p>
          <p className="mt-1">
            Estimated price: <strong>{formatAud(draft.priceAud)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-secondary">{label}</span>
      <input
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-secondary/10 py-3">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-secondary/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent";
