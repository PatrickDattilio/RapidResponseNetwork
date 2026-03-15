import { NextResponse } from "next/server";
import pg from "pg";

export async function GET() {
  const connectionString =
    process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "set" : "NOT SET",
      DATABASE_PUBLIC_URL: process.env.DATABASE_PUBLIC_URL ? "set" : "NOT SET",
      RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY ? "set" : "NOT SET",
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? "set" : "NOT SET",
      DB_URL_PREFIX: connectionString ? connectionString.substring(0, 30) + "..." : "NOT SET",
    },
  };

  // Test raw pg connection first
  try {
    const pool = new pg.Pool({ connectionString, max: 1 });
    const result = await pool.query("SELECT COUNT(*) FROM \"Group\"");
    checks.rawPg = {
      status: "connected",
      groupCount: result.rows[0].count,
    };
    await pool.end();
  } catch (err) {
    checks.rawPg = {
      status: "error",
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack?.split("\n").slice(0, 3) : undefined,
    };
  }

  // Test Prisma connection
  try {
    const { prisma } = await import("@/lib/db");
    const count = await prisma.group.count();
    checks.prisma = { status: "connected", groupCount: count };
  } catch (err) {
    checks.prisma = {
      status: "error",
      name: err instanceof Error ? err.constructor.name : "Unknown",
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack?.split("\n").slice(0, 5) : undefined,
    };
  }

  return NextResponse.json(checks);
}
