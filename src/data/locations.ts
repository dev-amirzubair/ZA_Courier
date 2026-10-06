export const PACKAGE_TYPE_OPTIONS = [
  { value: "carton", label: "Carton" },
  { value: "satchel", label: "Satchel" },
  { value: "document", label: "Document" },
  { value: "pallet", label: "Pallet" },
  { value: "fragile", label: "Fragile" },
  { value: "other", label: "Other" },
] as const;

export const AU_STATE_OPTIONS = [
  "ACT",
  "NSW",
  "NT",
  "QLD",
  "SA",
  "TAS",
  "VIC",
  "WA",
] as const;

export const DEMO_LOCATIONS = [
  { suburb: "Melbourne", state: "VIC", postcode: "3000" },
  { suburb: "Sydney", state: "NSW", postcode: "2000" },
  { suburb: "Brisbane", state: "QLD", postcode: "4000" },
  { suburb: "Perth", state: "WA", postcode: "6000" },
  { suburb: "Adelaide", state: "SA", postcode: "5000" },
  { suburb: "Canberra", state: "ACT", postcode: "2600" },
  { suburb: "Darwin", state: "NT", postcode: "0800" },
] as const;
