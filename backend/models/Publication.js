const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  tipo: { type: String, enum: ['video', 'articulo'], required: true },
  contenido: { type: String, required: true }, // Puede ser una URL de youtube o el cuerpo de un artículo
  fecha: { type: Date, default: Date.now },
  autorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Publication", publicationSchema);
