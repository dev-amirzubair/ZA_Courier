"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardSeries } from "@/data/home";
import { useAuth } from "@/components/auth/auth-provider";
import { formatAud } from "@/lib/utils";

interface BookingRow {
  bookingId: string;
  trackingNumber: string;
  createdAt: string;
  draft: {
    destinationSuburb: string;
    destinationState: string;
    serviceName: string;
    priceAud: number;
  };
  paymentStatus: string;
}

export function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/bookings", { cache: "no-store" });
        if (response.ok) {
          const data = (await response.json()) as { bookings: BookingRow[] };
          setBookings(data.bookings);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-secondary/10 bg-white p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {user?.role === "BUSINESS" ? "Business" : "Customer"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          Welcome{user ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Your bookings, tracking shortcuts and shipping tools.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/quote"
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-primary"
          >
            Create shipment
          </Link>
          <Link
            href="/track"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
          >
            Track
          </Link>
          <Link
            href="/redelivery"
            className="rounded-xl bg-background px-4 py-2.5 text-sm font-semibold text-secondary"
          >
            Redelivery
          </Link>
          <Link
            href="/claims"
            className="rounded-xl bg-background px-4 py-2.5 text-sm font-semibold text-secondary"
          >
            Claims
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Your bookings", String(bookings.length)],
          ["Paid", String(bookings.filter((b) => b.paymentStatus === "succeeded").length)],
          ["Role", user?.role ?? "—"],
          ["Email", user?.email ?? "—"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-secondary/10 bg-white p-4"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              {label}
            </p>
            <p className="mt-2 truncate text-lg font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-secondary/10 bg-white p-5">
          <h2 className="font-semibold">Your shipments</h2>
          {loading ? (
            <p className="mt-4 text-sm text-muted">Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Your shipping history is waiting.{" "}
              <Link href="/quote" className="font-semibold text-accent">
                Get a quote
              </Link>
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th className="pb-2 pr-3">Tracking</th>
                    <th className="pb-2 pr-3">Destination</th>
                    <th className="pb-2 pr-3">Service</th>
                    <th className="pb-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((row) => (
                    <tr
                      key={row.bookingId}
                      className="border-t border-secondary/10"
                    >
                      <td className="py-3 pr-3 font-medium">
                        <Link
                          href={`/track?q=${row.trackingNumber}`}
                          className="text-accent"
                        >
                          {row.trackingNumber}
                        </Link>
                      </td>
                      <td className="py-3 pr-3 text-muted">
                        {row.draft.destinationSuburb}{" "}
                        {row.draft.destinationState}
                      </td>
                      <td className="py-3 pr-3">{row.draft.serviceName}</td>
                      <td className="py-3">
                        {formatAud(row.draft.priceAud)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-secondary/10 bg-white p-5">
          <h2 className="font-semibold">Network activity</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardSeries}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="shipments"
                  stroke="#19C3B1"
                  fill="#19C3B133"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
