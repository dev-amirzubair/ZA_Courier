import { z } from "zod";

export const packageTypeSchema = z.enum([
  "carton",
  "satchel",
  "document",
  "pallet",
  "fragile",
  "other",
]);

export const packageDimensionsSchema = z.object({
  lengthCm: z.number().positive().max(300),
  widthCm: z.number().positive().max(300),
  heightCm: z.number().positive().max(300),
});

export const quotePackageSchema = z.object({
  id: z.string().min(1),
  packageType: packageTypeSchema,
  quantity: z.number().int().positive().max(99),
  weightKg: z.number().positive().max(1000),
  dimensions: packageDimensionsSchema,
  description: z.string().max(200).optional(),
});

export const addressRefSchema = z.object({
  suburb: z.string().min(1).max(80),
  state: z.string().min(2).max(3),
  postcode: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid Australian postcode"),
  country: z.literal("AU").optional(),
});

export const quoteRequestSchema = z
  .object({
    origin: addressRefSchema,
    destination: addressRefSchema,
    packages: z.array(quotePackageSchema).min(1).max(20),
    declaredValueAud: z.number().nonnegative().max(100000).optional(),
    pickupRequired: z.boolean().optional(),
    preferredServiceLevels: z
      .array(
        z.enum(["standard", "express", "priority", "economy", "same_day"]),
      )
      .optional(),
  })
  .superRefine((value, ctx) => {
    const same =
      value.origin.postcode === value.destination.postcode &&
      value.origin.suburb.toLowerCase() ===
        value.destination.suburb.toLowerCase();

    if (same) {
      ctx.addIssue({
        code: "custom",
        message: "Origin and destination must be different locations.",
        path: ["destination", "postcode"],
      });
    }
  });

export type QuoteFormValues = z.infer<typeof quoteRequestSchema>;
