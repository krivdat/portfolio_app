import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../../../portfolio.sqlite');

// Ensure the database directory exists
const dbDir = dirname(dbPath);
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Define crypto functions
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// SQLite function to encrypt data
db.function('AES_ENCRYPT', (text, key) => {
	if (!text) return null;
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
	const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
	return Buffer.concat([iv, encrypted]);
});

// SQLite function to decrypt data
db.function('AES_DECRYPT', (buffer, key) => {
	if (!buffer) return null;
	const iv = buffer.slice(0, IV_LENGTH);
	const encrypted = buffer.slice(IV_LENGTH);
	const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
	return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
});

// Initialize the database with schema if it doesn't exist
const schemaPath = join(__dirname, '../../../schema.sqlite.sql');
if (fs.existsSync(schemaPath)) {
	const schema = fs.readFileSync(schemaPath, 'utf8');
	db.exec(schema);
}

export function query(sql, params = []) {
	try {
		if (sql.trim().toLowerCase().startsWith('select')) {
			const stmt = db.prepare(sql);
			return { rows: stmt.all(params) };
		} else {
			const stmt = db.prepare(sql);
			const result = stmt.run(params);
			return {
				rows: [result],
				rowCount: result.changes
			};
		}
	} catch (error) {
		console.error('Database error:', error);
		throw error;
	}
}
