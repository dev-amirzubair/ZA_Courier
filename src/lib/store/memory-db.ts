import type { BookingConfirmation, BookingDraft, ShipmentTracking } from "@/types/shipping";
import { mockShipments } from "@/data/shipping";

export interface StoredBooking extends BookingConfirmation {
  userId: string;
  paymentStatus: "succeeded" | "failed";
  paymentId: string;
}

export interface StoredClaim {
  id: string;
  userId: string;
  trackingNumber: string;
  type: string;
  description: string;
  status: "Submitted" | "Under review" | "Additional information" | "Resolved";
  createdAt: string;
}

export interface StoredContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface StoredNotification {
  id: string;
  userId?: string;
  channel: string;
  template: string;
  to: string;
  createdAt: string;
}

type MemoryDb = {
  bookings: StoredBooking[];
  shipments: ShipmentTracking[];
  claims: StoredClaim[];
  contacts: StoredContactMessage[];
  notifications: StoredNotification[];
};

const globalForDb = globalThis as unknown as { zaMemoryDb?: MemoryDb };

function db(): MemoryDb {
  if (!globalForDb.zaMemoryDb) {
    globalForDb.zaMemoryDb = {
      bookings: [],
      shipments: [...mockShipments],
      claims: [],
      contacts: [],
      notifications: [],
    };
  }
  return globalForDb.zaMemoryDb;
}

export function saveBooking(booking: StoredBooking) {
  db().bookings.unshift(booking);
}

export function listBookingsForUser(userId: string): StoredBooking[] {
  return db().bookings.filter((item) => item.userId === userId);
}

export function listAllBookings(): StoredBooking[] {
  return db().bookings;
}

export function upsertShipment(shipment: ShipmentTracking) {
  const store = db().shipments;
  const index = store.findIndex(
    (item) => item.trackingNumber === shipment.trackingNumber,
  );
  if (index >= 0) {
    store[index] = shipment;
  } else {
    store.unshift(shipment);
  }
}

export function findShipment(trackingNumber: string): ShipmentTracking | null {
  const key = trackingNumber.trim().toUpperCase();
  return (
    db().shipments.find((item) => item.trackingNumber === key) ?? null
  );
}

export function listShipments(): ShipmentTracking[] {
  return db().shipments;
}

export function saveClaim(claim: StoredClaim) {
  db().claims.unshift(claim);
}

export function listClaimsForUser(userId: string): StoredClaim[] {
  return db().claims.filter((item) => item.userId === userId);
}

export function listAllClaims(): StoredClaim[] {
  return db().claims;
}

export function saveContact(message: StoredContactMessage) {
  db().contacts.unshift(message);
}

export function saveNotification(notification: StoredNotification) {
  db().notifications.unshift(notification);
}

export function createShipmentFromBooking(
  booking: BookingConfirmation,
): ShipmentTracking {
  const now = new Date().toISOString();
  return {
    trackingNumber: booking.trackingNumber,
    status: "BOOKED",
    statusLabel: "Booked",
    origin: {
      suburb: booking.draft.originSuburb,
      state: booking.draft.originState,
      postcode: booking.draft.originPostcode,
    },
    destination: {
      suburb: booking.draft.destinationSuburb,
      state: booking.draft.destinationState,
      postcode: booking.draft.destinationPostcode,
    },
    serviceName: booking.draft.serviceName,
    estimatedDelivery: "2–5 business days",
    currentIndex: 0,
    events: [
      {
        id: `evt_${booking.bookingId}_1`,
        status: "BOOKED",
        label: "Booked",
        description: "Shipment created and label issued.",
        location: `${booking.draft.originSuburb} ${booking.draft.originState} ${booking.draft.originPostcode}`,
        occurredAt: now,
        completed: true,
      },
      {
        id: `evt_${booking.bookingId}_2`,
        status: "PICKED_UP",
        label: "Picked up",
        description: "Awaiting driver collection.",
        location: `${booking.draft.originSuburb} Hub`,
        occurredAt: "",
        completed: false,
      },
      {
        id: `evt_${booking.bookingId}_3`,
        status: "SORTED",
        label: "Sorted",
        description: "Pending sort centre scan.",
        location: "Sort Centre",
        occurredAt: "",
        completed: false,
      },
      {
        id: `evt_${booking.bookingId}_4`,
        status: "IN_TRANSIT",
        label: "In transit",
        description: "Pending linehaul.",
        location: "Network",
        occurredAt: "",
        completed: false,
      },
      {
        id: `evt_${booking.bookingId}_5`,
        status: "OUT_FOR_DELIVERY",
        label: "Out for delivery",
        description: "Pending local delivery run.",
        location: `${booking.draft.destinationSuburb} Hub`,
        occurredAt: "",
        completed: false,
      },
      {
        id: `evt_${booking.bookingId}_6`,
        status: "DELIVERED",
        label: "Delivered",
        description: "Awaiting final delivery.",
        location: `${booking.draft.destinationSuburb} ${booking.draft.destinationState}`,
        occurredAt: "",
        completed: false,
      },
    ],
  };
}

export type { BookingDraft };
