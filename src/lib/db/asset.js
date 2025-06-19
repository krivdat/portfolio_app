import { query } from './db';
import { ENCRYPTION_KEY } from '$env/static/private';

export async function createAsset(
	userId,
	category,
	name,
	purchasePrice,
	purchaseDate,
	quantity,
	currency,
	ticker,
	status = 'open',
	closingPrice = null,
	closingDate = null,
	closingNote = null
) {
	// In SQLite we'll use the built-in hex() and unhex() functions for binary-to-hex conversion
	// and AES-256-CBC encryption from crypto module for encryption
	const result = await query(
		`INSERT INTO assets (user_id, category, encrypted_name, encrypted_purchase_price, encrypted_purchase_date, quantity, currency, encrypted_ticker, status, encrypted_closing_price, encrypted_closing_date, closing_note)
    VALUES (?, ?, 
         hex(AES_ENCRYPT(?, ?)),
         hex(AES_ENCRYPT(?, ?)),
         hex(AES_ENCRYPT(?, ?)),
         ?, ?, 
         hex(AES_ENCRYPT(?, ?)),
         ?,
         ${closingPrice !== null ? 'hex(AES_ENCRYPT(?, ?))' : 'NULL'},
         ${closingDate !== null ? 'hex(AES_ENCRYPT(?, ?))' : 'NULL'},
         ?)
    RETURNING *`,
		[
			userId,
			category,
			name,
			ENCRYPTION_KEY,
			purchasePrice.toString(),
			ENCRYPTION_KEY,
			purchaseDate.toString(),
			ENCRYPTION_KEY,
			quantity,
			currency,
			ticker || '',
			ENCRYPTION_KEY,
			status,
			...(closingPrice !== null ? [closingPrice.toString(), ENCRYPTION_KEY] : []),
			...(closingDate !== null ? [closingDate.toString(), ENCRYPTION_KEY] : []),
			closingNote
		]
	);
	return result.rows[0];
}

export async function getAssetsByUserId(userId) {
	const result = await query(
		`SELECT id, user_id, category,
            AES_DECRYPT(unhex(encrypted_name), ?) as name,
            CAST(AES_DECRYPT(unhex(encrypted_purchase_price), ?) AS DECIMAL) as purchase_price,
            AES_DECRYPT(unhex(encrypted_purchase_date), ?) as purchase_date,
            quantity, currency,
            AES_DECRYPT(unhex(encrypted_ticker), ?) as ticker,
            status,
            CAST(AES_DECRYPT(unhex(encrypted_closing_price), ?) AS DECIMAL) as closing_price,
            AES_DECRYPT(unhex(encrypted_closing_date), ?) as closing_date,
            closing_note
     FROM assets
     WHERE user_id = ?`,
		[
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			userId
		]
	);
	return result.rows;
}

export async function getAssetById(assetId) {
	const result = await query(
		`SELECT id, user_id, category,
            AES_DECRYPT(unhex(encrypted_name), ?) as name,
            CAST(AES_DECRYPT(unhex(encrypted_purchase_price), ?) AS DECIMAL) as purchase_price,
            AES_DECRYPT(unhex(encrypted_purchase_date), ?) as purchase_date,
            quantity, currency,
            AES_DECRYPT(unhex(encrypted_ticker), ?) as ticker,
            status,
            CAST(AES_DECRYPT(unhex(encrypted_closing_price), ?) AS DECIMAL) as closing_price,
            AES_DECRYPT(unhex(encrypted_closing_date), ?) as closing_date,
            closing_note
     FROM assets
     WHERE id = ?`,
		[
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			ENCRYPTION_KEY,
			assetId
		]
	);
	return result.rows[0];
}

export async function updateAsset(
	assetId,
	userId,
	category,
	name,
	purchasePrice,
	purchaseDate,
	quantity,
	currency,
	ticker,
	status = 'open',
	closingPrice = null,
	closingDate = null,
	closingNote = null
) {
	const result = await query(
		`UPDATE assets
     SET category = ?,
         encrypted_name = hex(AES_ENCRYPT(?, ?)),
         encrypted_purchase_price = hex(AES_ENCRYPT(?, ?)),
         encrypted_purchase_date = hex(AES_ENCRYPT(?, ?)),
         quantity = ?,
         currency = ?,
         encrypted_ticker = hex(AES_ENCRYPT(?, ?)),
         status = ?,
         encrypted_closing_price = ${closingPrice !== null ? 'hex(AES_ENCRYPT(?, ?))' : 'NULL'},
         encrypted_closing_date = ${closingDate !== null ? 'hex(AES_ENCRYPT(?, ?))' : 'NULL'},
         closing_note = ?,
         updated_at = datetime('now')
     WHERE id = ? AND user_id = ?
     RETURNING *`,
		[
			category,
			name,
			ENCRYPTION_KEY,
			purchasePrice.toString(),
			ENCRYPTION_KEY,
			purchaseDate.toString(),
			ENCRYPTION_KEY,
			quantity,
			currency,
			ticker || '',
			ENCRYPTION_KEY,
			status,
			...(closingPrice !== null ? [closingPrice.toString(), ENCRYPTION_KEY] : []),
			...(closingDate !== null ? [closingDate.toString(), ENCRYPTION_KEY] : []),
			closingNote,
			assetId,
			userId
		]
	);
	return result.rows[0];
}

export async function deleteAsset(assetId, userId) {
	const result = await query('DELETE FROM assets WHERE id = ? AND user_id = ? RETURNING *', [
		assetId,
		userId
	]);
	return result.rows[0];
}
