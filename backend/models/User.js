const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  documento: String,
  nombre: String,
  email: String,
  password: String,
  universidad: String,
  carrera: String,
  fotoUrl: String,
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
});

module.exports = mongoose.model("User", userSchema);