const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { documento, nombre, email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    documento,
    nombre,
    email,
    password: hash,
    role: role || "estudiante" // 🔥 AQUÍ ESTÁ LA CLAVE
  });

  res.json(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).json("Usuario no existe");

  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) return res.status(400).json("Contraseña incorrecta");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "secret"
  );

  res.json({
    token,
    user: {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role
    }
  });
});

router.get("/students", async (req, res) => {
  const students = await User.find({ role: "estudiante" });
  res.json(students);
});

router.delete("/user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado ✅" });
});

router.put("/user/:id", async (req, res) => {
  const { nombre, email, role, documento } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { nombre, email, role, documento },
    { new: true }
  );

  res.json(user);
});

module.exports = router;