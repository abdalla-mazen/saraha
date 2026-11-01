import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";


const getKey = () => Buffer.from(process.env.ENC_KEY, "hex");
const getIvLength = () => parseInt(process.env.IV_LENGTH) || 16;

export function Encrypt(plainText) {
  const iv = randomBytes(getIvLength());

  const cipher = createCipheriv("aes-256-cbc", getKey(), iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

export function Decrypt(encryptedText) {
  const textParts = encryptedText.split(":");

  const iv = Buffer.from(textParts.shift(), "hex");
  const encrypted = textParts.join(":");

  const decipher = createDecipheriv("aes-256-cbc", getKey(), iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
