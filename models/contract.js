// models/contract.js
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  data: Object,
  sendBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sendTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
},{
  timestamps: true,
});

module.exports = mongoose.model('Contract', contractSchema);
