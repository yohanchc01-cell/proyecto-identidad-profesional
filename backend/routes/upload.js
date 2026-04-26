const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  const isPDF = file.mimetype === "application/pdf" || file.originalname?.endsWith(".pdf");

  try {
    let finalPath = file.path;
    
    // Cloudinary necesita la extensión .pdf en los archivos raw para servirlos con el Content-Type correcto
    if (isPDF) {
      finalPath = `${file.path}.pdf`;
      fs.renameSync(file.path, finalPath);
    }

    const result = await cloudinary.uploader.upload(finalPath, {
      resource_type: isPDF ? "raw" : "auto",
      folder: "portafolio"
    });

    // Limpiar el archivo temporal
    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path); // por si acaso

    res.json({ url: result.secure_url });
  } catch (err) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    res.status(500).json({ error: "Error al subir archivo" });
  }
});

module.exports = router;