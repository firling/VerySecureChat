const crypto = require("crypto");
const {
  aesEncryptFromPassword,
  RSAgenerateKeyPair,
} = require("../utils/crypto");
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

    const { secretKey, IV } = aesEncryptFromPassword(
      password,
      process.env.SERVER_SECRET
    );

    return res.status(200).json({
      sucess: true,
      token,
      _id: user._id,
      localPassword: secretKey.toString("base64"),
      iv: IV.toString("base64"),
    });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { publicKey, privateKey } = RSAgenerateKeyPair();

    //const { secretKey, IV } = aesEncryptFromPassword(privateKey, password);

    const user = await userModel.create({
      name,
      email,
      password,
      settings: {
        publicKey: publicKey,
        privateKey: privateKey,
        //iv: IV.toString("base64"),
      },
    });

    const token = user.getSignedJwtToken();

    const { secretKey: firstSecretKey, IV: firstIV } = aesEncryptFromPassword(
      password,
      process.env.SERVER_SECRET
    );

    res.status(200).json({
      sucess: true,
      token,
      _id: user._id,
      localPassword: firstSecretKey.toString("base64"),
      iv: firstIV.toString("base64"),
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
