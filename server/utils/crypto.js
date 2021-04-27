const crypto = require("crypto");
const algorithm = "aes-256-cbc";

function aesEncryptFromPassword(data, password) {
  const iv = crypto.randomBytes(16);
  const buffer = Buffer.from(data, "utf8");
  const passwordHash = crypto
    .createHash("sha256")
    .update(password + process.env.PASSWORDS_SALT)
    .digest("hex")
    .substr(0, 32);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(passwordHash),
    iv
  );
  const crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const result = { secretKey: crypted, IV: iv };
  return result;
}

function aesDecrypt(data, password, iv) {
  const buffer = Buffer.from(data, "utf-8");
  const passwordHash = crypto
    .createHash("sha256")
    .update(password + process.env.PASSWORDS_SALT)
    .digest("hex")
    .substr(0, 32);
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(passwordHash),
    iv
  );
  const dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return dec.toString("utf8");
}

module.exports = {
  aesEncryptFromPassword,
  aesDecrypt,
};
// // encrypt "hello world"
// const encrypted = encrypt(Buffer.from("hello world", "utf8"));
// // decrypt "hello world"
// console.log(decrypt(encrypted).toString("utf8"));
