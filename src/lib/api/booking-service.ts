import type { BookingConfirmation, BookingDraft } from "@/types/shipping";

export async function createBooking(
  draft: BookingDraft,
): Promise<BookingConfirmation> {
  const response = await fetch("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Unable to create booking.");
  }

  return data as BookingConfirmation;
}

export const bookingService = {
  createBooking,
};
