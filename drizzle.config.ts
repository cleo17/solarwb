import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://solarwb_db_user:postgres@dpg-d0s47cm3jp1c73ealjtg-a:5432/solarwb_db",
  },
} satisfies Config;
