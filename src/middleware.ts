import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE } from "@/types/auth";
import type { UserRole } from "@/types/auth";

const protectedRules: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: "/dashboard", roles: ["CUSTOMER", "BUSINESS", "ADMIN"] },
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/driver", roles: ["DRIVER", "ADMIN"] },
];

function getSecret() {
  const secret =
    process.env.AUTH_SECRET ?? "za-courier-dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rule = protectedRules.find((item) => pathname.startsWith(item.prefix));
  if (!rule) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = (payload.role as UserRole) ?? "CUSTOMER";
    if (!rule.roles.includes(role)) {
      const home =
        role === "DRIVER"
          ? "/driver"
          : role === "ADMIN"
            ? "/admin"
            : "/dashboard";
      return NextResponse.redirect(new URL(home, request.url));
    }
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/driver/:path*"],
};
