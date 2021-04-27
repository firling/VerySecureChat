const userModel = require("../models/user");

const updateSettings = async (req, res, next) => {
  const { _id } = req.user;
  const newSettings = req.body;
  userModel
    .findOne({
      _id,
    })
    .then((user) => {
      user.settings = newSettings;
      user.save();
      res.status(200).json(user);
    });
};

const getSettings = async (req, res, next) => {
  const { _id } = req.user;
  const user = await userModel.findOne({
    _id,
  });
  res.status(200).json(user.settings);
};

module.exports = {
  updateSettings,
  getSettings,
};
