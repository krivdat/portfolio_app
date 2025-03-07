import { q as query, E as ENCRYPTION_KEY } from "./db.js";
async function createAsset(userId, category, name, purchasePrice, purchaseDate, quantity, currency, ticker) {
  const result = await query(
    `INSERT INTO assets (user_id, category, encrypted_name, encrypted_purchase_price, encrypted_purchase_date, quantity, currency, encrypted_ticker) 
    VALUES ($1, $2, 
         encode(pgp_sym_encrypt($3, $9), 'hex'),
         encode(pgp_sym_encrypt($4::text, $9), 'hex'),
         encode(pgp_sym_encrypt($5::text, $9), 'hex'),
         $6, $7, 
         encode(pgp_sym_encrypt($8, $9), 'hex'))
         RETURNING *`,
    [userId, category, name, purchasePrice, purchaseDate, quantity, currency, ticker, ENCRYPTION_KEY]
  );
  return result.rows[0];
}
async function getAssetsByUserId(userId) {
  const result = await query(
    `SELECT id, user_id, category,
                pgp_sym_decrypt(decode(encrypted_name, 'hex'), $2) as name,
                pgp_sym_decrypt(decode(encrypted_purchase_price, 'hex'), $2)::numeric as purchase_price,
                pgp_sym_decrypt(decode(encrypted_purchase_date, 'hex'), $2)::text as purchase_date,
                quantity, currency,
                pgp_sym_decrypt(decode(encrypted_ticker, 'hex'), $2) as ticker
       FROM assets
       WHERE user_id = $1`,
    [userId, ENCRYPTION_KEY]
  );
  return result.rows;
}
async function getAssetById(assetId) {
  const result = await query(
    `SELECT id, user_id, category,
                pgp_sym_decrypt(decode(encrypted_name, 'hex'), $2) as name,
                pgp_sym_decrypt(decode(encrypted_purchase_price, 'hex'), $2)::numeric as purchase_price,
                pgp_sym_decrypt(decode(encrypted_purchase_date, 'hex'), $2)::text as purchase_date,
                quantity, currency,
                pgp_sym_decrypt(decode(encrypted_ticker, 'hex'), $2) as ticker
       FROM assets
       WHERE id = $1`,
    [assetId, ENCRYPTION_KEY]
  );
  return result.rows[0];
}
async function updateAsset(assetId, userId, category, name, purchasePrice, purchaseDate, quantity, currency, ticker) {
  const result = await query(
    `UPDATE assets
         SET category = $3,
             encrypted_name = encode(pgp_sym_encrypt($4, $10), 'hex'),
             encrypted_purchase_price = encode(pgp_sym_encrypt($5::text, $10), 'hex'),
             encrypted_purchase_date = encode(pgp_sym_encrypt($6::text, $10),'hex'),
             quantity = $7,
             currency = $8,
             encrypted_ticker = encode(pgp_sym_encrypt($9, $10), 'hex')
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
    [assetId, userId, category, name, purchasePrice, purchaseDate, quantity, currency, ticker, ENCRYPTION_KEY]
  );
  return result.rows[0];
}
async function deleteAsset(assetId, userId) {
  const result = await query("DELETE FROM assets WHERE id = $1 AND user_id = $2 RETURNING *", [assetId, userId]);
  return result.rows[0];
}
export {
  getAssetById as a,
  createAsset as c,
  deleteAsset as d,
  getAssetsByUserId as g,
  updateAsset as u
};
