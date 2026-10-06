import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

const copy: Record<string, { title: string; body: string }> = {
  domestic: {
    title: "Domestic Delivery",
    body: "Door-to-door parcel movement across Australia with full tracking.",
  },
  express: {
    title: "Express Delivery",
    body: "Priority network capacity for next-business-day metro and capital corridors.",
  },
  ecommerce: {
    title: "Ecommerce Delivery",
    body: "Order-to-door workflows, returns and reporting for growing brands.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: copy[slug]?.title ?? "Service" };
}

export function generateStaticParams() {
  return [{ slug: "domestic" }, { slug: "express" }, { slug: "ecommerce" }];
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = copy[slug] ?? {
    title: "Service",
    body: "Explore ZA Courier shipping options.",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Service
      </p>
      <h1 className="mt-2 text-4xl font-semibold">{service.title}</h1>
      <p className="mt-4 text-muted">{service.body}</p>
      <Link
        href="/quote"
        className="mt-8 inline-flex rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary"
      >
        Calculate delivery
      </Link>
    </div>
  );
}
