const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  nombre: String,
  pdfUrl: String,
  calificacion: Number,

  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  habilidades: [String] // ["comunicacion", "liderazgo"]
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);
