import type { ShipmentTracking } from "@/types/shipping";

export async function getTracking(
  trackingNumber: string,
): Promise<ShipmentTracking | null> {
  const response = await fetch(
    `/api/tracking?q=${encodeURIComponent(trackingNumber)}`,
    { cache: "no-store" },
  );
  const data = (await response.json()) as {
    found: ShipmentTracking[];
  };
  return data.found[0] ?? null;
}

export async function getTrackingMany(
  trackingNumbers: string[],
): Promise<{ found: ShipmentTracking[]; missing: string[] }> {
  const response = await fetch(
    `/api/tracking?q=${encodeURIComponent(trackingNumbers.join(","))}`,
    { cache: "no-store" },
  );
  return (await response.json()) as {
    found: ShipmentTracking[];
    missing: string[];
  };
}

export const trackingService = {
  getTracking,
  getTrackingMany,
};
