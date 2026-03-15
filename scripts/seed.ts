import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const sampleGroups = [
  {
    name: "Portland Housing Coalition",
    city: "Portland",
    state: "Oregon",
    lat: 45.5152,
    lng: -122.6784,
    contactName: "Maria Santos",
    contactEmail: "maria@phc.org",
    focusAreas: ["Housing", "Civil Rights"],
    description:
      "Community group fighting for affordable housing and tenant protections in the Portland metro area.",
    memberCount: "51–100",
    status: "APPROVED" as const,
    approvedAt: new Date(),
  },
  {
    name: "NYC Immigration Rapid Response",
    city: "New York",
    state: "New York",
    lat: 40.7128,
    lng: -74.006,
    contactName: "David Chen",
    contactEmail: "david@nycirr.org",
    focusAreas: ["Immigration", "Civil Rights"],
    description:
      "A network of volunteers providing rapid response to immigration enforcement actions across all five boroughs.",
    memberCount: "100+",
    status: "APPROVED" as const,
    approvedAt: new Date(),
  },
  {
    name: "Austin Environmental Watch",
    city: "Austin",
    state: "Texas",
    lat: 30.2672,
    lng: -97.7431,
    contactName: "Sarah Johnson",
    contactEmail: "sarah@aew.org",
    focusAreas: ["Environment", "Community Safety"],
    description:
      "Monitoring and responding to environmental threats in Central Texas communities.",
    memberCount: "11–50",
    status: "APPROVED" as const,
    approvedAt: new Date(),
  },
  {
    name: "Chicago Labor Alliance",
    city: "Chicago",
    state: "Illinois",
    lat: 41.8781,
    lng: -87.6298,
    contactName: "James Wilson",
    contactEmail: "james@cla.org",
    focusAreas: ["Labor", "Healthcare"],
    description:
      "Supporting workers' rights and fair labor practices across the Chicagoland area.",
    memberCount: "100+",
    status: "APPROVED" as const,
    approvedAt: new Date(),
  },
  {
    name: "Miami Disaster Relief Network",
    city: "Miami",
    state: "Florida",
    lat: 25.7617,
    lng: -80.1918,
    contactName: "Ana Rodriguez",
    contactEmail: "ana@mdrn.org",
    focusAreas: ["Disaster Relief", "Food Security"],
    description:
      "Community-based disaster preparedness and rapid relief for South Florida hurricane and flooding events.",
    memberCount: "51–100",
    status: "PENDING" as const,
  },
];

async function main() {
  console.log("Seeding database...");

  for (const group of sampleGroups) {
    await prisma.group.create({ data: { ...group, isSeed: true } });
    console.log(`  Created: ${group.name}`);
  }

  console.log("\nSeeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
