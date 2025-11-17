const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect("mongodb+srv://xuanquynh3824:03082004@cluster0.zssggef.mongodb.net/Zestora")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Cart API is running");
});

/* ----------------------------------------
   CART MODEL
-----------------------------------------*/
const Cart = mongoose.model("Cart", {
  product_id: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

/* ----------------------------------------
   ADD TO CART
-----------------------------------------*/
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

/* ----------------------------------------
   REMOVE FROM CART
-----------------------------------------*/
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

/* ----------------------------------------
   GET CART
-----------------------------------------*/
app.get("/getcart", async (req, res) => {
  const cart = await Cart.find({});
  res.json(cart);
});

/* ----------------------------------------
   START SERVER
-----------------------------------------*/
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
