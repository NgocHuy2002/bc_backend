// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  publicKey: String, // Store the public key as a string
  privateKey: String, // Store the private key as a string
  isDelete: {type: Boolean, default: false},
  role: String,
  // ...other user fields
});

module.exports = mongoose.model('User', userSchema);
