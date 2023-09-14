// models/contract.js
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Contract', contractSchema);
