import { db } from './db.js';
import crypto from 'crypto';

export function createSession(userId, expiresInDays = 7) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)').run(
    userId,
    token,
    expiresAt
  );
  return { token, expiresAt };
}

export function getSessionByToken(token) {
  return db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
}

export function deleteSession(token) {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export function deleteAllSessionsForUser(userId) {
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}
