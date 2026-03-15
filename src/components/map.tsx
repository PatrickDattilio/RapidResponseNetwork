"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ExternalLink, MapPin, Users } from "lucide-react";

import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Group {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  focusAreas: string[];
  description: string;
  website: string | null;
  memberCount: string;
  contactName: string;
}

export function GroupMap() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/groups?status=APPROVED")
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const tileUrl =
    process.env.NEXT_PUBLIC_MAP_TILE ||
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            <p className="text-sm font-medium text-muted-foreground">Loading groups...</p>
          </div>
        </div>
      )}
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrl}
        />
        {groups.map((group) => (
          <Marker key={group.id} position={[group.lat, group.lng]} icon={markerIcon}>
            <Popup minWidth={280} maxWidth={340}>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="text-base font-bold leading-tight text-foreground">
                    {group.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {group.city}, {group.state}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
                {group.focusAreas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {group.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {group.memberCount} members
                  </span>
                </div>
                {group.website && (
                  <a
                    href={group.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Visit website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {!loading && (
        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border bg-background/90 px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur-md">
          <span className="text-primary font-bold">{groups.length}</span>{" "}
          <span className="text-muted-foreground">active {groups.length === 1 ? "group" : "groups"}</span>
        </div>
      )}
    </div>
  );
}
