const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "auto"
  });

  res.json({ url: result.secure_url });
});

module.exports = router;