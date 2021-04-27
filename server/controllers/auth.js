const userModel = require("../models/user.js");

/**
 * @description login user
 * @param route POST /api/v1/auth/login
 * @param access PRIVATE
 */
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate email and password
    if (!email || !password) {
      //return next(new ErrorHandler("Please provide email password", 400));
      return res.status(400).json("Please provide email and password");
    }

    //check for user
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user) {
      //return next(new ErrorHandler("Invalid credentials", 400));
      return res.status(400).json("Invalid credentials");
    }

    //check password
    const isMatch = await user.matchpasswords(password);
    if (!isMatch) {
      //return next(new ErrorHandler("Invalid credentials", 400));
      return res.status(400).json("Invalid credentials");
    }

    //NOTE: static are called on model so , it will called upon userModel
    //methods are called on the actual user data , so it will call on 'user'

    const token = user.getSignedJwtToken();

    returnres.status(200).json({
      sucess: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description register user
 * @param route POST /api/v1/auth/register
 * @param access PRIVATE
 */
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(req.body);
    const user = await userModel.create({
      name,
      email,
      password,
      settings: {
        privateKey: "test",
      },
    });

    const token = user.getSignedJwtToken();

    res.status(200).json({
      sucess: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
