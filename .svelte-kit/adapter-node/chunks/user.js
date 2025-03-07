import { q as query, E as ENCRYPTION_KEY } from "./db.js";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
async function createUser(username, password, email, profilePicture) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await query(
    `INSERT INTO users (username, password, encrypted_email, profile_picture)
         VALUES ($1, $2, encode(pgp_sym_encrypt($3, $4), 'hex'), $5)
         RETURNING id`,
    [username, hashedPassword, email, ENCRYPTION_KEY, profilePicture]
  );
  return result.rows[0].id;
}
async function getUserByUsername(username) {
  const result = await query(
    `SELECT id, username, password,
                pgp_sym_decrypt(decode(encrypted_email, 'hex'), $2) as email,
                profile_picture
         FROM users
         WHERE username = $1`,
    [username, ENCRYPTION_KEY]
  );
  return result.rows[0];
}
async function getUserById(userId) {
  const result = await query(
    `SELECT id, username, password,
                pgp_sym_decrypt(decode(encrypted_email, 'hex'), $2) as email,
                profile_picture
         FROM users
         WHERE id = $1`,
    [userId, ENCRYPTION_KEY]
  );
  return result.rows[0];
}
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
export {
  createUser as a,
  getUserById as b,
  comparePassword as c,
  getUserByUsername as g
};
