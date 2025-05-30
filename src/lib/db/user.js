import { query } from '$lib/db/db.js';
import bcrypt from 'bcrypt';
import { ENCRYPTION_KEY } from '$env/static/private'; // Load from .env

const SALT_ROUNDS = 10;

export async function createUser(username, password, email, profilePicture) {
	try {
		console.log('Creating user:', { username, email, profilePicture });
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		console.log('Password hashed successfully');

		const result = await query(
			`INSERT INTO users (username, password, encrypted_email, profile_picture)
			 VALUES (?, ?, hex(AES_ENCRYPT(?, ?)), ?)
			 RETURNING id`,
			[username, hashedPassword, email, ENCRYPTION_KEY, profilePicture]
		);
		console.log('User created successfully:', result);
		return result.rows[0].id;
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
}

export async function getUserByUsername(username) {
	const result = await query(
		`SELECT id, username, password,
                AES_DECRYPT(unhex(encrypted_email), ?) as email,
                profile_picture
         FROM users
         WHERE username = ?`,
		[ENCRYPTION_KEY, username]
	);
	return result.rows[0];
}

export async function getUserById(userId) {
	const result = await query(
		`SELECT id, username, password,
                AES_DECRYPT(unhex(encrypted_email), ?) as email,
                profile_picture
         FROM users
         WHERE id = ?`,
		[ENCRYPTION_KEY, userId]
	);
	return result.rows[0];
}

export async function comparePassword(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
}
