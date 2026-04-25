const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  nombre: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  estado: {
    type: String,
    default: "activo"
  }
});

module.exports = mongoose.model("Course", courseSchema);