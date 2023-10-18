// models/image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  isCheck: { type: String, enum: ['WAIT','PENDING', 'REJECT', 'APPROVED', 'REFUSE'], default: 'WAIT'},
  image: { data: Buffer, contentType: String },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  sendBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sendTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
},{
  timestamps: true,
});

module.exports = mongoose.model('Image', imageSchema);