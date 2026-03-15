import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const group = await prisma.group.findUnique({ where: { id } });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status, ...updates } = body;

    const data: Record<string, unknown> = { ...updates };

    if (status === "APPROVED") {
      data.status = "APPROVED";
      data.approvedAt = new Date();
    } else if (status === "REJECTED") {
      data.status = "REJECTED";
    } else if (status) {
      data.status = status;
    }

    // Re-geocode if city or state changed
    if (updates.city || updates.state) {
      try {
        const existing = await prisma.group.findUnique({ where: { id } });
        const city = updates.city || existing?.city;
        const state = updates.state || existing?.state;

        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=US&format=json&limit=1`,
          { headers: { "User-Agent": "RapidResponseNetwork/1.0" } }
        );
        const geoData = await geoRes.json();
        if (geoData.length > 0) {
          data.lat = parseFloat(geoData[0].lat);
          data.lng = parseFloat(geoData[0].lon);
        }
      } catch {
        // Keep existing coordinates
      }
    }

    const group = await prisma.group.update({
      where: { id },
      data,
    });

    return NextResponse.json(group);
  } catch (err) {
    console.error("PATCH /api/groups/[id] error:", err);
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.group.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/groups/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 });
  }
}
