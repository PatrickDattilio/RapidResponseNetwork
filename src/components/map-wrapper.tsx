"use client";

import dynamic from "next/dynamic";

const GroupMap = dynamic(
  () => import("@/components/map").then((m) => m.GroupMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export function MapWrapper() {
  return <GroupMap />;
}
