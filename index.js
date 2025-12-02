require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const profileRoutes = require("./routes/profile.routes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// DB
connectDB();

// routes prefix /api
app.use("/api/auth", authRoutes);
//app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/profile", profileRoutes);

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// health check
app.get("/", (req, res) => {
  res.send("Zestora API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
