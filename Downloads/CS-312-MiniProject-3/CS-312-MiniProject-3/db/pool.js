import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/BlogDB';

export const pool = new Pool({
  connectionString
});

// Basic connectivity check on import
pool.on('error', (err) => {
  console.error('Unexpected PG client error', err);
});
