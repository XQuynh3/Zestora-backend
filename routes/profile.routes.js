const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  getProfile,
  updateName,
  changePassword
} = require("../controllers/profile.controller");

router.get("/me", authMiddleware, getProfile);
router.put("/update-name", authMiddleware, updateName);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
