"use client";

import type { ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useFieldArray,
  useForm,
  useWatch,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import {
  addressRefSchema,
  quotePackageSchema,
} from "@/lib/validation/quote";
import type {
  NormalizedQuoteOffer,
  QuoteRequest,
  QuoteResult,
} from "@/types/pricing";
import { AU_STATE_OPTIONS, DEMO_LOCATIONS, PACKAGE_TYPE_OPTIONS } from "@/data/locations";
import { createPackageId, cn } from "@/lib/utils";
import { ParcelVisual } from "@/components/shipping/parcel-visual";
import { QuoteResults } from "@/components/shipping/quote-results";

const quoteFormSchema = z.object({
  origin: addressRefSchema,
  destination: addressRefSchema,
  packages: z.array(quotePackageSchema).min(1).max(20),
  declaredValueAud: z.number().nonnegative().max(100000).optional(),
  pickupRequired: z.boolean().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

function defaultPackage(): QuoteFormValues["packages"][number] {
  return {
    id: createPackageId(),
    packageType: "carton",
    quantity: 1,
    weightKg: 5,
    dimensions: { lengthCm: 40, widthCm: 30, heightCm: 20 },
  };
}

const defaultValues: QuoteFormValues = {
  origin: { ...DEMO_LOCATIONS[0] },
  destination: { ...DEMO_LOCATIONS[1] },
  packages: [defaultPackage()],
  declaredValueAud: 100,
  pickupRequired: true,
};

export function QuoteFlow() {
  const router = useRouter();
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "packages",
  });

  const watchedPackages = useWatch({
    control: form.control,
    name: "packages",
  });

  const primaryPackage = watchedPackages?.[0] ?? defaultValues.packages[0];

  const estimatedVolumeHint = useMemo(() => {
    if (!primaryPackage) return null;
    const { lengthCm, widthCm, heightCm } = primaryPackage.dimensions;
    const volumetric = (lengthCm * widthCm * heightCm) / 4000;
    return {
      volumetric: Math.round(volumetric * 1000) / 1000,
      chargeable: Math.max(primaryPackage.weightKg, volumetric),
    };
  }, [primaryPackage]);

  const onSubmit = form.handleSubmit((values) => {
    setFormError(null);
    setSelectedOfferId(null);

    startTransition(async () => {
      try {
        const payload: QuoteRequest = {
          origin: values.origin,
          destination: values.destination,
          packages: values.packages,
          declaredValueAud: values.declaredValueAud,
          pickupRequired: values.pickupRequired,
        };

        const response = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = (await response.json()) as QuoteResult;

        if (!response.ok) {
          setFormError(data.errors?.[0] ?? "Unable to calculate quote.");
          setResult(data);
          return;
        }

        setResult(data);
      } catch {
        setFormError("Something went wrong calculating your quote. Please try again.");
      }
    });
  });

  const applyDemoLocation = (
    side: "origin" | "destination",
    index: number,
  ) => {
    const location = DEMO_LOCATIONS[index];
    if (!location) return;
    form.setValue(`${side}.suburb`, location.suburb, { shouldDirty: true });
    form.setValue(`${side}.state`, location.state, { shouldDirty: true });
    form.setValue(`${side}.postcode`, location.postcode, { shouldDirty: true });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-3xl border border-secondary/10 bg-white p-6 shadow-sm md:p-8"
      >
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Quote engine
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Get a delivery quote
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Enter route and package details. Pricing uses chargeable weight
            (actual vs volumetric), configurable rate rules, and multi-carrier
            normalisation — not hard-coded UI prices.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <AddressFields
            title="From"
            prefix="origin"
            form={form}
            onQuickSelect={(i) => applyDemoLocation("origin", i)}
          />
          <AddressFields
            title="To"
            prefix="destination"
            form={form}
            onQuickSelect={(i) => applyDemoLocation("destination", i)}
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Packages</h2>
            <button
              type="button"
              onClick={() => append(defaultPackage())}
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary"
            >
              <Plus className="h-4 w-4" />
              Add package
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-secondary/10 bg-background p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-secondary">
                    Package {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex items-center gap-1 text-sm text-muted hover:text-red-600"
                      aria-label={`Remove package ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Package type">
                    <select
                      className={inputClass}
                      {...form.register(`packages.${index}.packageType`)}
                    >
                      {PACKAGE_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Quantity">
                    <input
                      type="number"
                      min={1}
                      max={99}
                      className={inputClass}
                      {...form.register(`packages.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Field>

                  <Field label="Weight (kg)">
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      className={inputClass}
                      {...form.register(`packages.${index}.weightKg`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Field>

                  <Field label="Length (cm)">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className={inputClass}
                      {...form.register(`packages.${index}.dimensions.lengthCm`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Field>

                  <Field label="Width (cm)">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className={inputClass}
                      {...form.register(`packages.${index}.dimensions.widthCm`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Field>

                  <Field label="Height (cm)">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className={inputClass}
                      {...form.register(`packages.${index}.dimensions.heightCm`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                </div>

                {index === 0 && (
                  <div className="mt-4 grid gap-3 md:grid-cols-[160px_1fr]">
                    <ParcelVisual
                      lengthCm={primaryPackage.dimensions.lengthCm || 1}
                      widthCm={primaryPackage.dimensions.widthCm || 1}
                      heightCm={primaryPackage.dimensions.heightCm || 1}
                      weightKg={primaryPackage.weightKg || 0.1}
                    />
                    <div className="rounded-xl bg-white/70 p-3 text-sm text-muted">
                      <p>
                        Live preview updates as dimensions change. For this line,
                        volumetric ≈{" "}
                        <strong className="text-foreground">
                          {estimatedVolumeHint?.volumetric ?? "—"} kg
                        </strong>
                        ; chargeable uses the higher of actual and volumetric.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <Field label="Declared value (AUD)">
            <input
              type="number"
              min={0}
              step={1}
              className={inputClass}
              {...form.register("declaredValueAud", { valueAsNumber: true })}
            />
          </Field>
          <label className="mt-6 flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--color-accent)]"
              {...form.register("pickupRequired")}
            />
            Pickup required
          </label>
        </section>

        {formError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "w-full rounded-2xl bg-accent px-5 py-3.5 text-sm font-semibold text-primary transition hover:bg-accent-2",
            isPending && "opacity-70",
          )}
        >
          {isPending ? "Calculating delivery…" : "Calculate delivery"}
        </button>
      </form>

      <div className="space-y-4">
        <QuoteResults
          result={result}
          selectedOfferId={selectedOfferId}
          isLoading={isPending}
          onSelect={(offer: NormalizedQuoteOffer) => {
            setSelectedOfferId(offer.id);
            const values = form.getValues();
            const params = new URLSearchParams({
              fromSuburb: values.origin.suburb,
              fromState: values.origin.state,
              fromPostcode: values.origin.postcode,
              toSuburb: values.destination.suburb,
              toState: values.destination.state,
              toPostcode: values.destination.postcode,
              serviceCode: offer.serviceCode,
              serviceName: offer.serviceName,
              serviceLevel: offer.serviceLevel,
              price: String(offer.price.amount),
            });
            router.push(`/booking?${params.toString()}`);
          }}
        />
      </div>
    </div>
  );
}

function AddressFields({
  title,
  prefix,
  form,
  onQuickSelect,
}: {
  title: string;
  prefix: "origin" | "destination";
  form: UseFormReturn<QuoteFormValues>;
  onQuickSelect: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-secondary/10 bg-background p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
          {title}
        </h2>
        <select
          className="rounded-lg border border-secondary/10 bg-white px-2 py-1 text-xs"
          defaultValue=""
          onChange={(event) => {
            if (event.target.value === "") return;
            onQuickSelect(Number(event.target.value));
          }}
          aria-label={`Quick select ${title} city`}
        >
          <option value="">Quick city…</option>
          {DEMO_LOCATIONS.map((location, index) => (
            <option key={location.postcode + location.suburb} value={index}>
              {location.suburb}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-3">
        <Field label="Suburb">
          <input className={inputClass} {...form.register(`${prefix}.suburb`)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="State">
            <select className={inputClass} {...form.register(`${prefix}.state`)}>
              {AU_STATE_OPTIONS.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Postcode">
            <input
              className={inputClass}
              inputMode="numeric"
              maxLength={4}
              {...form.register(`${prefix}.postcode`)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-secondary">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-secondary/15 bg-white px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-accent";
