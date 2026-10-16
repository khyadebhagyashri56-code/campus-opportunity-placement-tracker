
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const result = await prisma.$queryRaw`SELECT 1`;
  console.log("Database connection successful!");
  console.log(result);
} catch (error) {
  console.error("Database connection failed:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
