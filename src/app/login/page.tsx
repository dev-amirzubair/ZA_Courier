import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to ZA Courier.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
