const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const skillRoutes = require("./routes/skills");
const assignmentRoutes = require("./routes/assignments");
const courseRoutes = require("./routes/courses");
const activityRoutes = require("./routes/activities");
const uploadRoutes = require("./routes/upload");
const Activity = require("./models/Activity");
const Course = require("./models/Course");

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

// ⚡ Ping endpoint — respuesta instantánea para keepalive (sin BD)
app.get("/ping", (req, res) => res.json({ status: "ok", ts: Date.now() }));

// 📊 Dashboard combinado — cursos + actividades + promedios en UNA sola llamada
app.get("/api/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [courses, activities] = await Promise.all([
      Course.find({ userId }),
      Activity.find({ userId })
    ]);

    // Calcular promedio por curso en el servidor
    const coursesWithAvg = courses.map(c => {
      const cId = c._id.toString();
      const courseActs = activities.filter(a => (a.cursoId || "").toString() === cId);
      const valid = courseActs.filter(a => a.calificacion != null && a.calificacion !== "");
      const avg = valid.length
        ? (valid.reduce((sum, a) => sum + Number(a.calificacion), 0) / valid.length).toFixed(1)
        : null;
      return { ...c.toObject(), promedio: avg };
    });

    res.json({ courses: coursesWithAvg, activities });
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo dashboard" });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado ✅"))
  .catch(err => console.log("Error Mongo ❌", err));

app.get("/", (req, res) => {
  res.send("API v2 ACTIVE 🚀⚡");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});