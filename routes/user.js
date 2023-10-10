// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const Image = require("../models/image");
// Define your user route handlers here
// Example: Create, Read, Update, Delete user

// Get all users

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an existing user
router.put("/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ username });

    // If user not found or password is incorrect, return an error
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h", // Token expiration time
    });

    // Send the token to the client
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed - Network timeout" });
  }
});

// Registration route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create a new user with the hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/generate-keys", (req, res) => {
  const userInput = req.body.userInput; // Get user input from the request body

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

  // Return the base64-encoded contents and filenames to the client
  res.json({
    publicKeyBase64,
    privateKeyBase64,
    publicKeyFileName,
    privateKeyFileName,
  });
});

router.post(
  "/encode-image",
  upload.fields([
    { name: "privateKey", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const privateKey = req.files["privateKey"][0].buffer.toString("utf-8");
      const imageData = req.files["image"][0].buffer;
      const contentType = req.files["image"][0].mimetype;
      let image = { data: imageData, contentType }
      // const { image } = req.body;
      // console.log("privateKey >>>", privateKey);
      // console.log("imageBuffer >>>", image);
      var decode = jwt.sign({data: image}, privateKey, {algorithm: 'RS256'})
      var code = jwt.verify(token, privateKey,)
      console.log(decode);
      // // Perform image encoding using the private key
      // const encryptedImageBuffer = await encryptImage(imageBuffer, privateKey);

      // // Save the encoded image to MongoDB
      // const image = new Image({
      //   filename: "encoded-image.jpg", // Provide a filename for the encoded image
      //   image: { data: encryptedImageBuffer, contentType: "image/jpeg" }, // Adjust the content type as needed
      // });

      // await image.save();

      res.json({ message: "Image encoded and saved successfully" });
    } catch (error) {
      console.error("Error encoding and saving image:", error);
      res.status(500).json({ message: "Error encoding and saving image" });
    }
  }
);

async function encryptImage(imageBuffer, privateKey) {
  try {
    // Convert the private key from PEM format to a Buffer
    const privateKeyBuffer = Buffer.from(privateKey, "utf-8");

    // Encrypt the image using the private key
    const encryptedImageBuffer = crypto.privateEncrypt(
      { key: privateKeyBuffer, passphrase: "" }, // Provide an empty passphrase
      imageBuffer
    );

    return encryptedImageBuffer;
  } catch (error) {
    throw error;
  }
}

module.exports = router;
