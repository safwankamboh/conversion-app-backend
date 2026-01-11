import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma;
console.log("Prisma Client initialized", process.env.NODE_ENV);

if (process.env.NODE_ENV !== "production") {
  console.log("Prisma Client initialized", process.env.NODE_ENV);
  globalForPrisma.prisma = prisma;
}
