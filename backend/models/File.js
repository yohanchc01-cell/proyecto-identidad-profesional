const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  nombre: String,
  mimetype: String,
  data: Buffer
}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);
