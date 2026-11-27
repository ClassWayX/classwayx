import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.AUTH_USER_DATABASE_URL;
  if (!connectionString) throw new Error("AUTH_USER_DATABASE_URL is required");

  const adapter = new PrismaPg({ connectionString }, { schema: "app" });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
