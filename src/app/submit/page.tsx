"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { US_STATES, FOCUS_AREAS, MEMBER_COUNT_OPTIONS } from "@/lib/constants";
import { CheckCircle, Send, FileText, User } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  const getRecaptchaToken = useCallback(async (): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY) return null;
    try {
      return await new Promise((resolve) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(RECAPTCHA_SITE_KEY, { action: "submit_group" })
            .then(resolve);
        });
      });
    } catch {
      return null;
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setLoading(true);
    setError("");

    const recaptchaToken = await getRecaptchaToken();

    const form = new FormData(formEl);

    const data = {
      name: form.get("name") as string,
      city: form.get("city") as string,
      state: form.get("state") as string,
      contactName: form.get("contactName") as string,
      contactEmail: form.get("contactEmail") as string,
      phone: form.get("phone") as string,
      focusAreas,
      description: form.get("description") as string,
      website: form.get("website") as string,
      memberCount: form.get("memberCount") as string,
      recaptchaToken,
    };

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function toggleFocus(area: string) {
    setFocusAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center justify-center px-4">
        <Card className="animate-fade-up w-full text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Submission Received!</CardTitle>
            <CardDescription className="text-base">
              Thank you for registering your group. An administrator will review
              your submission and it will appear on the map once approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full gap-2 shadow-lg shadow-primary/20">
              Back to Map
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="animate-fade-up mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Register Your <span className="text-gradient">Group</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Submit your rapid response group to be featured on our network map.
          All submissions are reviewed before appearing publicly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="animate-fade-up stagger-1 card-hover border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <CardTitle>Group Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g., Portland Housing Coalition"
                className="transition-shadow focus:shadow-md focus:shadow-primary/5"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  placeholder="e.g., Portland"
                  className="transition-shadow focus:shadow-md focus:shadow-primary/5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <select
                  id="state"
                  name="state"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:shadow-md focus:shadow-primary/5"
                >
                  <option value="">Select a state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Group Description * (300 chars max)</Label>
              <Textarea
                id="description"
                name="description"
                required
                maxLength={300}
                rows={3}
                placeholder="Briefly describe your group's mission and activities..."
                className="transition-shadow focus:shadow-md focus:shadow-primary/5"
              />
            </div>

            <div className="space-y-2">
              <Label>Focus Areas</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {FOCUS_AREAS.map((area) => (
                  <label
                    key={area}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
                      focusAreas.includes(area)
                        ? "border-primary/50 bg-primary/5 text-foreground shadow-sm"
                        : "hover:bg-accent hover:border-border"
                    }`}
                  >
                    <Checkbox
                      checked={focusAreas.includes(area)}
                      onCheckedChange={() => toggleFocus(area)}
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberCount">How many members? *</Label>
              <select
                id="memberCount"
                name="memberCount"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:shadow-md focus:shadow-primary/5"
              >
                <option value="">Select range</option>
                {MEMBER_COUNT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website / Social Link</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://"
                className="transition-shadow focus:shadow-md focus:shadow-primary/5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-up stagger-2 card-hover border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription className="mt-1">
                  Contact details are used for admin review only and are not shown
                  publicly on the map.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                name="contactName"
                required
                placeholder="Your full name"
                className="transition-shadow focus:shadow-md focus:shadow-primary/5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                required
                placeholder="you@example.com"
                className="transition-shadow focus:shadow-md focus:shadow-primary/5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className="transition-shadow focus:shadow-md focus:shadow-primary/5"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="animate-fade-up rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="animate-fade-up stagger-3 w-full gap-2 shadow-lg shadow-primary/20"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit for Review
            </>
          )}
        </Button>

        {RECAPTCHA_SITE_KEY && (
          <p className="text-xs text-center text-muted-foreground">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy" className="underline hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="https://policies.google.com/terms" className="underline hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{" "}
            apply.
          </p>
        )}
      </form>

      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      )}
    </div>
  );
}
