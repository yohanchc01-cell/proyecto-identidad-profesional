import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    documento: "",
    universidad: "",
    carrera: "Educación Física y Entrenamiento Deportivo",
  });

  const navigate = useNavigate();
  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, form);
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert("Error al registrar ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light p-4">
      <div className="bg-white p-10 rounded-3xl shadow-medium w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-dark">Únete al Portafolio</h1>
          <p className="text-gray-500 mt-2">Personaliza tu éxito profesional</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            required
            className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="Documento de identidad"
            required
            className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setForm({ ...form, documento: e.target.value })}
          />
          <input
            type="text"
            placeholder="Universidad"
            required
            className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setForm({ ...form, universidad: e.target.value })}
          />
          <input
            type="text"
            placeholder="Carrera / Programa"
            required
            className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary"
            value={form.carrera}
            onChange={(e) => setForm({ ...form, carrera: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all mt-4"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-bold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
