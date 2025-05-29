import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use SSL in production (Render)
const isProduction = process.env.NODE_ENV === 'production';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://solarwb_db_user:postgres@dpg-d0s47cm3jp1c73ealjtg-a:5432/solarwb_db';

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined
});

export const db = drizzle(pool, { schema });
