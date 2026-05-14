const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const router = express.Router();

// Configuración de transporte (Ejemplo genérico para el usuario)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER || "ip.identidad.profesional@gmail.com",
    pass: process.env.MAIL_PASS || "adminIP1"
  }
});

router.post("/register", async (req, res) => {
  const { documento, nombre, email, password, universidad, carrera } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ errorCode: "EMAIL_EXISTS", error: "El correo ya está registrado" });
    }

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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No existe una cuenta con este correo" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    const resetUrl = `https://proyecto-identidad-profesional.vercel.app/reset-password/${token}`;
    
    const mailOptions = {
      from: '"Identidad Profesional" <ip.identidad.profesional@gmail.com>',
      to: user.email,
      subject: "Recuperación de Contraseña",
      text: `Hola ${user.nombre},\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace o pégalo en tu navegador:\n\n${resetUrl}\n\nSi no solicitaste esto, ignora este correo.\n`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Error al procesar la solicitud de recuperación" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "El token es inválido o ha expirado" });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al restablecer la contraseña" });
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
      fotoUrl: user.fotoUrl,
      role: user.role
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
  const { nombre, email, documento, universidad, carrera, fotoUrl, password, role } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("Usuario no encontrado");

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    user.documento = documento || user.documento;
    user.universidad = universidad || user.universidad;
    user.carrera = carrera || user.carrera;
    user.fotoUrl = fotoUrl || user.fotoUrl;
    if (role) user.role = role;

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
    }

    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json("Error interno del servidor");
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json("Error al eliminar usuario");
  }
});

module.exports = router;