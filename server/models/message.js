const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please add a sender"],
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please add a receiver"],
    },
    message: {
      type: String,
      required: [true, "Please add a message"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
});

module.exports = mongoose.model("Message", MessageSchema);