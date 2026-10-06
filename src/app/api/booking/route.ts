import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { paymentService } from "@/lib/api/payment-service";
import { notificationService } from "@/lib/api/notification-service";
import {
  createShipmentFromBooking,
  saveBooking,
  saveNotification,
  upsertShipment,
} from "@/lib/store/memory-db";
import type { BookingDraft } from "@/types/shipping";

const draftSchema = z.object({
  originSuburb: z.string().min(1),
  originState: z.string().min(2),
  originPostcode: z.string().regex(/^\d{4}$/),
  destinationSuburb: z.string().min(1),
  destinationState: z.string().min(2),
  destinationPostcode: z.string().regex(/^\d{4}$/),
  serviceCode: z.string().min(1),
  serviceName: z.string().min(1),
  serviceLevel: z.string().min(1),
  priceAud: z.number().positive(),
  packages: z
    .array(
      z.object({
        id: z.string(),
        packageType: z.string(),
        quantity: z.number().positive(),
        weightKg: z.number().positive(),
        lengthCm: z.number().positive(),
        widthCm: z.number().positive(),
        heightCm: z.number().positive(),
      }),
    )
    .min(1),
  deliveryOption: z.string().min(1),
  pickupRequired: z.boolean(),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = draftSchema.parse(await request.json()) as BookingDraft;

    const intent = await paymentService.createPaymentIntent(body.priceAud);
    const payment = await paymentService.confirmPayment(intent.id);

    if (payment.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment failed. Please try again." },
        { status: 402 },
      );
    }

    const trackingNumber = `AU${Math.floor(100000000 + Math.random() * 899999999)}`;
    const confirmation = {
      bookingId: `BK-${Date.now().toString().slice(-8)}`,
      trackingNumber,
      createdAt: new Date().toISOString(),
      draft: body,
    };

    saveBooking({
      ...confirmation,
      userId: session?.sub ?? "guest",
      paymentStatus: "succeeded",
      paymentId: payment.id,
    });

    upsertShipment(createShipmentFromBooking(confirmation));

    const notification = await notificationService.sendNotification({
      channel: "email",
      to: body.contactEmail,
      template: "booking_confirmation",
      data: {
        bookingId: confirmation.bookingId,
        trackingNumber: confirmation.trackingNumber,
      },
    });

    saveNotification({
      id: notification.id,
      userId: session?.sub,
      channel: "email",
      template: "booking_confirmation",
      to: body.contactEmail,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(confirmation);
  } catch {
    return NextResponse.json(
      { error: "Unable to create booking." },
      { status: 400 },
    );
  }
}
