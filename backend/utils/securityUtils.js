
const crypto = require("crypto");

const getEncryptionKey = () => {
  const key = process.env.TWO_FACTOR_ENCRYPTION_KEY;

  if (!key || !/^[a-fA-F0-9]{64}$/.test(key)) {
    throw new Error(
      "TWO_FACTOR_ENCRYPTION_KEY must be a 64-character hexadecimal key"
    );
  }

  return Buffer.from(key, "hex");
};

const encryptSecret = (secret) => {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final()
  ]);

  return [
    iv.toString("hex"),
    cipher.getAuthTag().toString("hex"),
    encrypted.toString("hex")
  ].join(":");
};

const decryptSecret = (value) => {
  const [ivHex, tagHex, encryptedHex] = value.split(":");

  if (!ivHex || !tagHex || !encryptedHex) {
    throw new Error("Invalid encrypted secret");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final()
  ]).toString("utf8");
};

const hashRecoveryCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

const generateRecoveryCodes = () =>
  Array.from({ length: 10 }, () =>
    crypto.randomBytes(5).toString("hex").toUpperCase()
  );

module.exports = {
  encryptSecret,
  decryptSecret,
  hashRecoveryCode,
  generateRecoveryCodes
};
