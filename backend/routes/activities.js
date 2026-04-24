const express = require("express");
const Activity = require("../models/Activity");

const router = express.Router();

// crear actividad
router.post("/", async (req, res) => {
  const activity = await Activity.create(req.body);
  res.json(activity);
});

// obtener por usuario
router.get("/:userId", async (req, res) => {
  const data = await Activity.find({ userId: req.params.userId });
  res.json(data);
});

module.exports = router;