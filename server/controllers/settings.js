const userModel = require("../models/user");

const updateSettings = async (req, res, next) => {
  const { _id } = req.user;
  const newSettings = req.body;
  const user = await userModel.findOne({
    _id,
  });
  user.settings = newSettings;
  user.save();

  return res.status(200).json(user);
};

const getSettings = async (req, res, next) => {
  const { _id } = req.user;
  const user = await userModel.findOne({
    _id,
  });

  return res.status(200).json(user.settings);
};

module.exports = {
  updateSettings,
  getSettings,
};
