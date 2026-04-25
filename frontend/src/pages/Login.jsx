import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data || "Error al iniciar sesión ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light p-4">
      <div className="bg-white p-10 rounded-3xl shadow-medium w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white text-2xl font-bold">PI</div>
          <h1 className="text-3xl font-bold text-primary-dark">Bienvenido</h1>
          <p className="text-gray-500 mt-2">Gestiona tu identidad profesional</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="tu@correo.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Contraseña</label>
            <input
              type="password"
              required
              className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-[1.01]"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            ¿No tienes cuenta? <Link to="/register" className="text-primary font-bold hover:underline">Regístrate ahora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}