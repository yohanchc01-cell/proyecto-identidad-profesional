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

router.get("/user/:userId", async (req, res) => {
  try {
    const activities = await Activity.find({
      userId: req.params.userId
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo actividades" });
  }
});
module.exports = router;