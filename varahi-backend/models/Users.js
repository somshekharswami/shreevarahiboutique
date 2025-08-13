// models/Users.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid:  { type: String, required: true, unique: true },
  name: String,
  email:{ type: String, required: true },
  photoURL: String,
}, { timestamps: true });

// ✅ CommonJS export
module.exports = mongoose.model("User", userSchema);
