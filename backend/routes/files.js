const express = require("express");
const File = require("../models/File");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    res.set("Content-Type", file.mimetype);
    res.set("Content-Disposition", `inline; filename="${file.nombre}"`);
    res.send(file.data);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving file from DB" });
  }
});

module.exports = router;
