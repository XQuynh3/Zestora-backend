const jwt = require("jsonwebtoken");
const { fail } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return fail(res, "No token provided", 401);
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return fail(res, "Invalid token format", 401);
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded: { userId, role, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    return fail(res, "Invalid or expired token", 401);
  }
};

module.exports = { authMiddleware };
