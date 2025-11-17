// ===============================
// BASIC SETUP
// ===============================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Use env variables
const port = process.env.PORT || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://xuanquynh3824:03082004@cluster0.zssggef.mongodb.net/Zestora";

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// CONNECT MONGODB
// ===============================
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ===============================
// HOME ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("Cart API is running");
});

// ===============================
// CART MODEL
// ===============================
const Cart = mongoose.model("Cart", {
  product_id: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

// ===============================
// SWAGGER SETUP
// ===============================
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Zestora Cart API",
    version: "1.0.0",
    description: "API documentation for Cart Service",
  },
  servers: [
    { url: "http://localhost:4000", description: "Local server" },
    { url: "https://your-render-url.onrender.com", description: "Render server" },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./index.js"], // đọc swagger comments từ file này
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Show docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Export raw JSON
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// ===============================
// API: ADD TO CART
// ===============================

/**
 * @openapi
 * /addtocart:
 *   post:
 *     summary: Add a product to the cart (or increase quantity)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added to cart
 */
app.post("/addtocart", async (req, res) => {
  const product_id = req.body.product_id;

  if (!product_id) {
    return res.status(400).json({ success: false, message: "product_id missing" });
  }

  let item = await Cart.findOne({ product_id });

  if (item) {
    item.quantity += 1;
    await item.save();
  } else {
    item = new Cart({ product_id, quantity: 1 });
    await item.save();
  }

  res.json({ success: true, message: "Added to cart", item });
});

// ===============================
// API: REMOVE FROM CART
// ===============================

/**
 * @openapi
 * /removefromcart:
 *   post:
 *     summary: Remove one quantity of a product from the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product removed
 */
app.post("/removefromcart", async (req, res) => {
  const product_id = req.body.product_id;

  if (!product_id) {
    return res.status(400).json({ success: false, message: "product_id missing" });
  }

  let item = await Cart.findOne({ product_id });

  if (!item) {
    return res.status(404).json({ success: false, message: "Item not in cart" });
  }

  if (item.quantity > 1) {
    item.quantity -= 1;
    await item.save();
  } else {
    await Cart.deleteOne({ product_id });
  }

  res.json({ success: true, message: "Removed from cart" });
});

// ===============================
// API: GET CART
// ===============================

/**
 * @openapi
 * /getcart:
 *   get:
 *     summary: Get all cart items
 *     responses:
 *       200:
 *         description: A list of all items in cart
 */
app.get("/getcart", async (req, res) => {
  const cart = await Cart.find({});
  res.json(cart);
});

// ===============================
// START SERVER
// ===============================
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
