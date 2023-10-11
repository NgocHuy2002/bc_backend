// models/contract.js
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  data: Object,
},{
  timestamps: true,
});

module.exports = mongoose.model('Contract', contractSchema);
