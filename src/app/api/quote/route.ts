import { NextResponse } from "next/server";
import { quoteService } from "@/lib/api/quote-service";
import type { QuoteRequest } from "@/types/pricing";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteRequest;
    const result = await quoteService.getQuote(body);
    const status = result.errors.length > 0 ? 400 : 200;
    return NextResponse.json(result, { status });
  } catch {
    return NextResponse.json(
      {
        requestId: `quote_error_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        weight: {
          packages: [],
          totalActualWeightKg: 0,
          totalVolumetricWeightKg: 0,
          totalChargeableWeightKg: 0,
          totalItems: 0,
          volumetricDivisor: 4000,
        },
        offers: [],
        warnings: [],
        errors: ["Unable to calculate quote right now."],
      },
      { status: 500 },
    );
  }
}
