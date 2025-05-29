import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/solartech';

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });
