"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sentId, setSentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to send message.");
        return;
      }
      setSentId(data.id);
      setName("");
      setEmail("");
      setMessage("");
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-4 rounded-3xl border border-secondary/10 bg-white p-6"
    >
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-secondary/15 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-secondary/15 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Message</span>
        <textarea
          required
          minLength={10}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-secondary/15 px-3 py-2.5"
        />
      </label>
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {sentId && (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-secondary">
          Message sent ({sentId}). Our support team will reply shortly.
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-primary",
          isPending && "opacity-70",
        )}
      >
        {isPending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
