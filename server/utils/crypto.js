const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const NodeRSA = require("node-rsa");

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

const RSAgenerateKeyPair = () => {
  const key = new NodeRSA({ b: 512 });
  key.generateKeyPair();
  return {
    publicKey: key.exportKey("pkcs1-public-pem"),
    privateKey: key.exportKey("pkcs1-private-pem"),
  };
};

const encryptRSA = (keyData, data) => {
  const key = new NodeRSA(keyData);
  //key.importKey(keyData, "pkcs1-public-pem");
  return key.encrypt(data, "base64");
};

const decryptRSA = (keyData, data) => {
  const key = new NodeRSA(keyData);
  //key.importKey(keyData, "pkcs1-public-pem");
  return key.decrypt(data, "utf8");
};

module.exports = {
  aesEncryptFromPassword,
  aesDecrypt,
  RSAgenerateKeyPair,
  encryptRSA,
  decryptRSA,
};
