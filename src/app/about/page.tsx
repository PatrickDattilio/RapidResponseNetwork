import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  MapPin,
  Users,
  ShieldCheck,
  HandHelping,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          About the Rapid Response Network
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          The Rapid Response Network is a civic-action platform that connects
          communities with organized rapid response groups across the United
          States. Whether you&apos;re looking for support or ready to mobilize,
          this is your starting point.
        </p>
      </div>

      <Separator className="my-8" />

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">What We Do</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Map the Network</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Our interactive map shows verified rapid response groups across
              every state, making it easy to find support near you.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Connect Communities</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We help grassroots organizations connect with people who care about
              housing, labor, immigration, environment, and more.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <ShieldCheck className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Verified Groups</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Every group on our map is reviewed and approved by administrators
              to ensure legitimacy and community safety.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <HandHelping className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Empower Action</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We believe in the power of organized community response. Our
              platform makes it easy to find, join, or start a group.
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          What is &ldquo;Rapid Response&rdquo;?
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Rapid response refers to organized community groups that can quickly
          mobilize to address urgent situations — whether that&apos;s supporting
          neighbors facing eviction, responding to immigration enforcement
          actions, providing disaster relief, advocating for workers&apos;
          rights, or protecting environmental justice. These groups are the
          backbone of community resilience.
        </p>
      </section>

      <Separator className="my-8" />

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium">How do I add my group to the map?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click &ldquo;Add Your Group&rdquo; in the navigation or visit the{" "}
              <Link href="/submit" className="text-primary underline">
                submission page
              </Link>
              . Fill out the form and submit — an administrator will review your
              group and approve it to appear on the map.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              How long does approval take?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We aim to review all submissions within 48 hours. You&apos;ll
              receive an email notification once your group has been approved.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              Is my contact information public?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No. Contact email and phone are only visible to administrators for
              review purposes. Only your group name, location, description, and
              focus areas are shown on the map.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              What types of groups can register?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Any community-based organization focused on rapid response and
              civic action is welcome — from neighborhood coalitions to
              statewide networks. Groups must be non-violent and committed to
              community well-being.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Is this platform free?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Yes, completely. The Rapid Response Network is a free,
              open-source civic tool.
            </p>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      <div className="flex flex-col items-center gap-4 rounded-lg bg-muted p-8 text-center">
        <h2 className="text-xl font-semibold">Ready to get involved?</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Whether you want to find support in your area or register your own
          group, the network is here for you.
        </p>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline" className="gap-1.5">
              <MapPin className="h-4 w-4" />
              Explore the Map
            </Button>
          </Link>
          <Link href="/submit">
            <Button className="gap-1.5">
              Add Your Group
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
