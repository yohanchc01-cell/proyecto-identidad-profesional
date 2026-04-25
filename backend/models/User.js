const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  documento: String,
  nombre: String,
  email: String,
  password: String,
  universidad: String,
  carrera: String
});

module.exports = mongoose.model("User", userSchema);