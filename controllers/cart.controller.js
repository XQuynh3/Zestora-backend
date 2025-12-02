// controllers/cart.controller.js
const Cart = require("../models/cart.model");
const { ok, fail } = require("../utils/response");

// Lấy cart của user
const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) return ok(res, "Cart empty", { items: [] });

    return ok(res, "User cart", cart);
  } catch (err) {
    console.error("getMyCart error:", err);
    return fail(res, "Server error", 500, err.message);
  }
};

// Thêm sản phẩm vào cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) return fail(res, "productId is required", 400);

    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.userId,
        items: [{ productId, quantity }],
      });
    } else {
      // so sánh bằng string để tránh ObjectId vs string mismatch
      const index = cart.items.findIndex(
        (item) => String(item.productId) === String(productId)
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    return ok(res, "Item added to cart", cart, 201);
  } catch (err) {
    console.error("addToCart error:", err);
    return fail(res, "Server error", 500, err.message);
  }
};

// Cập nhật số lượng
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined)
      return fail(res, "productId and quantity are required", 400);

    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return fail(res, "Cart not found", 404);

    const index = cart.items.findIndex(
      (item) => String(item.productId) === String(productId)
    );

    if (index === -1) return fail(res, "Item not found in cart", 404);

    if (quantity <= 0) {
      // nếu quantity <= 0 thì remove
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = quantity;
    }

    await cart.save();

    return ok(res, "Cart updated", cart);
  } catch (err) {
    console.error("updateCartItem error:", err);
    return fail(res, "Server error", 500, err.message);
  }
};

// Xóa item khỏi cart
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return fail(res, "Cart not found", 404);

    cart.items = cart.items.filter(
      (item) => String(item.productId) !== String(productId)
    );

    await cart.save();

    return ok(res, "Item removed from cart", cart);
  } catch (err) {
    console.error("removeCartItem error:", err);
    return fail(res, "Server error", 500, err.message);
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
