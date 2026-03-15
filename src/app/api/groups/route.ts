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

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) return true; // Skip verification if not configured

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });

    const data = await res.json();
    return data.success && data.score >= 0.5;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, city, state, contactName, contactEmail, phone, focusAreas, description, website, memberCount, recaptchaToken } = body;

    if (!name || !city || !state || !contactName || !contactEmail || !description || !memberCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify reCAPTCHA if configured
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!recaptchaToken) {
        return NextResponse.json({ error: "reCAPTCHA verification required" }, { status: 400 });
      }
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 403 });
      }
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
  } catch (err) {
    console.error("POST /api/groups error:", err);
    const message = err instanceof Error ? err.message : "Failed to create group";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
