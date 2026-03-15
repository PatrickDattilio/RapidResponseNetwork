import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const all = searchParams.get("all");

  if (all === "true") {
    const groups = await prisma.group.findMany({
      orderBy: { submittedAt: "desc" },
    });
    return NextResponse.json(groups);
  }

  const groups = await prisma.group.findMany({
    where: { status: status === "PENDING" ? "PENDING" : "APPROVED" },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(groups);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, city, state, contactName, contactEmail, phone, focusAreas, description, website, memberCount } = body;

    if (!name || !city || !state || !contactName || !contactEmail || !description || !memberCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Geocode using Nominatim
    let lat = 39.8283;
    let lng = -98.5795;

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=US&format=json&limit=1`,
        { headers: { "User-Agent": "RapidResponseNetwork/1.0" } }
      );
      const geoData = await geoRes.json();
      if (geoData.length > 0) {
        lat = parseFloat(geoData[0].lat);
        lng = parseFloat(geoData[0].lon);
      }
    } catch {
      // Fall back to center of US if geocoding fails
    }

    const group = await prisma.group.create({
      data: {
        name,
        city,
        state,
        lat,
        lng,
        contactName,
        contactEmail,
        phone: phone || null,
        focusAreas: focusAreas || [],
        description,
        website: website || null,
        memberCount,
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}
