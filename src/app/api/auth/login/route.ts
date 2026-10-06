import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser } from "@/lib/auth/users";
import {
  createSessionToken,
  roleHomePath,
  setSessionCookie,
} from "@/lib/auth/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await authenticateUser(body.email, body.password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await createSessionToken(user);
    await setSessionCookie(token);

    return NextResponse.json({
      user,
      redirectTo: roleHomePath(user.role),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to sign in. Check your details and try again." },
      { status: 400 },
    );
  }
}
