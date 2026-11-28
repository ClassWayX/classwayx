import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
let prisma: PrismaClient | undefined;

function createClient() {
  const connectionString = process.env.AUTH_USER_DATABASE_URL;
  if (!connectionString) throw new Error("AUTH_USER_DATABASE_URL is required");

  const adapter = new PrismaPg({ connectionString }, { schema: "app" });
  const client = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

export function getPrisma() {
  prisma ??= globalForPrisma.prisma ?? createClient();
  return prisma;
}
