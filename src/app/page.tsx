import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, ArrowDown, Shield, Users } from "lucide-react";
import { MapWrapper } from "@/components/map-wrapper";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.2_264_/_0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="animate-fade-up mb-4 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Civic Action Platform
            </div>
            <h1 className="animate-fade-up stagger-1 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Find Your{" "}
              <span className="text-gradient">Community</span>
            </h1>
            <p className="animate-fade-up stagger-2 mt-4 text-lg text-muted-foreground sm:text-xl">
              Discover and connect with rapid response groups in your area.
              Together, we build resilient communities ready to act.
            </p>
            <div className="animate-fade-up stagger-3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="#map">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                  <MapPin className="h-4 w-4" />
                  Explore the Map
                </Button>
              </Link>
              <Link href="/submit">
                <Button size="lg" variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your Group
                </Button>
              </Link>
            </div>
          </div>

          <div className="animate-fade-up stagger-4 mx-auto mt-12 grid max-w-lg grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary sm:text-3xl">50+</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">States Covered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary sm:text-3xl">
                <Users className="mx-auto h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">Growing Network</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary sm:text-3xl">10+</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">Focus Areas</div>
            </div>
          </div>

          <div className="animate-fade-up stagger-5 mt-8 flex justify-center">
            <a href="#map" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowDown className="h-5 w-5 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="relative">
        <div className="flex items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              Find Rapid Response Groups Near You
            </h2>
          </div>
          <Link href="/submit">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Your Group</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Link>
        </div>
        <div className="h-[calc(100vh-12rem)] min-h-[500px]">
          <MapWrapper />
        </div>
      </section>
    </div>
  );
}
