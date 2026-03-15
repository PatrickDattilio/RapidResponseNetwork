import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "set" : "NOT SET",
      DATABASE_PUBLIC_URL: process.env.DATABASE_PUBLIC_URL ? "set" : "NOT SET",
      RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY ? "set" : "NOT SET",
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? "set" : "NOT SET",
    },
  };

  try {
    const count = await prisma.group.count();
    checks.database = { status: "connected", groupCount: count };
  } catch (err) {
    checks.database = {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }

  return NextResponse.json(checks);
}
