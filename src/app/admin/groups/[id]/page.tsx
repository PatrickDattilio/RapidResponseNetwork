"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { US_STATES, FOCUS_AREAS, MEMBER_COUNT_OPTIONS } from "@/lib/constants";
import { ArrowLeft, Save, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Group {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  contactName: string;
  contactEmail: string;
  phone: string | null;
  focusAreas: string[];
  description: string;
  website: string | null;
  memberCount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  approvedAt: string | null;
}

export default function AdminEditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`/api/groups/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!group) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          city: form.get("city"),
          state: form.get("state"),
          contactName: form.get("contactName"),
          contactEmail: form.get("contactEmail"),
          phone: form.get("phone") || null,
          focusAreas: group.focusAreas,
          description: form.get("description"),
          website: form.get("website") || null,
          memberCount: form.get("memberCount"),
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const updated = await res.json();
      setGroup(updated);
      setSuccess("Changes saved successfully");
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(status: "APPROVED" | "REJECTED") {
    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setGroup(updated);
      setSuccess(`Group ${status.toLowerCase()}`);
    } catch {
      setError("Failed to update status");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to permanently delete this group?")) return;

    try {
      await fetch(`/api/groups/${id}`, { method: "DELETE" });
      router.push("/admin");
    } catch {
      setError("Failed to delete group");
    }
  }

  function toggleFocus(area: string) {
    if (!group) return;
    setGroup({
      ...group,
      focusAreas: group.focusAreas.includes(area)
        ? group.focusAreas.filter((a) => a !== area)
        : [...group.focusAreas, area],
    });
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Group not found</p>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin")}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              group.status === "APPROVED"
                ? "default"
                : group.status === "PENDING"
                ? "secondary"
                : "destructive"
            }
          >
            {group.status}
          </Badge>
          {group.status === "PENDING" && (
            <>
              <Button
                size="sm"
                className="gap-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusChange("APPROVED")}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="gap-1"
                onClick={() => handleStatusChange("REJECTED")}
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </Button>
            </>
          )}
          {group.status === "REJECTED" && (
            <Button
              size="sm"
              className="gap-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleStatusChange("APPROVED")}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
            <CardDescription>
              Submitted {new Date(group.submittedAt).toLocaleDateString()}
              {group.approvedAt &&
                ` · Approved ${new Date(group.approvedAt).toLocaleDateString()}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input id="name" name="name" defaultValue={group.name} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" defaultValue={group.city} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  name="state"
                  defaultValue={group.state}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={group.description}
                maxLength={300}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Focus Areas</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {FOCUS_AREAS.map((area) => (
                  <label
                    key={area}
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={group.focusAreas.includes(area)}
                      onCheckedChange={() => toggleFocus(area)}
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="memberCount">Members</Label>
                <select
                  id="memberCount"
                  name="memberCount"
                  defaultValue={group.memberCount}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {MEMBER_COUNT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  defaultValue={group.website || ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                name="contactName"
                defaultValue={group.contactName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={group.contactEmail}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={group.phone || ""}
              />
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground">
          Coordinates: {group.lat.toFixed(4)}, {group.lng.toFixed(4)}
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-green-500/50 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete Group
          </Button>
          <Button type="submit" className="gap-1.5" disabled={saving}>
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
