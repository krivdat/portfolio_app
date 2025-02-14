import crypto from 'crypto';

export function encrypt(text, key) {
  if (!key) {
    throw new Error("Encryption key is not defined!");
  }
  console.log("Encrypting:", text);
  console.log("Using key:", key);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);

  let encrypted = cipher.update(text, 'utf8');  // Encode text to UTF-8 Buffer
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const result = Buffer.concat([iv, encrypted]); // Concatenate IV and encrypted data
  return result; // Return as a Buffer, to be stored in BYTEA column
}

export function decrypt(buffer, key) {
  if (!key) {
    throw new Error("Encryption key is not defined!");
  }

  try {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      console.warn("Attempted to decrypt non-buffer:", buffer);
      return null;
    }

    const iv = buffer.slice(0, 16); // Extract IV
    const encryptedText = buffer.slice(16); // Extract encrypted data

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8'); // Convert back to UTF-8 string
  } catch (error) {
    console.error("Error decrypting:", error);
    return null;
  }
}