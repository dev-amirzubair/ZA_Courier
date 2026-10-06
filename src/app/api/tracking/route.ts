import { NextResponse } from "next/server";
import { findShipment, listShipments } from "@/lib/store/memory-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const numbers = q
    .split(/[\n,]+/)
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);

  if (numbers.length === 0) {
    return NextResponse.json({ found: [], missing: [] });
  }

  const all = listShipments();
  const found = [];
  const missing: string[] = [];

  for (const key of numbers) {
    const match =
      all.find((item) => item.trackingNumber === key) ?? findShipment(key);
    if (match) {
      found.push(match);
    } else {
      missing.push(key);
    }
  }

  return NextResponse.json({ found, missing });
}
