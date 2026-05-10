import { PrismaClient } from "@prisma/client";
import config from "../../prisma/prisma.config";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
    ...config,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
