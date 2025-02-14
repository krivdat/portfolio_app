import { query } from './db';
import bcrypt from 'bcrypt';
import { encrypt, decrypt } from '$lib/utils/crypto';
import { ENCRYPTION_KEY } from '$env/static/private';

const SALT_ROUNDS = 10;

export async function createUser(username, password, email, profilePicture) {
  console.log("Creating user with email:", email);
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const encryptedEmail = encrypt(email, ENCRYPTION_KEY);

  const result = await query(
    'INSERT INTO users (username, password, encrypted_email, profile_picture) VALUES ($1, $2, $3, $4) RETURNING id',
    [username, hashedPassword, encryptedEmail, profilePicture]
  );
  return result.rows[0].id;
}

export async function getUserByUsername(username) {
  const result = await query('SELECT id, username, password, encrypted_email, profile_picture FROM users WHERE username = $1', [username]);
  const user = result.rows[0];
  if (user) {
    return {
      ...user,
      email: decrypt(Buffer.from(user.encrypted_email, 'hex'), ENCRYPTION_KEY)
    };
  }
  return undefined;
}

export async function getUserById(userId) {
  const result = await query('SELECT id, username, encrypted_email, profile_picture FROM users WHERE id = $1', [userId]);
  const user = result.rows[0];
  if (user) {
    return {
      ...user,
      email: decrypt(Buffer.from(user.encrypted_email, 'hex'), ENCRYPTION_KEY)
    };
  }
  return undefined;
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}