"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

const primaryLinks = [
  { href: "/send", label: "Send" },
  { href: "/track", label: "Receive" },
  { href: "/business", label: "Business" },
  { href: "/services", label: "Services" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

function homeForRole(role: UserRole) {
  if (role === "ADMIN") return "/admin";
  if (role === "DRIVER") return "/driver";
  return "/dashboard";
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const solid = !isHome || scrolled;

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const accountHref = user ? homeForRole(user.role) : "/login";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-secondary/10 bg-white/90 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[4.25rem] md:px-6">
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <span
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-colors",
              solid
                ? "bg-primary text-accent"
                : "bg-white/10 text-accent-2 ring-1 ring-white/15",
            )}
          >
            ZA
          </span>
          <span
            className={cn(
              "text-lg font-semibold tracking-tight transition-colors",
              solid ? "text-foreground" : "text-white",
            )}
          >
            ZA Courier
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                solid
                  ? "text-secondary hover:text-accent"
                  : "text-white/90 hover:text-accent-2",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/track"
            className={cn(
              "text-sm font-medium transition-colors",
              solid
                ? "text-secondary hover:text-accent"
                : "text-white/90 hover:text-accent-2",
            )}
          >
            Track Parcel
          </Link>
          <Link
            href="/quote"
            className="rounded-xl bg-accent px-3.5 py-2 text-sm font-semibold text-[#0B1220] transition hover:bg-accent-2"
          >
            Get a Quote
          </Link>
          {user ? (
            <>
              <Link
                href={accountHref}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-sm font-semibold transition",
                  solid
                    ? "bg-primary text-white hover:bg-secondary"
                    : "bg-white text-[#0B1220] hover:bg-accent-2",
                )}
              >
                {user.name.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className={cn(
                  "text-sm font-medium transition-colors",
                  solid
                    ? "text-secondary hover:text-accent"
                    : "text-white/90 hover:text-accent-2",
                )}
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-semibold transition",
                solid
                  ? "bg-primary text-white hover:bg-secondary"
                  : "bg-white text-[#0B1220] hover:bg-accent-2",
                loading && "opacity-70",
              )}
            >
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className={cn(
            "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl lg:hidden",
            solid ? "bg-primary/5 text-primary" : "bg-white/10 text-white",
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 top-16 z-40 bg-dark/95 px-4 py-6 lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-white hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 grid gap-2">
                <Link
                  href="/quote"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-accent px-4 py-3 text-center text-sm font-semibold text-primary"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/track"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Track Parcel
                </Link>
                {user ? (
                  <>
                    <Link
                      href={accountHref}
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      My account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        void logout();
                      }}
                      className="rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
