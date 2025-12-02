const express = require("express");
const router = express.Router();
const {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require("../controllers/cart.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/my", authMiddleware, getMyCart);
router.post("/add", authMiddleware, addToCart);
router.put("/update", authMiddleware, updateCartItem);
router.delete("/remove/:productId", authMiddleware, removeCartItem);

module.exports = router;
