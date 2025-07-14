import { query } from './db.js';

// Create cache table if it doesn't exist
query(`
  CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    value TEXT,
    timestamp INTEGER
  )
`);

export function getCache(key) {
  const result = query('SELECT value, timestamp FROM cache WHERE key = ?', [key]);
  if (result.rows.length > 0) {
    return {
      value: JSON.parse(result.rows[0].value),
      timestamp: result.rows[0].timestamp
    };
  }
  return null;
}

export function setCache(key, value, ttl) {
  const timestamp = Date.now() + ttl;
  query('REPLACE INTO cache (key, value, timestamp) VALUES (?, ?, ?)', [
    key,
    JSON.stringify(value),
    timestamp
  ]);
}
