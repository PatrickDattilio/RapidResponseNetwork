import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const groups = await prisma.group.findMany({
    orderBy: { submittedAt: "desc" },
  });

  const headers = [
    "ID", "Name", "City", "State", "Contact Name", "Contact Email",
    "Phone", "Focus Areas", "Description", "Website", "Member Count",
    "Status", "Submitted At", "Approved At",
  ];

  const rows = groups.map((g) => [
    g.id,
    `"${g.name.replace(/"/g, '""')}"`,
    `"${g.city.replace(/"/g, '""')}"`,
    g.state,
    `"${g.contactName.replace(/"/g, '""')}"`,
    g.contactEmail,
    g.phone || "",
    `"${g.focusAreas.join(", ")}"`,
    `"${g.description.replace(/"/g, '""')}"`,
    g.website || "",
    g.memberCount,
    g.status,
    g.submittedAt.toISOString(),
    g.approvedAt?.toISOString() || "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="rapid-response-groups-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
