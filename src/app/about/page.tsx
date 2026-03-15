import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Users,
  ShieldCheck,
  HandHelping,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Map the Network",
    description:
      "Our interactive map shows verified rapid response groups across every state, making it easy to find support near you.",
  },
  {
    icon: Users,
    title: "Connect Communities",
    description:
      "We help grassroots organizations connect with people who care about housing, labor, immigration, environment, and more.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Groups",
    description:
      "Every group on our map is reviewed and approved by administrators to ensure legitimacy and community safety.",
  },
  {
    icon: HandHelping,
    title: "Empower Action",
    description:
      "We believe in the power of organized community response. Our platform makes it easy to find, join, or start a group.",
  },
];

const faqs = [
  {
    q: "How do I add my group to the map?",
    a: 'Click "Add Your Group" in the navigation or visit the submission page. Fill out the form and submit — an administrator will review your group and approve it to appear on the map.',
  },
  {
    q: "How long does approval take?",
    a: "We aim to review all submissions within 48 hours. You'll receive an email notification once your group has been approved.",
  },
  {
    q: "Is my contact information public?",
    a: "No. Contact email and phone are only visible to administrators for review purposes. Only your group name, location, description, and focus areas are shown on the map.",
  },
  {
    q: "What types of groups can register?",
    a: "Any community-based organization focused on rapid response and civic action is welcome — from neighborhood coalitions to statewide networks. Groups must be non-violent and committed to community well-being.",
  },
  {
    q: "Is this platform free?",
    a: "Yes, completely. The Rapid Response Network is a free, open-source civic tool.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="animate-fade-up text-4xl font-extrabold tracking-tight sm:text-5xl">
          About the{" "}
          <span className="text-gradient">Rapid Response Network</span>
        </h1>
        <p className="animate-fade-up stagger-1 mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          A civic-action platform that connects communities with organized rapid
          response groups across the United States. Whether you&apos;re looking for
          support or ready to mobilize, this is your starting point.
        </p>
      </div>

      {/* What We Do */}
      <section className="mb-16">
        <h2 className="animate-fade-up mb-8 text-center text-2xl font-bold">
          What We Do
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className={`card-hover animate-fade-up stagger-${i + 1} border-border/50`}
            >
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* What is Rapid Response */}
      <section className="mb-16">
        <div className="animate-fade-up rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-8 sm:p-10">
          <h2 className="text-2xl font-bold mb-4">
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
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="animate-fade-up mb-8 text-center text-2xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className={`animate-fade-up stagger-${i + 1} group rounded-xl border bg-card transition-colors hover:bg-accent/50`}
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="border-t px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="animate-fade-up flex flex-col items-center gap-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border p-10 text-center">
        <h2 className="text-2xl font-bold">Ready to get involved?</h2>
        <p className="text-muted-foreground max-w-md">
          Whether you want to find support in your area or register your own
          group, the network is here for you.
        </p>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <MapPin className="h-4 w-4" />
              Explore the Map
            </Button>
          </Link>
          <Link href="/submit">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
              Add Your Group
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
