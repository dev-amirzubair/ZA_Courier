import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { findShipment } from "@/lib/store/memory-db";
import { saveClaim } from "@/lib/store/memory-db";

const schema = z.object({
  trackingNumber: z.string().min(5),
  type: z.string().min(2),
  description: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to lodge a claim." },
        { status: 401 },
      );
    }

    const body = schema.parse(await request.json());
    const tracking = body.trackingNumber.trim().toUpperCase();
    const shipment = findShipment(tracking);

    if (!shipment) {
      return NextResponse.json(
        { error: "Tracking number not found." },
        { status: 404 },
      );
    }

    const claim = {
      id: `CL-${Date.now().toString().slice(-8)}`,
      userId: session.sub,
      trackingNumber: tracking,
      type: body.type,
      description: body.description,
      status: "Under review" as const,
      createdAt: new Date().toISOString(),
    };

    saveClaim(claim);
    return NextResponse.json({ claim });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit claim." },
      { status: 400 },
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listClaimsForUser, listAllClaims } = await import(
    "@/lib/store/memory-db"
  );

  const claims =
    session.role === "ADMIN"
      ? listAllClaims()
      : listClaimsForUser(session.sub);

  return NextResponse.json({ claims });
}
