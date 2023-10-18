// routes/contract.js
const express = require("express");
const router = express.Router();
const Contract = require("../models/contract");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const upload = multer();
// Define your contract route handlers here
// Example: Create, Read, Update, Delete contract
// Get all contract
router.get("/", async (req, res) => {
  const { productId } = req.query;
  console.log(productId);
  try {
    const contract = await Contract.find({productId});
    res.json(contract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new contract
router.post(
  "/",
  upload.fields([
    { name: "privateKey", maxCount: 1 },
    { name: "data", maxCount: 1 },
  ]),
  async (req, res) => {
    // const { data, privateKey } = req.body;
    const privateKey = req.files["privateKey"][0].buffer.toString("utf-8");
    const dataJSON = req.body.data; // Access the JSON string from req.body
    const { sendBy, sendTo, productId } = req.body;
    const data = JSON.parse(dataJSON);
    var decode = jwt.sign({data: data}, privateKey, {algorithm: 'RS256'})
    // console.log(decode)
    // console.log(privateKey);
    try {
        const newContract = new Contract({
            data: decode,
            sendBy,
            sendTo,
            productId,
        });
        await newContract.save();
        res.status(201).json(newContract);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
  }
);

// Get and encode data 
router.post(
  "/encode",
  upload.fields([
    { name: "publicKey", maxCount: 1 },
    { name: "data", maxCount: 1 },
  ]),
  async (req, res) => {
    const publicKey = req.files["publicKey"][0].buffer.toString("utf-8");
    const data = req.body.data; // Access the JSON string from req.body
    console.log(data);
    // const data = JSON.parse(dataJSON);
    // var decode = jwt.sign({data: data}, privateKey, {algorithm: 'RS256'})
    var encode = jwt.verify(data, publicKey)
    try {
        res.status(201).json(encode);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
  }
);
module.exports = router;
