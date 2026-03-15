import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookieHeader = request.headers.get("cookie") || "";

    try {
      const sessionRes = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
          headers: { cookie: cookieHeader },
        }
      );

      if (!sessionRes.ok) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      const session = await sessionRes.json();

      if (!session?.user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
