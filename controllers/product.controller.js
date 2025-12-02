const Product = require("../models/product.model");
const { ok, fail } = require("../utils/response");

const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, category } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    const data = {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    return ok(res, "Product list", data);
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500, err.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return fail(res, "Product not found", 404);
    }
    return ok(res, "Product detail", product);
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500, err.message);
  }
};

module.exports = { getAllProducts, getProductById };
