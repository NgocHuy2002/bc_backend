// routes/contract.js
const express = require('express');
const router = express.Router();
const Contract = require('../models/contract');

// Define your contract route handlers here
// Example: Create, Read, Update, Delete contract
// Get all contract
router.get('/', async (req, res) => {
    try {
        const contract = await Contract.find();
        res.json(contract);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new contract
router.post('/', async (req, res) => {
    try {
        const newContract = new Contract(req.body);
        await newContract.save();
        res.status(201).json(newContract);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
module.exports = router;
