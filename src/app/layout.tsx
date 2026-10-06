import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/auth-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zacourier.example"),
  title: {
    default: "ZA Courier — Move anything. Know everything.",
    template: "%s · ZA Courier",
  },
  description:
    "Premium Australian courier platform with dynamic route-based quoting, tracking and business shipping.",
  openGraph: {
    title: "ZA Courier — Move anything. Know everything.",
    description:
      "Fast, trackable parcel delivery across Australia for people and businesses.",
    siteName: "ZA Courier",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZA Courier",
    description: "Move anything. Know everything.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className="min-h-screen">
        <AuthProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
