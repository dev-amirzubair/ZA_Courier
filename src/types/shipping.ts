export type TrackingStatus =
  | "BOOKED"
  | "PICKED_UP"
  | "SORTED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "ATTEMPTED"
  | "EXCEPTION";

export interface TrackingEvent {
  id: string;
  status: TrackingStatus;
  label: string;
  description: string;
  location: string;
  occurredAt: string;
  completed: boolean;
}

export interface ShipmentTracking {
  trackingNumber: string;
  status: TrackingStatus;
  statusLabel: string;
  origin: { suburb: string; state: string; postcode: string };
  destination: { suburb: string; state: string; postcode: string };
  serviceName: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
  currentIndex: number;
}

export interface RedeliveryRequest {
  trackingNumber: string;
  postcode: string;
}

export interface RedeliveryOption {
  id: string;
  label: string;
  description: string;
  availableOn: string;
}

export interface RedeliveryResult {
  trackingNumber: string;
  shipmentSummary: string;
  previousAttempt: string;
  reason: string;
  options: RedeliveryOption[];
}

export interface BookingPackage {
  id: string;
  packageType: string;
  quantity: number;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface BookingDraft {
  originSuburb: string;
  originState: string;
  originPostcode: string;
  destinationSuburb: string;
  destinationState: string;
  destinationPostcode: string;
  serviceCode: string;
  serviceName: string;
  serviceLevel: string;
  priceAud: number;
  packages: BookingPackage[];
  deliveryOption: string;
  pickupRequired: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface BookingConfirmation {
  bookingId: string;
  trackingNumber: string;
  createdAt: string;
  draft: BookingDraft;
}

export const TRACKING_STAGES: TrackingStatus[] = [
  "BOOKED",
  "PICKED_UP",
  "SORTED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];
