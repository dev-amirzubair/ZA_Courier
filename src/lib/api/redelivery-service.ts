import { mockRedelivery, mockShipments } from "@/data/shipping";
import type { RedeliveryRequest, RedeliveryResult } from "@/types/shipping";

export async function lookupRedelivery(
  request: RedeliveryRequest,
): Promise<
  | { ok: true; result: RedeliveryResult }
  | { ok: false; error: string }
> {
  await delay(500);
  const tracking = request.trackingNumber.trim().toUpperCase();
  const postcode = request.postcode.trim();

  if (!/^AU\d{9}$/.test(tracking)) {
    return {
      ok: false,
      error: "Enter a valid ZA Courier tracking number (e.g. AU100239482).",
    };
  }

  if (!/^\d{4}$/.test(postcode)) {
    return { ok: false, error: "Enter a valid 4-digit Australian postcode." };
  }

  const shipment = mockShipments.find((item) => item.trackingNumber === tracking);
  if (!shipment) {
    return {
      ok: false,
      error: "We couldn’t find that shipment. Check the tracking number and try again.",
    };
  }

  if (shipment.destination.postcode !== postcode) {
    return {
      ok: false,
      error: "The postcode doesn’t match this shipment’s delivery address.",
    };
  }

  const result = mockRedelivery[tracking];
  if (!result) {
    return {
      ok: false,
      error: "This shipment isn’t eligible for redelivery right now.",
    };
  }

  return { ok: true, result };
}

export async function confirmRedelivery(input: {
  trackingNumber: string;
  optionId: string;
}): Promise<{ confirmationId: string; message: string }> {
  await delay(600);
  return {
    confirmationId: `RD-${Date.now().toString().slice(-8)}`,
    message: `Redelivery option “${input.optionId}” confirmed for ${input.trackingNumber}.`,
  };
}

export const redeliveryService = {
  lookupRedelivery,
  confirmRedelivery,
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
