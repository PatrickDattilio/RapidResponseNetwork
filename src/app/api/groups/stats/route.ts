import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [total, approved, pending, rejected] = await Promise.all([
    prisma.group.count(),
    prisma.group.count({ where: { status: "APPROVED" } }),
    prisma.group.count({ where: { status: "PENDING" } }),
    prisma.group.count({ where: { status: "REJECTED" } }),
  ]);

  const byState = await prisma.group.groupBy({
    by: ["state"],
    where: { status: "APPROVED" },
    _count: true,
    orderBy: { _count: { state: "desc" } },
  });

  return NextResponse.json({
    total,
    approved,
    pending,
    rejected,
    byState: byState.map((s) => ({ state: s.state, count: s._count })),
  });
}
