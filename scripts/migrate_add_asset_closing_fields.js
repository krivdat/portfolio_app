import sqlite3pkg from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../portfolio.sqlite');
const db = new sqlite3.Database(dbPath);

const migration = [
	`ALTER TABLE assets ADD COLUMN status TEXT NOT NULL DEFAULT 'open';`,
	`ALTER TABLE assets ADD COLUMN encrypted_closing_price TEXT;`,
	`ALTER TABLE assets ADD COLUMN encrypted_closing_date TEXT;`,
	`ALTER TABLE assets ADD COLUMN closing_note TEXT;`
];

function runMigration() {
	db.serialize(() => {
		migration.forEach((sql) => {
			db.run(sql, (err) => {
				if (err && !/duplicate column name|no such column|already exists/.test(err.message)) {
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
