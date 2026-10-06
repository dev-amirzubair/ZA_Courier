import type { BookingConfirmation } from "@/types/shipping";

export interface PaymentIntent {
  id: string;
  amountAud: number;
  status: "requires_confirmation" | "succeeded" | "failed";
}

/** Mock payment abstraction — swap for Stripe/Adyen later. */
export async function createPaymentIntent(
  amountAud: number,
): Promise<PaymentIntent> {
  await delay(300);
  return {
    id: `pi_${Date.now()}`,
    amountAud,
    status: "requires_confirmation",
  };
}

export async function confirmPayment(
  intentId: string,
): Promise<PaymentIntent> {
  await delay(500);
  if (!intentId) {
    return { id: "pi_failed", amountAud: 0, status: "failed" };
  }
  return { id: intentId, amountAud: 0, status: "succeeded" };
}

export async function recordBookingPayment(
  confirmation: BookingConfirmation,
): Promise<PaymentIntent> {
  const intent = await createPaymentIntent(confirmation.draft.priceAud);
  return confirmPayment(intent.id);
}

export const paymentService = {
  createPaymentIntent,
  confirmPayment,
  recordBookingPayment,
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
