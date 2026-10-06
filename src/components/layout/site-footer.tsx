import Link from "next/link";

const columns = [
  {
    title: "Send",
    links: [
      { href: "/quote", label: "Get a quote" },
      { href: "/booking", label: "Book a shipment" },
      { href: "/services/domestic", label: "Domestic delivery" },
      { href: "/services/express", label: "Express delivery" },
    ],
  },
  {
    title: "Receive",
    links: [
      { href: "/track", label: "Track parcel" },
      { href: "/#delivery-options", label: "Delivery options" },
      { href: "/redelivery", label: "Redelivery" },
    ],
  },
  {
    title: "Business",
    links: [
      { href: "/business", label: "Business shipping" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/admin", label: "Admin preview" },
      { href: "/driver", label: "Driver preview" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/services/ecommerce", label: "Ecommerce" },
      { href: "/services", label: "All services" },
      { href: "/claims", label: "Claims" },
      { href: "/quote", label: "Calculate delivery" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources", label: "Help centre" },
      { href: "/resources", label: "Shipping conditions" },
      { href: "/resources", label: "Dangerous goods" },
      { href: "/contact", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About ZA Courier" },
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "Privacy" },
      { href: "/about", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-bold text-primary">
                ZA
              </span>
              <span className="text-xl font-semibold tracking-tight">
                ZA Courier
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              Every parcel has a destination. Every movement has a story. We make
              both visible across Australia.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-primary hover:bg-accent-2"
            >
              Get a quote
            </Link>
            <Link
              href="/track"
              className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
            >
              Track parcel
            </Link>
          </div>
        </div>

        <div className="grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-2">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ZA Courier. Built for Australian shipping.</p>
          <p>Support · Privacy · Terms · Shipping conditions</p>
        </div>
      </div>
    </footer>
  );
}
