const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const SettingsSchema = new mongoose.Schema({
  publicKey: String,
  privateKey: String,
  iv: String,
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add you name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    // match: [
    //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //   "Please add an valid email",
    // ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 4,
    select: false,
  },
  settings: SettingsSchema,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); //NOTE-> THERE IS NOT NEXT IN THE VIDEO
});

UserSchema.methods.getSignedJwtToken = function () {
  //this cannot be accesed in statics ?? there are only available in methods ??
  // return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRE,
  // });

  return jwt.sign(
    { id: this._id },
    "PkEWmGDsfLvpReYnWmLUvasKUALeBdwnh4yJfPkUWGcwtnYEBsxJKVvGMrmErEq3",
    {
      expiresIn: "604800",
    }
  );
};

UserSchema.methods.matchpasswords = async function (enteredPassword) {
  //this cannot be accesed in statics ?? there are only available in methods ??
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetToken = function () {
  //generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //hash the generated token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //10 minitues
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
