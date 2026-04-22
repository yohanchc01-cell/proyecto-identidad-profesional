const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  userId: String,
  comunicacion: Number,
  liderazgo: Number,
  trabajoEquipo: Number,
  creatividad: Number,
  resolucion: Number
});

module.exports = mongoose.model("Skill", skillSchema);