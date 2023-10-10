// routes/contract.js
const express = require("express");
const router = express.Router();
const Company = require("../models/company");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs");

// Define your contract route handlers here
// Example: Create, Read, Update, Delete contract
// Get all company
router.get("/", async (req, res) => {
  // try {
  //   const company = await Company.find();
  //   res.json(company);
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }
  try {
    const query = {}; // Initialize an empty query object

    // // Check if 'userId' query parameter is provided
    // if (req.query.CreateBy) {
    //   query.createBy = req.query.CreateBy;
    // }

    // // Check if 'name' query parameter is provided
    // if (req.query.name) {
    //   query.name = req.query.name;
    // }

    // // Check if 'hsd' query parameter is provided
    // if (req.query.hsd) {
    //   query.hsd = req.query.hsd;
    // }

    // You can add more fields to search as needed

    const companys = await Company.find(query);
    res.json(companys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new Company
router.post("/", async (req, res) => {
  const { username, email, password, name } = req.body;
  // ================================== Key =======================================
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
  const userInput = hashedPassword; // Get user input from the request body

  // Derive a key from the user input (e.g., using PBKDF2)
  const derivedKey = crypto.pbkdf2Sync(userInput, "salt", 100000, 64, "sha512");

  // Generate a key pair using the derived key
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, // Adjust key length as needed
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  // Define filenames for public and private keys
  const publicKeyFileName = "public-key.crt";
  const privateKeyFileName = "private-key.pem";

  // Save the keys to files
  fs.writeFileSync(publicKeyFileName, publicKey);
  fs.writeFileSync(privateKeyFileName, privateKey);
  // ...

  // Read the contents of the key files
  const publicKeyContent = fs.readFileSync(publicKeyFileName, "utf-8");
  const privateKeyContent = fs.readFileSync(privateKeyFileName, "utf-8");

  // Encode the contents in base64
  const publicKeyBase64 = Buffer.from(publicKeyContent).toString("base64");
  const privateKeyBase64 = Buffer.from(privateKeyContent).toString("base64");
  // ===============================================================================
  try {
    // Check if the user already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password using bcrypt

    // Create a new user with the hashed password
    const newCompany = new Company({
      username,
      email,
      name,
      password: hashedPassword, // Store the hashed password
      publicKey,
    });

    // Save the user to the database
    await newCompany.save();

    res.status(201).json({
      message: "User registered successfully",
      publicKeyBase64,
      privateKeyBase64,
      publicKeyFileName,
      privateKeyFileName,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by email
    const company = await Company.findOne({ username });

    // If user not found or password is incorrect, return an error
    if (!company || !bcrypt.compareSync(password, company.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: company._id }, "your-secret-key", {
      expiresIn: "1h", // Token expiration time
    });

    // Send the token to the client
    res.status(200).json({ token, company });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed - Network timeout" });
  }
});
module.exports = router;
