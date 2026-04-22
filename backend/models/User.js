const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  documento: String, // 🆕
  nombre: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "estudiante"
  }
});

module.exports = mongoose.model("User", userSchema);