const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/identidad-profesional")
  .then(async () => {
    console.log("Conectado a MongoDB");

    const adminEmail = "admin@admin.com";
    const adminPassword = "admin";

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
        console.log("El administrador ya existe.");
    } else {
        const hash = await bcrypt.hash(adminPassword, 10);
        await User.create({
            documento: "0000000000",
            nombre: "Administrador General",
            email: adminEmail,
            password: hash,
            universidad: "Sistema",
            carrera: "Admin",
            role: "admin"
        });
        console.log(`Administrador creado con éxito: Correo: ${adminEmail} | Contraseña: ${adminPassword}`);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error conectando a Mongo:", err);
    process.exit(1);
  });
