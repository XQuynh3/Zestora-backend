require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const profileRoutes = require("./routes/profile.routes");

const app = express();

// ===== CORS =====
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ===== Debug log =====
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ===== Connect DB =====
connectDB();

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/profile", profileRoutes);

// ===================================================================
//          FIX SWAGGER — ALWAYS LOAD swagger.json FROM SERVER
// ===================================================================

// Endpoint trả swagger.json để Swagger UI load mỗi lần
app.get("/swagger.json", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json(swaggerDocument);
});

// Swagger UI load qua URL, không dùng bản embed cũ
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "/swagger.json",
      persistAuthorization: true,
    },
  })
);

// ===== Root =====
app.get("/", (req, res) => {
  res.send("Zestora API is running");
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
