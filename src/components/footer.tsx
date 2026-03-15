import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                RR
              </div>
              <span className="font-semibold tracking-tight">
                Rapid Response Network
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting communities with organized rapid response groups across
              the United States.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Map
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-foreground transition-colors">
                  Add Your Group
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About &amp; FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Get Involved</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/submit" className="hover:text-foreground transition-colors">
                  Register a Group
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground transition-colors inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Find Groups Near You
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free, open-source civic platform. Built to empower communities and
              enable collective action.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>&copy; {new Date().getFullYear()} Rapid Response Network. All rights reserved.</p>
          <p>Open source &middot; Built for communities</p>
        </div>
      </div>
    </footer>
  );
}
