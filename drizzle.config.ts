import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://solarwb_db_user:TDILiK8tzNl1qTidiZiBKV56FHle4uQu@dpg-d0s47cm3jp1c73ealjtg-a.oregon-postgres.render.com/solarwb_db",
    ssl: { rejectUnauthorized: false }
  },
} satisfies Config;
