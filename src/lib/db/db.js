import pkg from 'pg';
const { Pool } = pkg;
import { DATABASE_URL } from '$env/static/private';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Remove this line in production if possible for local development.  NEVER IN PRODUCTION.
  }
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}