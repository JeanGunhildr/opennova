// app/api/cron/process-phases/route.ts
// Next.js Route Handler for cron-triggered competition phase automation.
// Protected by CRON_SECRET authorization token.

import { NextResponse } from "next/server";
import { processChallengePhases } from "@/lib/services/challenge-phase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    
    // If CRON_SECRET is configured, enforce authorization check
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      const secretHeader = request.headers.get("x-cron-secret");
      const url = new URL(request.url);
      const querySecret = url.searchParams.get("secret");

      const token = authHeader?.replace("Bearer ", "") || secretHeader || querySecret;

      if (token !== cronSecret) {
        return NextResponse.json(
          { error: "Unauthorized: invalid cron secret token." },
          { status: 401 }
        );
      }
    }

    const summary = await processChallengePhases();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
    });
  } catch (err: any) {
    console.error("Cron route /api/cron/process-phases error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET handler for manual testing or status check
export async function GET(request: Request) {
  return POST(request);
}
