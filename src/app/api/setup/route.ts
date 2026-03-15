import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, setupSecret } = body;

    if (setupSecret !== process.env.BETTER_AUTH_SECRET) {
      return NextResponse.json({ error: "Invalid setup secret" }, { status: 403 });
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    const ctx = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    // Set role to admin
    await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });

    return NextResponse.json({ success: true, message: `Admin user ${email} created` });
  } catch (err) {
    console.error("Setup error:", err);
    const message = err instanceof Error ? err.message : "Setup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
