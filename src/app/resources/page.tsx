import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <h1 className="text-4xl font-semibold">Resources</h1>
      <ul className="mt-6 space-y-3 text-sm">
        {[
          ["FAQ", "/contact"],
          ["Shipping conditions", "/about"],
          ["Dangerous goods", "/about"],
          ["Privacy", "/about"],
          ["Terms", "/about"],
        ].map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="font-medium text-accent hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
