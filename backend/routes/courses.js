const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// crear curso
router.post("/", async (req, res) => {
  const course = await Course.create(req.body);
  res.json(course);
});

// obtener cursos por usuario
router.get("/:userId", async (req, res) => {
  const courses = await Course.find({ userId: req.params.userId });
  res.json(courses);
});

// obtener detalle de un curso
router.get("/detail/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.json(course);
});

// editar curso (activar/finalizar/renombrar)
router.put("/:id", async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(course);
});

// eliminar curso
router.delete("/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Curso eliminado ✅" });
});

module.exports = router;