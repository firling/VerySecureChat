const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/jwt");
const {
  getUsers,
  getMessages,
  sendMessage,
  test,
} = require("../controllers/main");

router.get("/getUsers", authenticateToken, getUsers);
router.get("/getMessages/:corresponding_id", authenticateToken, getMessages);
router.post("/sendMessage", authenticateToken, sendMessage);
router.get("/test", test);
module.exports = router;
