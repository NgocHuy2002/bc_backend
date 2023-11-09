// models/contract.js
const mongoose = require("mongoose");

const publicSchema = new mongoose.Schema(
  {
    name: String,
    createdTime: Date,
    test: Object,
    sendBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PublicContract", publicSchema);
