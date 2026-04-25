const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  pedagogia: { type: Number, default: 0 },
  anatomia: { type: Number, default: 0 },
  planificacion: { type: Number, default: 0 },
  primerosAuxilios: { type: Number, default: 0 },
  liderazgoEquipo: { type: Number, default: 0 },
  evaluacionFisica: { type: Number, default: 0 },
  eticaDeportiva: { type: Number, default: 0 }
});

module.exports = mongoose.model("Skill", skillSchema);