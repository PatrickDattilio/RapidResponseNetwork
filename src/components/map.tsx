"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

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
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading groups...</p>
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
            <Popup minWidth={260} maxWidth={320}>
              <div className="space-y-2 p-1">
                <h3 className="text-base font-semibold leading-tight">{group.name}</h3>
                <p className="text-xs text-gray-500">
                  {group.city}, {group.state}
                </p>
                <p className="text-sm leading-relaxed">{group.description}</p>
                <div className="flex flex-wrap gap-1">
                  {group.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                    >
                      {area}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Members:</span> {group.memberCount}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Contact:</span> {group.contactName}
                </div>
                {group.website && (
                  <a
                    href={group.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
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
        <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-background/90 px-3 py-2 text-sm font-medium shadow-lg backdrop-blur">
          {groups.length} active {groups.length === 1 ? "group" : "groups"}
        </div>
      )}
    </div>
  );
}
