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

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options(/.*/, cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, req.headers.origin);
  next();
});

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/profile", profileRoutes);

const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    defaultModelsExpandDepth: 1,
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Zestora API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
