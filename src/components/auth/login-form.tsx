"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_ACCOUNTS } from "@/data/demo-accounts";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("customer@zacourier.com.au");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const nextPath = useMemo(
    () => searchParams.get("next") ?? "",
    [searchParams],
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Sign in failed.");
        return;
      }

      await refresh();
      router.push(nextPath || data.redirectTo || "/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-3xl border border-secondary/10 bg-white p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Access your shipments, booking history and role workspace.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>

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
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted">
          New here?{" "}
          <Link href="/register" className="font-semibold text-accent">
            Create an account
          </Link>
        </p>
      </div>

      <div className="rounded-3xl border border-secondary/10 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Demo accounts
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {DEMO_ACCOUNTS.map((account) => (
            <li key={account.email}>
              <button
                type="button"
                className="w-full rounded-xl bg-background px-3 py-2 text-left hover:bg-accent/10"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
              >
                <span className="font-medium text-secondary">{account.role}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {account.email} · {account.password}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-secondary/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-accent";
