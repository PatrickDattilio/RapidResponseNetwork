"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    authClient.getSession().then(({ data }) => {
      if (!data?.user) {
        window.location.href = "/admin/login";
      } else {
        setAuthenticated(true);
        setChecking(false);
      }
    }).catch(() => {
      window.location.href = "/admin/login";
    });
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checking || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  async function handleLogout() {
    await authClient.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r bg-muted/30 p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
              pathname === "/admin"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </nav>

        <div className="border-t pt-4">
          <Link
            href="/"
            className="mb-2 block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
          >
            View Public Site
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold">Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              Public Site
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
