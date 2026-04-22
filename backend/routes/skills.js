const express = require("express");
const Skill = require("../models/Skill");

const router = express.Router();

// Obtener habilidades del usuario
router.get("/:userId", async (req, res) => {
  const data = await Skill.findOne({ userId: req.params.userId });
  res.json(data);
});

// Crear o actualizar habilidades
router.post("/", async (req, res) => {
  const { userId, ...skills } = req.body;

  const updated = await Skill.findOneAndUpdate(
    { userId },
    skills,
    { upsert: true, new: true }
  );

  res.json(updated);
});

module.exports = router;