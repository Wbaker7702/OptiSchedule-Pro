import { defineConfig } from "prisma/config";

// We force the URL to be a string to satisfy the Prisma 7 validation engine
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasources: {
    url: databaseUrl,
  },
});
