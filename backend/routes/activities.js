const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// 🔹 Crear actividad
router.post("/", async (req, res) => {
  const activity = await Activity.create(req.body);
  res.json(activity);
});

// 🔹 Obtener por curso
router.get("/course/:courseId", async (req, res) => {
  const data = await Activity.find({ cursoId: req.params.courseId });
  res.json(data);
});

// 🔹 Eliminar
router.delete("/:id", async (req, res) => {
  await Activity.findByIdAndDelete(req.params.id);
  res.json({ message: "Eliminado" });
});

module.exports = router;