// models/image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  image: { data: Buffer, contentType: String },
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
});

module.exports = mongoose.model('Image', imageSchema);