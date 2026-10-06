export const networkCities = [
  {
    id: "perth",
    name: "Perth",
    state: "WA",
    x: 12,
    y: 62,
    depot: "West Hub",
    shipmentsToday: 842,
    avgDeliveryHours: 36,
    available: true,
  },
  {
    id: "adelaide",
    name: "Adelaide",
    state: "SA",
    x: 48,
    y: 68,
    depot: "Central Hub",
    shipmentsToday: 1264,
    avgDeliveryHours: 28,
    available: true,
  },
  {
    id: "melbourne",
    name: "Melbourne",
    state: "VIC",
    x: 62,
    y: 78,
    depot: "South Hub",
    shipmentsToday: 3180,
    avgDeliveryHours: 22,
    available: true,
  },
  {
    id: "canberra",
    name: "Canberra",
    state: "ACT",
    x: 72,
    y: 70,
    depot: "Capital Node",
    shipmentsToday: 610,
    avgDeliveryHours: 20,
    available: true,
  },
  {
    id: "sydney",
    name: "Sydney",
    state: "NSW",
    x: 78,
    y: 62,
    depot: "East Hub",
    shipmentsToday: 4022,
    avgDeliveryHours: 18,
    available: true,
  },
  {
    id: "brisbane",
    name: "Brisbane",
    state: "QLD",
    x: 82,
    y: 42,
    depot: "North Hub",
    shipmentsToday: 2210,
    avgDeliveryHours: 24,
    available: true,
  },
  {
    id: "darwin",
    name: "Darwin",
    state: "NT",
    x: 48,
    y: 12,
    depot: "Top End",
    shipmentsToday: 286,
    avgDeliveryHours: 48,
    available: true,
  },
] as const;

export const networkRoutes: Array<{
  id: string;
  from: (typeof networkCities)[number]["id"];
  to: (typeof networkCities)[number]["id"];
}> = [
  { id: "perth-adelaide", from: "perth", to: "adelaide" },
  { id: "adelaide-melbourne", from: "adelaide", to: "melbourne" },
  { id: "melbourne-canberra", from: "melbourne", to: "canberra" },
  { id: "canberra-sydney", from: "canberra", to: "sydney" },
  { id: "sydney-brisbane", from: "sydney", to: "brisbane" },
  { id: "adelaide-darwin", from: "adelaide", to: "darwin" },
  { id: "melbourne-sydney", from: "melbourne", to: "sydney" },
];

export const serviceOfferings = [
  {
    id: "domestic",
    title: "Domestic Delivery",
    description: "Reliable door-to-door movement between Australian suburbs.",
    href: "/quote",
    kind: "domestic" as const,
  },
  {
    id: "express",
    title: "Express Delivery",
    description: "Priority handling when timing is non-negotiable.",
    href: "/quote",
    kind: "express" as const,
  },
  {
    id: "interstate",
    title: "Interstate Delivery",
    description: "Linehaul routes connecting capital cities and regional hubs.",
    href: "/quote",
    kind: "interstate" as const,
  },
  {
    id: "ecommerce",
    title: "Ecommerce Delivery",
    description: "Order-to-door workflows built for high-volume merchants.",
    href: "/quote",
    kind: "ecommerce" as const,
  },
  {
    id: "business",
    title: "Business Shipping",
    description: "Multi-user shipping with reporting, invoices and API hooks.",
    href: "/#business",
    kind: "business" as const,
  },
  {
    id: "returns",
    title: "Returns",
    description: "Customer-friendly reverse logistics for returns and exchanges.",
    href: "/quote",
    kind: "returns" as const,
  },
];

export const deliveryOptionItems = [
  {
    id: "home",
    title: "Home delivery",
    description: "Deliver to the recipient address with signature options.",
  },
  {
    id: "safe-drop",
    title: "Safe drop",
    description: "Leave in an agreed safe place if no one is home.",
  },
  {
    id: "neighbour",
    title: "Neighbour",
    description: "Redirect to a trusted neighbour when needed.",
  },
  {
    id: "alt-day",
    title: "Alternative day",
    description: "Shift delivery to the next convenient business day.",
  },
];

export const testimonials = [
  {
    id: "t1",
    quote:
      "We finally see every parcel as a living route — not a black box between order and POD.",
    name: "Amelia Crowe",
    role: "Operations Lead, Meridian Retail",
  },
  {
    id: "t2",
    quote:
      "Quotes feel honest. Chargeable weight and service options are clear before we commit.",
    name: "Jonah Blake",
    role: "Founder, Northbound Goods",
  },
  {
    id: "t3",
    quote:
      "The business dashboard replaced three spreadsheets. Exceptions surface before customers call.",
    name: "Priya Nair",
    role: "Logistics Manager, Arcadia Labs",
  },
];

export const trustStats = [
  { id: "parcels", label: "Parcels moved", value: "2.4M+", detail: "Last 12 months" },
  { id: "locations", label: "Network locations", value: "180+", detail: "Depots & nodes" },
  { id: "ontime", label: "On-time delivery", value: "97.2%", detail: "Tracked shipments" },
  { id: "routes", label: "Active routes", value: "1,240", detail: "Live today" },
];

export const howItWorksSteps = [
  {
    id: "book",
    number: "01",
    title: "Book",
    description: "Create a shipment, attach the label, and lock in service level.",
  },
  {
    id: "collect",
    number: "02",
    title: "Collect",
    description: "A driver collects from your door or business address.",
  },
  {
    id: "track",
    number: "03",
    title: "Track",
    description: "Follow every scan as the parcel moves across the network.",
  },
  {
    id: "deliver",
    number: "04",
    title: "Deliver",
    description: "Recipient receives with proof of delivery and clear status.",
  },
];

export const businessFeatures = [
  "Bulk shipping",
  "Live dashboard",
  "Reporting exports",
  "API integration",
  "Automated tracking",
  "Multiple users",
  "Custom pricing",
];

export const dashboardShipments = [
  {
    tracking: "AU100239482",
    destination: "Sydney NSW",
    status: "In transit",
    eta: "Tomorrow",
  },
  {
    tracking: "AU100239483",
    destination: "Brisbane QLD",
    status: "Out for delivery",
    eta: "Today 14:20",
  },
  {
    tracking: "AU100239484",
    destination: "Perth WA",
    status: "Sorted",
    eta: "Wed",
  },
  {
    tracking: "AU100239485",
    destination: "Adelaide SA",
    status: "Delivered",
    eta: "Completed",
  },
];

export const dashboardSeries = [
  { day: "Mon", shipments: 420 },
  { day: "Tue", shipments: 510 },
  { day: "Wed", shipments: 465 },
  { day: "Thu", shipments: 590 },
  { day: "Fri", shipments: 640 },
  { day: "Sat", shipments: 310 },
  { day: "Sun", shipments: 220 },
];
