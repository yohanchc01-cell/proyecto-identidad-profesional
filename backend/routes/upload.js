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
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: isPDF ? "raw" : "auto",
      folder: "portafolio"
    });

    // Limpiar el archivo temporal
    fs.unlink(file.path, () => {});

    res.json({ url: result.secure_url });
  } catch (err) {
    fs.unlink(file.path, () => {});
    res.status(500).json({ error: "Error al subir archivo" });
  }
});

module.exports = router;