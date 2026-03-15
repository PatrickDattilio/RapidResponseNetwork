import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import { MapWrapper } from "@/components/map-wrapper";

export default function HomePage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">
            Find Rapid Response Groups Near You
          </h1>
        </div>
        <Link href="/submit">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Your Group
          </Button>
        </Link>
      </div>
      <div className="flex-1">
        <MapWrapper />
      </div>
    </div>
  );
}
