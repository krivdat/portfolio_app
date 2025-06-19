import { query } from '$lib/db/db.js';
import bcrypt from 'bcrypt';
import { ENCRYPTION_KEY } from '$env/static/private'; // Load from .env

const SALT_ROUNDS = 10;

export async function createUser(
	username,
	password,
	email,
	profilePicture,
	firstName = null,
	last_name = null
) {
	try {
		console.log('Creating user:', { username, email, profilePicture, firstName, last_name });
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		console.log('Password hashed successfully');

		const result = await query(
			`INSERT INTO users (username, password, encrypted_email, profile_picture, first_name, last_name)
			 VALUES (?, ?, hex(AES_ENCRYPT(?, ?)), ?, ?, ?)
			 RETURNING id`,
			[username, hashedPassword, email, ENCRYPTION_KEY, profilePicture, firstName, last_name]
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
                profile_picture,
                first_name,
                last_name
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
                profile_picture,
                first_name,
                last_name
         FROM users
         WHERE id = ?`,
		[ENCRYPTION_KEY, userId]
	);
	return result.rows[0];
}

export async function comparePassword(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
}

export async function updateUserById(userId, { first_name, last_name, email, profile_picture }) {
	const fields = [];
	const values = [];
	if (first_name !== undefined) {
		fields.push('first_name = ?');
		values.push(first_name);
	}
	if (last_name !== undefined) {
		fields.push('last_name = ?');
		values.push(last_name);
	}
	if (email !== undefined) {
		fields.push('encrypted_email = hex(AES_ENCRYPT(?, ?))');
		values.push(email, ENCRYPTION_KEY);
	}
	if (profile_picture !== undefined) {
		fields.push('profile_picture = ?');
		values.push(profile_picture);
	}
	if (fields.length === 0) return;
	values.push(userId);
	const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
	await query(sql, values);
}
