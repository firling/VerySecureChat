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

const encryptedData = (data, publicKey) => {
  return crypto
    .publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      // We convert the data string to a buffer using `Buffer.from`
      Buffer.from(data)
    )
    .toString("base64");
};

const decryptedData = (encryptedData, privateKey) => {
  return crypto
    .privateDecrypt(
      {
        key: privateKey,
        // In order to decrypt the data, we need to specify the
        // same hashing function and padding scheme that we used to
        // encrypt the data in the previous step
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      encryptedData
    )
    .toString("base64");
};

module.exports = {
  aesEncryptFromPassword,
  aesDecrypt,
  encryptedData,
  decryptedData,
};
