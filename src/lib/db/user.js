import { query } from './db';
import bcrypt from 'bcrypt';
import { ENCRYPTION_KEY } from '$env/static/private'; // Load from .env

const SALT_ROUNDS = 10;

export async function createUser(username, password, email, profilePicture) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await query(
        `INSERT INTO users (username, password, encrypted_email, profile_picture)
         VALUES ($1, $2, encode(pgp_sym_encrypt($3, $4), 'hex'), $5)
         RETURNING id`,
        [username, hashedPassword, email, ENCRYPTION_KEY, profilePicture]
    );
    return result.rows[0].id;
}

export async function getUserByUsername(username) {
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

export async function getUserById(userId) {
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

export async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}