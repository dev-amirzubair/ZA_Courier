import type { Metadata } from "next";
import { ContactForm } from "@/components/shipping/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ZA Courier support.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <h1 className="text-4xl font-semibold">Contact</h1>
      <p className="mt-3 text-muted">
        Support hours: Mon–Fri 8:00–18:00 AEST.
      </p>
      <ContactForm />
    </div>
  );
}
