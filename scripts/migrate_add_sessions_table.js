// migrate_add_sessions_table.js
// Run this script with: node scripts/migrate_add_sessions_table.js

import sqlite3pkg from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../portfolio.sqlite');
const db = new sqlite3.Database(dbPath);

const migration = [
	`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT (datetime('now')),
    expires_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
	`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);`,
	`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);`
];

function runMigration() {
	db.serialize(() => {
		migration.forEach((sql) => {
			db.run(sql, (err) => {
				if (err) {
					console.error('Migration error:', err.message);
				} else {
					console.log('Migration step success:', sql.split('\n')[0]);
				}
			});
		});
	});
	db.close(() => {
		console.log('Migration complete.');
	});
}

runMigration();
