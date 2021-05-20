const userModel = require("../models/user.js");
const messageModel = require("../models/message.js");
const socket = require("../socket");

const getUsers = async (req, res, next) => {
    const users = await userModel.find({
        _id: {$ne: req.user._id}
    }).select('_id name');;
    return res.status(200).json({
        users
    });
}

const getMessages = async (req, res, next) => {
    const { corresponding_id } = req.params;
    const messageSender = await messageModel.find({
        sender: req.user._id,
        receiver: corresponding_id,
    })
    newMessageSender = messageSender.map(elt => {
        elt.author = "author";
        return {
            _id: elt._id,
            author: "author",
            sender: elt.sender,
            receiver: elt.receiver,
            message: elt.message,
            createdAt: elt.createdAt,
        };
    }) 
    const messageReceiver = await messageModel.find({
        sender: corresponding_id,
        receiver: req.user._id,
    })
    return res.status(200).json({
        message: [...newMessageSender, ...messageReceiver]
    })
}

const sendMessage = async (req, res, next) => {
    const { corresponding_id, message } = req.body;

    messageModel.create({
        sender: req.user._id,
        receiver: corresponding_id,
        message: message
    })

    return res.status(200).end()
}

const test = async (req, res, next) => {
    const io = socket.getIo();

    const resp = await io.allSockets();

    return res.status(200).json({
        clients: [...resp],
        corresponding: socket.getCorresponding()
    })
}

module.exports = {
    getUsers,
    getMessages,
    sendMessage,
    test,
};