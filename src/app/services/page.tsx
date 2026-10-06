import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "ZA Courier domestic, express, interstate, ecommerce and returns.",
};

const services = [
  {
    title: "Domestic Delivery",
    href: "/services/domestic",
    copy: "Reliable door-to-door across Australian metro and regional networks.",
  },
  {
    title: "Express Delivery",
    href: "/services/express",
    copy: "Priority handling when timing is critical.",
  },
  {
    title: "Ecommerce Delivery",
    href: "/services/ecommerce",
    copy: "High-volume merchant flows with tracking your customers can trust.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Services
      </p>
      <h1 className="mt-2 text-4xl font-semibold">Shipping built around certainty</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Choose a service level, then calculate a live quote with chargeable weight
        and route-based pricing.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="rounded-3xl border border-secondary/10 bg-white p-6 transition hover:border-accent/40"
          >
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm text-muted">{service.copy}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-accent">
              Learn more →
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/quote"
        className="mt-8 inline-flex rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary"
      >
        Get a Quote
      </Link>
    </div>
  );
}
