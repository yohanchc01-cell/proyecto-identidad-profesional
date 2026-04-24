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

module.exports = router;