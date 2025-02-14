import { query } from './db';
import { encrypt, decrypt } from '$lib/utils/crypto';
import { ENCRYPTION_KEY } from '$env/static/private';

console.log("ENCRYPTION_KEY:", ENCRYPTION_KEY);

export async function createAsset(userId, category, name, purchasePrice, purchaseDate, quantity, currency, ticker) {
  const encryptedName = encrypt(name, ENCRYPTION_KEY);
  const encryptedPurchasePrice = encrypt(purchasePrice.toString(), ENCRYPTION_KEY);

  const result = await query(
    'INSERT INTO assets (user_id, category, encrypted_name, encrypted_purchase_price, purchase_date, quantity, currency, ticker) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [userId, category, encryptedName, encryptedPurchasePrice, purchaseDate, quantity, currency, ticker]
  );
  return result.rows[0];
}

export async function getAssetsByUserId(userId) {
  const result = await query('SELECT id, user_id, category, encrypted_name, encrypted_purchase_price, purchase_date, quantity, currency, ticker FROM assets WHERE user_id = $1', [userId]);
  return result.rows.map(asset => ({
    ...asset,
    name: decrypt(asset.encrypted_name, ENCRYPTION_KEY),
    purchase_price: parseFloat(decrypt(asset.encrypted_purchase_price, ENCRYPTION_KEY))
  }));
}

export async function getAssetById(assetId) {
  const result = await query('SELECT id, user_id, category, encrypted_name, encrypted_purchase_price, purchase_date, quantity, currency, ticker FROM assets WHERE id = $1', [assetId]);
  const asset = result.rows[0];
  if (asset) {
    return {
      ...asset,
      name: decrypt(asset.encrypted_name, ENCRYPTION_KEY),
      purchase_price: parseFloat(decrypt(asset.encrypted_purchase_price, ENCRYPTION_KEY))
    };
  }
  return undefined;
}

export async function updateAsset(assetId, userId, category, name, purchasePrice, purchaseDate, quantity, currency, ticker) {
  const encryptedName = encrypt(name, ENCRYPTION_KEY);
  const encryptedPurchasePrice = encrypt(purchasePrice.toString(), ENCRYPTION_KEY);

  const result = await query(
    'UPDATE assets SET category = $3, encrypted_name = $4, encrypted_purchase_price = $5, purchase_date = $6, quantity = $7, currency = $8, ticker = $9 WHERE id = $1 AND user_id = $2 RETURNING *',
    [assetId, userId, category, encryptedName, encryptedPurchasePrice, purchaseDate, quantity, currency, ticker]
  );

  return result.rows[0];
}

export async function deleteAsset(assetId, userId) {
  const result = await query('DELETE FROM assets WHERE id = $1 AND user_id = $2 RETURNING *', [assetId, userId]);
  return result.rows[0];
}