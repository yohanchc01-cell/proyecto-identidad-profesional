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
  const { documento, nombre, email, password, role, universidad, carrera } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      documento,
      nombre,
      email,
      password: hash,
      universidad,
      carrera,
      role: role || "estudiante",
      activo: false // Requiere activación
    });

    // Envío de correo (Simulado/Base)
    const url = `http://localhost:3000/api/auth/activate/${user._id}`;
    await transporter.sendMail({
      from: '"Portafolio Inteligente" <noreply@portafolio.com>',
      to: email,
      subject: "Activa tu cuenta de Portafolio",
      html: `<h1>Hola ${nombre}</h1><p>Haz clic <a href="${url}">aquí</a> para activar tu cuenta y empezar tu portafolio de Educación Física.</p>`
    });

    res.json({ message: "Usuario registrado. Revisa tu correo para activar la cuenta. ✅", user });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar" });
  }
});

router.get("/activate/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { activo: true });
    res.send("<h1>Cuenta activada ✅</h1><p>Ya puedes iniciar sesión en la aplicación.</p>");
  } catch (error) {
    res.status(500).send("Error al activar");
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(404).json("Usuario no existe");
  if (!user.activo) return res.status(401).json("Cuenta no activada. Revisa tu correo. 📧");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json("Contraseña incorrecta");

  const token = jwt.sign({ id: user._id, role: user.role }, "secret");

  res.json({
    token,
    user: {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      universidad: user.universidad,
      carrera: user.carrera
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

// Actualización de usuario (Consolidada)
router.put("/user/:id", async (req, res) => {
  const { nombre, email, role, documento, universidad, carrera } = req.body;
  console.log("Petición update recibida para:", req.params.id, req.body);
  
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, email, role, documento, universidad, carrera },
      { new: true, runValidators: false }
    );
    
    if (!user) return res.status(404).json("Usuario no encontrado");
    
    console.log("Usuario actualizado con éxito ✅");
    res.json(user);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json("Error interno del servidor");
  }
});

module.exports = router;