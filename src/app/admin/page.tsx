"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Download,
  MapPin,
  Clock,
  Users,
  BarChart3,
  Pencil,
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  city: string;
  state: string;
  contactName: string;
  contactEmail: string;
  focusAreas: string[];
  description: string;
  memberCount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

interface Stats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  byState: { state: string; count: number }[];
}

export default function AdminDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [groupsRes, statsRes] = await Promise.all([
        fetch("/api/groups?all=true"),
        fetch("/api/groups/stats"),
      ]);
      const [groupsData, statsData] = await Promise.all([
        groupsRes.json(),
        statsRes.json(),
      ]);
      setGroups(groupsData);
      setStats(statsData);
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    try {
      await fetch(`/api/groups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch {
      // Error handling
    }
  }

  const filtered =
    filter === "ALL"
      ? groups
      : groups.filter((g) => g.status === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="h-4 w-20 rounded animate-shimmer" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 rounded animate-shimmer" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-border/50">
          <CardContent className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              <p className="text-sm text-muted-foreground">Loading dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Groups",
      value: stats?.total ?? 0,
      icon: BarChart3,
      color: "text-foreground",
      bg: "bg-foreground/5",
    },
    {
      title: "Approved",
      value: stats?.approved ?? 0,
      icon: MapPin,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "States Covered",
      value: stats?.byState.length ?? 0,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage rapid response group submissions
          </p>
        </div>
        <a href="/api/groups/export">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={stat.title} className={`animate-fade-up stagger-${i + 1} card-hover border-border/50`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className={filter === status ? "shadow-sm shadow-primary/20" : ""}
          >
            {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            {status !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({groups.filter((g) => g.status === status).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      <Card className="animate-fade-up border-border/50 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Group</TableHead>
                <TableHead className="hidden sm:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <MapPin className="h-8 w-8 opacity-30" />
                      <p className="text-sm">No groups found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((group) => (
                  <TableRow key={group.id} className="group/row">
                    <TableCell>
                      <div>
                        <div className="font-medium">{group.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                          {group.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {group.city}, {group.state}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">{group.contactName}</div>
                      <div className="text-xs text-muted-foreground">
                        {group.contactEmail}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm">{group.memberCount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          group.status === "APPROVED"
                            ? "default"
                            : group.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          group.status === "APPROVED"
                            ? "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border-0"
                            : group.status === "PENDING"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 border-0"
                            : "bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25 border-0"
                        }
                      >
                        {group.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {group.status === "PENDING" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-500/10"
                              onClick={() => updateStatus(group.id, "APPROVED")}
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-500/10"
                              onClick={() => updateStatus(group.id, "REJECTED")}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Link href={`/admin/groups/${group.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
