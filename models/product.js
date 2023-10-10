// models/user.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  number: Number,
  date: Date,
  hsd: String,
  ingredient: String,
  isSend: { type: String, enum: ['WAIT','PENDING', 'REJECT', 'APPROVED', 'REFUSE'], default: 'WAIT' }
},{
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
