import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    documento: "",
    nombre: "",
    email: "",
    password: "",
    role: "estudiante"
  });

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await axios.post("https://proyecto-identidad-profesional.onrender.com/api/auth/register", form);
        alert("Usuario registrado ✅");
        setIsRegister(false);
      } else {
        const res = await axios.post("https://proyecto-identidad-profesional.onrender.com/api/auth/login", {
          email: form.email,
          password: form.password
        });

        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);

        window.location.reload();
      }
    } catch (error) {
      alert("Error ❌");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-80">

        <h2 className="text-xl mb-4 text-center">
          {isRegister ? "Registro" : "Login"}
        </h2>

        {isRegister && (
          <>
            <input placeholder="Documento"
              className="border p-2 w-full mb-2"
              onChange={(e) => setForm({ ...form, documento: e.target.value })}
            />

            <input placeholder="Nombre"
              className="border p-2 w-full mb-2"
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />

            <select
              className="border p-2 w-full mb-2"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>
          </>
        )}

        <input placeholder="Correo"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input type="password" placeholder="Contraseña"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          {isRegister ? "Registrarse" : "Ingresar"}
        </button>

        <p
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-blue-600 mt-3 cursor-pointer text-center"
        >
          {isRegister ? "Ya tengo cuenta" : "Crear cuenta"}
        </p>

      </div>
    </div>
  );
}