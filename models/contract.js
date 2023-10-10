// models/contract.js
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  filename: String,
  path: String,
  image: { data: Buffer, contentType: String },
  name: String,
  number: Number,
  Date: Date,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiver:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }
},{
  timestamps: true,
});

module.exports = mongoose.model('Contract', contractSchema);
