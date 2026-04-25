const express = require("express");
const Assignment = require("../models/Assignment");
const User = require("../models/User");

const router = express.Router();


// 🔹 CREAR / ASIGNAR
router.post("/", async (req, res) => {
  const { title, description, type, userIds, assignToAll } = req.body;

  let assignedUsers = userIds;

  if (assignToAll) {
    const students = await User.find({});
    assignedUsers = students.map(s => s._id);
  }

  const newAssignment = await Assignment.create({
    title,
    description,
    type,
    assignedTo: assignedUsers
  });

  res.json(newAssignment);
});


// 🔹 OBTENER TODOS (DOCENTE)
router.get("/", async (req, res) => {
  const data = await Assignment.find().populate("assignedTo", "nombre email");
  res.json(data);
});


// 🔹 OBTENER POR ESTUDIANTE
router.get("/:userId", async (req, res) => {
  const data = await Assignment.find({
    assignedTo: req.params.userId
  });

  res.json(data);
});


// 🔹 EDITAR
router.put("/:id", async (req, res) => {
  const updated = await Assignment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});


// 🔹 ELIMINAR
router.delete("/:id", async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ message: "Eliminado" });
});

module.exports = router;