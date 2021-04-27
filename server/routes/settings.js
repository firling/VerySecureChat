const express = require("express");
const router = express.Router();

const { updateSettings, getSettings } = require("../controllers/settings");
const { authenticateToken } = require("../middlewares/jwt");

router.put("/", authenticateToken, updateSettings);
router.get("/", authenticateToken, getSettings);

module.exports = router;
