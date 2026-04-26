const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const File = require("../models/File");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const isPDF = file.mimetype === "application/pdf" || file.originalname?.endsWith(".pdf");

  try {
    if (isPDF) {
      // 🚀 SOLUCIÓN BBDD: Guardar el PDF en MongoDB para evitar el bloqueo estricto de Cloudinary
      const fileData = fs.readFileSync(file.path);
      const newFile = await File.create({
        nombre: file.originalname,
        mimetype: "application/pdf",
        data: fileData
      });

      // Limpiar temporal
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

      // Devolver la nueva ruta interna
      return res.json({ url: `https://proyecto-identidad-profesional.onrender.com/api/files/${newFile._id}` });
    } else {
      // Usar Cloudinary solo para imágenes (fotos de perfil)
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "portafolio"
      });

      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.json({ url: result.secure_url });
    }
  } catch (err) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    res.status(500).json({ error: "Error al subir archivo" });
  }
});

module.exports = router;