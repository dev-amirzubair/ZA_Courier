import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Register for ZA Courier shipping.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <RegisterForm />
    </div>
  );
}
