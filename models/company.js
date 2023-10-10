// models/user.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  username: String,
  email: String,
  name:String,
  password: String,
  publicKey: String, // Store the public key as a string
  privateKey: String, // Store the private key as a string
  isDelete: {type: Boolean, default: false},
  role: {type: String, default: "admin"},
  // ...other user fields
},{
  timestamps: true,
});

module.exports = mongoose.model('Company', companySchema);
