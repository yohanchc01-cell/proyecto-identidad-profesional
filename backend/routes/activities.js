const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const Skill = require("../models/Skill");

// 🔹 Función para recalcular habilidades
const updateSkills = async (userId) => {
  const activities = await Activity.find({ userId });
  const skillsList = ["comunicacion", "liderazgo", "adaptabilidad", "gestionDeportiva", "trabajoEquipo"];
  
  const scores = {};
  skillsList.forEach(s => scores[s] = []);

  activities.forEach(a => {
    a.habilidades?.forEach(h => {
      if (scores[h]) scores[h].push(Number(a.calificacion));
    });
  });

  const finalScores = {};
  skillsList.forEach(s => {
    finalScores[s] = scores[s].length ? scores[s].reduce((a, b) => a + b, 0) / scores[s].length : 0;
  });

  await Skill.findOneAndUpdate({ userId }, finalScores, { upsert: true });
};

// 🔹 Crear actividad
router.post("/", async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    await updateSkills(req.body.userId);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: "Error al crear actividad" });
  }
});

// 🔹 Obtener por curso
router.get("/course/:courseId", async (req, res) => {
  const data = await Activity.find({ cursoId: req.params.courseId });
  res.json(data);
});

// 🔹 Editar actividad
router.put("/:id", async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await updateSkills(activity.userId);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: "Error al editar actividad" });
  }
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