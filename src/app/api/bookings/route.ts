import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listBookingsForUser, listAllBookings } from "@/lib/store/memory-db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role === "ADMIN") {
    return NextResponse.json({ bookings: listAllBookings() });
  }

  return NextResponse.json({
    bookings: listBookingsForUser(session.sub),
  });
}
