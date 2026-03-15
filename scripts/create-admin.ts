import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const email = process.argv[2] || "admin@example.com";
  const password = process.argv[3] || "admin123";
  const name = process.argv[4] || "Admin";

  console.log(`Creating admin user: ${email}`);

  const hashedPassword = await hashPassword(password);
  const userId = `admin_${randomBytes(12).toString("hex")}`;

  try {
    await prisma.user.upsert({
      where: { email },
      update: { role: "admin" },
      create: {
        id: userId,
        email,
        name,
        emailVerified: true,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.account.create({
      data: {
        id: `acct_${randomBytes(12).toString("hex")}`,
        accountId: userId,
        providerId: "credential",
        userId: userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("Admin user created successfully!");
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log("\nYou can now log in at /admin/login");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
