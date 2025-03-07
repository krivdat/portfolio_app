import pkg from "pg";
const DATABASE_URL = "postgres://tomas.Jsvtk1977@localhost:5432/portfolio_app";
const ENCRYPTION_KEY = "jshfksajdhkashfklsajdhlasghfashgfkajshgfkjasdh";
const { Pool } = pkg;
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
    // Remove this line in production if possible for local development.  NEVER IN PRODUCTION.
  }
});
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
export {
  ENCRYPTION_KEY as E,
  query as q
};
