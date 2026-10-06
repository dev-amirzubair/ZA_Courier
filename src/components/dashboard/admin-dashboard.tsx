"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn, formatAud } from "@/lib/utils";

type AdminSection =
  | "Overview"
  | "Shipments"
  | "Customers"
  | "Drivers"
  | "Depots"
  | "Quotes"
  | "Payments"
  | "Claims"
  | "Reports"
  | "Settings";

const nav: AdminSection[] = [
  "Overview",
  "Shipments",
  "Customers",
  "Drivers",
  "Depots",
  "Quotes",
  "Payments",
  "Claims",
  "Reports",
  "Settings",
];

interface AdminOverview {
  metrics: {
    shipmentsTracked: number;
    bookingsCount: number;
    openClaims: number;
    revenueAud: number;
    driversOnline: number;
    depotsActive: number;
    exceptions: number;
  };
  throughput: Array<{ day: string; shipments: number }>;
  shipments: Array<{
    trackingNumber: string;
    statusLabel: string;
    origin: { suburb: string; state: string };
    destination: { suburb: string; state: string };
    serviceName: string;
    estimatedDelivery: string;
  }>;
  bookings: Array<{
    bookingId: string;
    trackingNumber: string;
    createdAt: string;
    paymentStatus: string;
    draft: {
      serviceName: string;
      priceAud: number;
      originSuburb: string;
      destinationSuburb: string;
      contactName: string;
      contactEmail: string;
    };
  }>;
  customers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    companyName?: string;
    phone?: string;
  }>;
  drivers: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    depot: string;
    jobsToday: number;
  }>;
  depots: Array<{
    id: string;
    name: string;
    city: string;
    shipmentsToday: number;
    avgDeliveryHours: number;
    status: string;
  }>;
  quotes: Array<{
    id: string;
    service: string;
    route: string;
    priceAud: number;
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    bookingId: string;
    trackingNumber: string;
    amountAud: number;
    status: string;
    createdAt: string;
  }>;
  claims: Array<{
    id: string;
    trackingNumber: string;
    type: string;
    status: string;
    createdAt: string;
    description: string;
  }>;
}

export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("Overview");
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/admin/overview", {
          cache: "no-store",
        });
        if (!response.ok) {
          const body = await response.json();
          setError(body.error ?? "Unable to load admin data.");
          return;
        }
        setData((await response.json()) as AdminOverview);
      } catch {
        setError("Unable to load admin data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const title = useMemo(() => {
    switch (section) {
      case "Overview":
        return "Operations overview";
      case "Shipments":
        return "Shipments";
      case "Customers":
        return "Customers";
      case "Drivers":
        return "Drivers";
      case "Depots":
        return "Depots";
      case "Quotes":
        return "Quotes & bookings";
      case "Payments":
        return "Payments";
      case "Claims":
        return "Claims queue";
      case "Reports":
        return "Reports";
      case "Settings":
        return "Admin settings";
      default:
        return "Admin";
    }
  }, [section]);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-3xl border border-secondary/10 bg-white p-4">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Admin
        </p>
        <nav className="mt-4 space-y-1">
          {nav.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSection(item)}
              className={cn(
                "block w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition",
                section === item
                  ? "bg-accent/15 text-secondary"
                  : "text-muted hover:bg-background",
              )}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <div className="space-y-6">
        <header className="rounded-3xl border border-secondary/10 bg-white p-6">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted">
            Live admin workspace — bookings, claims and shipments from the
            shared store, plus operational reference data.
          </p>
        </header>

        {loading && (
          <div className="rounded-3xl border border-secondary/10 bg-white p-8 text-sm text-muted">
            Loading admin data…
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <>
            {section === "Overview" && <OverviewPanel data={data} />}
            {section === "Shipments" && <ShipmentsPanel data={data} />}
            {section === "Customers" && <CustomersPanel data={data} />}
            {section === "Drivers" && <DriversPanel data={data} />}
            {section === "Depots" && <DepotsPanel data={data} />}
            {section === "Quotes" && <QuotesPanel data={data} />}
            {section === "Payments" && <PaymentsPanel data={data} />}
            {section === "Claims" && <ClaimsPanel data={data} />}
            {section === "Reports" && <ReportsPanel data={data} />}
            {section === "Settings" && <SettingsPanel />}
          </>
        )}
      </div>
    </div>
  );
}

function OverviewPanel({ data }: { data: AdminOverview }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Shipments tracked", String(data.metrics.shipmentsTracked)],
          ["Bookings", String(data.metrics.bookingsCount)],
          ["Open claims", String(data.metrics.openClaims)],
          ["Booking revenue", formatAud(data.metrics.revenueAud)],
        ].map(([label, value]) => (
          <MetricCard key={label} label={label} value={value} />
        ))}
      </div>

      <div className="rounded-3xl border border-secondary/10 bg-white p-5">
        <h2 className="font-semibold">Network throughput</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.throughput}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="shipments" fill="#14213D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Drivers online"
          value={String(data.metrics.driversOnline)}
        />
        <MetricCard
          label="Depots active"
          value={String(data.metrics.depotsActive)}
        />
        <MetricCard
          label="Exception queue"
          value={String(data.metrics.exceptions)}
        />
      </div>

      <Link href="/driver" className="inline-flex text-sm font-semibold text-accent">
        Open driver workspace →
      </Link>
    </>
  );
}

function ShipmentsPanel({ data }: { data: AdminOverview }) {
  if (data.shipments.length === 0) {
    return <EmptyState text="No shipments in the store yet." />;
  }

  return (
    <PanelTable
      headers={["Tracking", "Route", "Service", "Status", "ETA"]}
      rows={data.shipments.map((shipment) => [
        shipment.trackingNumber,
        `${shipment.origin.suburb} ${shipment.origin.state} → ${shipment.destination.suburb} ${shipment.destination.state}`,
        shipment.serviceName,
        shipment.statusLabel,
        shipment.estimatedDelivery,
      ])}
    />
  );
}

function CustomersPanel({ data }: { data: AdminOverview }) {
  if (data.customers.length === 0) {
    return <EmptyState text="No customer accounts registered yet." />;
  }

  return (
    <PanelTable
      headers={["Name", "Email", "Role", "Company", "Phone"]}
      rows={data.customers.map((customer) => [
        customer.name,
        customer.email,
        customer.role,
        customer.companyName ?? "—",
        customer.phone ?? "—",
      ])}
    />
  );
}

function DriversPanel({ data }: { data: AdminOverview }) {
  return (
    <>
      <PanelTable
        headers={["Driver", "Email", "Depot", "Status", "Jobs today"]}
        rows={data.drivers.map((driver) => [
          driver.name,
          driver.email,
          driver.depot,
          driver.status,
          String(driver.jobsToday),
        ])}
      />
      <Link href="/driver" className="inline-flex text-sm font-semibold text-accent">
        Open driver app →
      </Link>
    </>
  );
}

function DepotsPanel({ data }: { data: AdminOverview }) {
  return (
    <PanelTable
      headers={["Depot", "City", "Shipments today", "Avg hours", "Status"]}
      rows={data.depots.map((depot) => [
        depot.name,
        depot.city,
        depot.shipmentsToday.toLocaleString("en-AU"),
        String(depot.avgDeliveryHours),
        depot.status,
      ])}
    />
  );
}

function QuotesPanel({ data }: { data: AdminOverview }) {
  if (data.quotes.length === 0) {
    return (
      <EmptyState text="No converted quotes/bookings yet. Create one from /quote." />
    );
  }

  return (
    <PanelTable
      headers={["Booking", "Route", "Service", "Price", "Created"]}
      rows={data.quotes.map((quote) => [
        quote.id,
        quote.route,
        quote.service,
        formatAud(quote.priceAud),
        new Date(quote.createdAt).toLocaleString("en-AU"),
      ])}
    />
  );
}

function PaymentsPanel({ data }: { data: AdminOverview }) {
  if (data.payments.length === 0) {
    return <EmptyState text="No payments recorded yet." />;
  }

  return (
    <PanelTable
      headers={["Payment", "Booking", "Tracking", "Amount", "Status"]}
      rows={data.payments.map((payment) => [
        payment.id,
        payment.bookingId,
        payment.trackingNumber,
        formatAud(payment.amountAud),
        payment.status,
      ])}
    />
  );
}

function ClaimsPanel({ data }: { data: AdminOverview }) {
  if (data.claims.length === 0) {
    return <EmptyState text="No claims lodged yet." />;
  }

  return (
    <PanelTable
      headers={["Claim", "Tracking", "Type", "Status", "Created"]}
      rows={data.claims.map((claim) => [
        claim.id,
        claim.trackingNumber,
        claim.type,
        claim.status,
        new Date(claim.createdAt).toLocaleString("en-AU"),
      ])}
    />
  );
}

function ReportsPanel({ data }: { data: AdminOverview }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-secondary/10 bg-white p-5">
        <h2 className="font-semibold">Summary</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Tracked shipments: {data.metrics.shipmentsTracked}</li>
          <li>Bookings created: {data.metrics.bookingsCount}</li>
          <li>Open claims: {data.metrics.openClaims}</li>
          <li>Collected revenue: {formatAud(data.metrics.revenueAud)}</li>
        </ul>
      </div>
      <div className="rounded-3xl border border-secondary/10 bg-white p-5">
        <h2 className="font-semibold">Export</h2>
        <p className="mt-2 text-sm text-muted">
          CSV/PDF export hooks can connect here once reporting storage is live.
        </p>
        <button
          type="button"
          className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          onClick={() => {
            const blob = new Blob(
              [
                JSON.stringify(
                  {
                    metrics: data.metrics,
                    bookings: data.bookings.length,
                    claims: data.claims.length,
                  },
                  null,
                  2,
                ),
              ],
              { type: "application/json" },
            );
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "za-courier-admin-report.json";
            anchor.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download JSON report
        </button>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="rounded-3xl border border-secondary/10 bg-white p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Workspace</h2>
        <p className="mt-1 text-sm text-muted">
          Auth secret and database URL are configured via environment variables.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <SettingRow label="Brand" value="ZA Courier" />
        <SettingRow label="Currency" value="AUD" />
        <SettingRow label="Volumetric divisor" value="4000" />
        <SettingRow label="Session cookie" value="za_courier_session" />
      </div>
      <Link href="/quote" className="inline-flex text-sm font-semibold text-accent">
        Manage pricing via quote engine config →
      </Link>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-secondary/10 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-secondary/20 bg-white p-8 text-sm text-muted">
      {text}
    </div>
  );
}

function PanelTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-secondary/10 bg-white p-5">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.12em] text-muted">
          <tr>
            {headers.map((header) => (
              <th key={header} className="pb-3 pr-4 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="border-t border-secondary/10">
              {row.map((cell, cellIndex) => (
                <td
                  key={`${headers[cellIndex]}-${cellIndex}`}
                  className={cn(
                    "py-3 pr-4",
                    cellIndex === 0 ? "font-medium text-foreground" : "text-muted",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
