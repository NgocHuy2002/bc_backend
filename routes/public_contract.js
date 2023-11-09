// routes/user.js
const express = require("express");
const router = express.Router();
const Public = require("../models/public_contract");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const { log } = require("console");

// Get all users

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get("/", async (req, res) => {
    try {
      const query = {}; // Initialize an empty query object
  
      // Check if 'name' query parameter is provided
      if (req.query.name) {
        query.name = { $regex: req.query.name, $options: 'i' };
      }
      console.log(query);
  
      // You can add more fields to search as needed
      const public = await Public.find(query);
      res.json(public);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// router.get("/", async (req, res) => {
//   try {
//     const public = await Public.find();
//     res.json(public);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Add a new user
router.post("/", async (req, res) => {
  console.log(req.body.name);
  try {
    const existing = await Public.findOne({ name: req.body.name });
    if (existing) {
      return res
        .status(200)
        .json({ message: "Bạn đã công khai kết quả kiểm định !!" });
    }
    const newPublic = new Public({
      name: req.body.name,
      createdTime: req.body.createdTime,
      test: req.body.test,
      sendBy: req.body.sendBy, // Assuming you pass a user ID in the request
    });
    // const newPublic = new Public(req.body);
    await newPublic.save();
    res.status(201).json({ message: "Success" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
