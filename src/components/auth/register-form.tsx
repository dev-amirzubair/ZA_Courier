"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "BUSINESS">("CUSTOMER");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone || undefined,
          role,
          companyName: role === "BUSINESS" ? companyName : undefined,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }

      await refresh();
      router.push(data.redirectTo || "/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-secondary/10 bg-white p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Account
      </p>
      <h1 className="mt-2 text-3xl font-semibold">Create account</h1>
      <p className="mt-2 text-sm text-muted">
        Register as a customer or business shipper.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Full name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Phone (optional)</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Account type</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["CUSTOMER", "BUSINESS"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRole(option)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-medium",
                  role === option
                    ? "border-accent bg-accent/10"
                    : "border-secondary/10",
                )}
              >
                {option === "CUSTOMER" ? "Customer" : "Business"}
              </button>
            ))}
          </div>
        </fieldset>
        {role === "BUSINESS" && (
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Company name</span>
            <input
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClass}
            />
          </label>
        )}

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "w-full rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary",
            isPending && "opacity-70",
          )}
        >
          {isPending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-muted">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-accent">
          Sign in
        </Link>
      </p>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-secondary/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-accent";
