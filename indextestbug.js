// index.js (debug-friendly)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");

// load swagger.json
let swaggerDocument;
try {
  swaggerDocument = require("./swagger.json");
  console.log("Loaded swagger.json type:", typeof swaggerDocument);
} catch (err) {
  console.error("Failed to load ./swagger.json:", err && err.message);
  swaggerDocument = null;
}

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const profileRoutes = require("./routes/profile.routes");

console.log("types:",
  "authRoutes=", typeof authRoutes,
  "productRoutes=", typeof productRoutes,
  "cartRoutes=", typeof cartRoutes,
  "profileRoutes=", typeof profileRoutes
);

// Extra inspection for Express Router objects: Router is a function but has 'stack' array
const inspectRouter = (r) => {
  if (!r) return "NULL/UNDEF";
  if (typeof r === "function") {
    // likely router or middleware function
    if (r.stack) return "function (has stack)"; // typical Router
    return "function";
  }
  if (Array.isArray(r)) return "array";
  return typeof r;
};

console.log("inspect:",
  "authRoutes->", inspectRouter(authRoutes),
  "productRoutes->", inspectRouter(productRoutes),
  "cartRoutes->", inspectRouter(cartRoutes),
  "profileRoutes->", inspectRouter(profileRoutes)
);

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// DB
connectDB();

// routes prefix /api
if (!authRoutes || (typeof authRoutes !== "function" && typeof authRoutes !== "object")) {
  console.error("authRoutes is not a router/middleware function. Value:", authRoutes);
  process.exit(1);
}
if (!productRoutes || (typeof productRoutes !== "function" && typeof productRoutes !== "object")) {
  console.error("productRoutes is not a router/middleware function. Value:", productRoutes);
  process.exit(1);
}
if (!cartRoutes || (typeof cartRoutes !== "function" && typeof cartRoutes !== "object")) {
  console.error("cartRoutes is not a router/middleware function. Value:", cartRoutes);
  process.exit(1);
}
if (!profileRoutes || (typeof profileRoutes !== "function" && typeof profileRoutes !== "object")) {
  console.error("profileRoutes is not a router/middleware function. Value:", profileRoutes);
  process.exit(1);
}

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/profile", profileRoutes);

// swagger (only if swaggerDocument is object)
if (swaggerDocument && typeof swaggerDocument === "object") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.warn("Swagger not mounted because swaggerDocument is invalid.");
}

// health check
app.get("/", (req, res) => {
  res.send("Zestora API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
