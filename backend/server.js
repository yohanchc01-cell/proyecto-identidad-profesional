const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const skillRoutes = require("./routes/skills");
const assignmentRoutes = require("./routes/assignments");
const courseRoutes = require("./routes/courses");
const activityRoutes = require("./routes/activities");
const uploadRoutes = require("./routes/upload");



require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/upload", uploadRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado ✅"))
  .catch(err => console.log("Error Mongo ❌", err));

app.get("/", (req, res) => {
  res.send("API v2 ACTIVE 🚀⚡");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});