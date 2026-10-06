import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { listUsers } from "@/lib/auth/users";
import {
  listAllBookings,
  listAllClaims,
  listShipments,
} from "@/lib/store/memory-db";
import { dashboardSeries, networkCities } from "@/data/home";

export async function GET() {
  try {
    await requireSession(["ADMIN"]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNAUTHORIZED";
    const status = message === "FORBIDDEN" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }

  const bookings = listAllBookings();
  const claims = listAllClaims();
  const shipments = listShipments();
  const users = listUsers().filter((user) =>
    ["CUSTOMER", "BUSINESS"].includes(user.role),
  );

  const revenueAud = bookings.reduce(
    (sum, booking) => sum + (booking.draft.priceAud || 0),
    0,
  );

  const drivers = [
    {
      id: "drv_1",
      name: "Sam Driver",
      email: "driver@zacourier.com.au",
      status: "Online",
      depot: "Melbourne South Hub",
      jobsToday: 12,
    },
    {
      id: "drv_2",
      name: "Riley Chen",
      status: "On route",
      depot: "Sydney East Hub",
      jobsToday: 9,
      email: "riley.chen@zacourier.com.au",
    },
    {
      id: "drv_3",
      name: "Morgan Lee",
      status: "Offline",
      depot: "Brisbane North Hub",
      jobsToday: 0,
      email: "morgan.lee@zacourier.com.au",
    },
  ];

  const depots = networkCities.map((city) => ({
    id: city.id,
    name: city.depot,
    city: `${city.name} ${city.state}`,
    shipmentsToday: city.shipmentsToday,
    avgDeliveryHours: city.avgDeliveryHours,
    status: city.available ? "Active" : "Limited",
  }));

  const quotes = bookings.slice(0, 20).map((booking) => ({
    id: booking.bookingId,
    service: booking.draft.serviceName,
    route: `${booking.draft.originSuburb} → ${booking.draft.destinationSuburb}`,
    priceAud: booking.draft.priceAud,
    createdAt: booking.createdAt,
  }));

  const payments = bookings.map((booking) => ({
    id: booking.paymentId,
    bookingId: booking.bookingId,
    trackingNumber: booking.trackingNumber,
    amountAud: booking.draft.priceAud,
    status: booking.paymentStatus,
    createdAt: booking.createdAt,
  }));

  return NextResponse.json({
    metrics: {
      shipmentsTracked: shipments.length,
      bookingsCount: bookings.length,
      openClaims: claims.filter((claim) => claim.status !== "Resolved").length,
      revenueAud,
      driversOnline: drivers.filter((d) => d.status !== "Offline").length,
      depotsActive: depots.filter((d) => d.status === "Active").length,
      exceptions: shipments.filter((s) =>
        ["ATTEMPTED", "EXCEPTION"].includes(s.status),
      ).length,
    },
    throughput: dashboardSeries,
    shipments,
    bookings,
    customers: users,
    drivers,
    depots,
    quotes,
    payments,
    claims,
  });
}
