const crypto = require("crypto");
const { aesEncryptFromPassword, aesDecrypt } = require("../utils/crypto");
const userModel = require("../models/user.js");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Please provide email and password");
    }

    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user) {
      return res.status(400).json("Invalid credentials");
    }

    const isMatch = await user.matchpasswords(password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }

    //NOTE: static are called on model so , it will called upon userModel
    //methods are called on the actual user data , so it will call on 'user'

    const token = user.getSignedJwtToken();

    const decryptedPrivateKey = aesDecrypt(
      user.settings.privateKey,
      password,
      user.settings.iv
    );

    return res.status(200).json({
      sucess: true,
      token,
      _id: user._id,
      localPassword: aesEncryptFromPassword(
        decryptedPrivateKey,
        process.env.SERVER_SECRET
      ),
    });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: "top secret",
      },
    });

    const { secretKey, IV } = aesEncryptFromPassword(privateKey, password);

    const user = await userModel.create({
      name,
      email,
      password,
      settings: {
        publicKey: publicKey,
        privateKey: secretKey,
        iv: IV,
      },
    });

    const token = user.getSignedJwtToken();

    const decryptedPrivateKey = aesDecrypt(
      user.settings.privateKey,
      password,
      user.settings.iv
    );

    res.status(200).json({
      sucess: true,
      token,
      _id: user._id,
      localPassword: aesEncryptFromPassword(
        decryptedPrivateKey,
        process.env.SERVER_SECRET
      ),
    });
  } catch (error) {
    next(error);
  }
};

const checkUser = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    _id: req.user._id,
  });
};

module.exports = {
  loginUser,
  registerUser,
  checkUser,
};
