const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { ok, fail } = require("../utils/response");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return fail(res, "Name, email and password are required", 400);
    }

    if (password.length < 6) {
      return fail(res, "Password must be at least 6 characters", 400);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return fail(res, "Email already exists", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash
    });

    const data = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return ok(res, "User registered successfully", data, 201);
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500, err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return fail(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return fail(res, "Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return fail(res, "Invalid credentials", 400);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const data = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };

    return ok(res, "Login successful", data);
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500, err.message);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) {
      return fail(res, "User not found", 404);
    }
    return ok(res, "Get current user", user);
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500, err.message);
  }
};

module.exports = { register, login, getMe };
