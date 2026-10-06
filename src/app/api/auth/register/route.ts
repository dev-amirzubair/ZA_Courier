import { NextResponse } from "next/server";
import { z } from "zod";
import { registerUser } from "@/lib/auth/users";
import {
  createSessionToken,
  roleHomePath,
  setSessionCookie,
} from "@/lib/auth/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80),
  role: z.enum(["CUSTOMER", "BUSINESS"]).optional(),
  phone: z.string().max(30).optional(),
  companyName: z.string().max(120).optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await registerUser(body);
    const token = await createSessionToken(user);
    await setSessionCookie(token);

    return NextResponse.json({
      user,
      redirectTo: roleHomePath(user.role),
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "EMAIL_TAKEN"
        ? "An account with that email already exists."
        : error instanceof Error && error.message === "WEAK_PASSWORD"
          ? "Password must be at least 8 characters."
          : "Unable to create your account.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
