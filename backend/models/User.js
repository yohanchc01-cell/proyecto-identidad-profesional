const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  documento: String,
  nombre: String,
  email: String,
  password: String,
  universidad: String,
  carrera: String,
  activo: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "estudiante"
  }
});

module.exports = mongoose.model("User", userSchema);