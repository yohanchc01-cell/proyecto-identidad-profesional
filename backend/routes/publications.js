const express = require("express");
const Publication = require("../models/Publication");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const publications = await Publication.find().sort({ fecha: -1 }).populate('autorId', 'nombre');
    res.json(publications);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

router.post("/", async (req, res) => {
  const { titulo, tipo, contenido, autorId } = req.body;
  try {
    const pub = await Publication.create({ titulo, tipo, contenido, autorId });
    const populated = await pub.populate('autorId', 'nombre');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: "Error al crear publicación" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Publication.findByIdAndDelete(req.params.id);
    res.json({ message: "Publicación eliminada ✅" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar publicación" });
  }
});

router.put("/:id", async (req, res) => {
  const { titulo, tipo, contenido } = req.body;
  try {
    const pub = await Publication.findById(req.params.id);
    if (!pub) return res.status(404).json("No encontrado");
    
    pub.titulo = titulo || pub.titulo;
    pub.tipo = tipo || pub.tipo;
    pub.contenido = contenido || pub.contenido;
    
    await pub.save();
    const populated = await pub.populate('autorId', 'nombre');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar publicación" });
  }
});

module.exports = router;
