const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Define your user route handlers here
// Example: Create, Read, Update, Delete user

// Get all Product
router.get("/", async (req, res) => {
  try {
    const query = {}; // Initialize an empty query object

    // Check if 'userId' query parameter is provided
    if (req.query.CreateBy) {
      query.createBy = req.query.CreateBy;
    }

    // Check if 'name' query parameter is provided
    if (req.query.name) {
      query.name = req.query.name;
    }

    // Check if 'hsd' query parameter is provided
    if (req.query.hsd) {
      query.hsd = req.query.hsd;
    }
    if (req.query.isSend) {
      query.isSend = JSON.parse(req.query.isSend);
    }
    console.log(query);

    // You can add more fields to search as needed
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new Product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Update an existing product by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product fields with the new data from req.body

    if (req.body.isSend) {
      product.isSend = req.body.isSend;
    } else {
      product.name = req.body.name;
      product.number = req.body.number;
      product.hsd = req.body.hsd;
      product.date = req.body.date;
      product.ingredient = req.body.ingredient;
    }
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
