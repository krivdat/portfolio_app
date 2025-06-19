// migrate_add_names_to_users.js
// Run this script with: node scripts/migrate_add_names_to_users.js

import sqlite3pkg from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../portfolio.sqlite');
const db = new sqlite3.Database(dbPath);

const migration = [
	`ALTER TABLE users ADD COLUMN first_name TEXT;`,
	`ALTER TABLE users ADD COLUMN last_name TEXT;`
];

function runMigration() {
	db.serialize(() => {
		migration.forEach((sql) => {
			db.run(sql, (err) => {
				if (err && !/duplicate column name/.test(err.message)) {
					console.error('Migration error:', err.message);
				} else if (!err) {
					console.log('Migration step success:', sql);
				}
			});
		});
	});
	db.close(() => {
		console.log('Migration complete.');
	});
}

runMigration();
