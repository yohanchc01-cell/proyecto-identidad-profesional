const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const nodemailer = require("nodemailer");

const router = express.Router();

// Configuración de transporte (Ejemplo genérico para el usuario)
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io", // Ideal para pruebas gratuitas
  port: 2525,
  auth: {
    user: process.env.MAIL_USER || "user_placeholder",
    pass: process.env.MAIL_PASS || "pass_placeholder"
  }
});

router.post("/register", async (req, res) => {
  const { documento, nombre, email, password, universidad, carrera } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      documento,
      nombre,
      email,
      password: hash,
      universidad,
      carrera
    });

    res.json({ message: "Usuario registrado con éxito ✅", user });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar" });
  }
});

// RUTA TEMPORAL PARA LIMPIAR LA BASE DE DATOS
router.get("/nuke", async (req, res) => {
  await User.deleteMany({});
  res.send("<h1>Base de datos de usuarios LIMPIA 🧼</h1>");
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).json("Usuario no existe");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json("Contraseña incorrecta");

  const token = jwt.sign({ id: user._id }, "secret");

  res.json({
    token,
    user: {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      universidad: user.universidad,
      carrera: user.carrera,
      fotoUrl: user.fotoUrl
    }
  });
});

router.get("/students", async (req, res) => {
  const students = await User.find({});
  res.json(students);
});

router.delete("/user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado ✅" });
});

router.put("/user/:id", async (req, res) => {
  const { nombre, email, documento, universidad, carrera, fotoUrl } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("Usuario no encontrado");

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    user.documento = documento || user.documento;
    user.universidad = universidad || user.universidad;
    user.carrera = carrera || user.carrera;
    user.fotoUrl = fotoUrl || user.fotoUrl;

    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json("Error interno del servidor");
  }
});

module.exports = router;