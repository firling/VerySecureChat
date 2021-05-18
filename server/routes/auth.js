const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/jwt");
const { loginUser, registerUser, checkUser } = require("../controllers/auth");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/check", authenticateToken, checkUser);

module.exports = router;
