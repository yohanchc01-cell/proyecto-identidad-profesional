import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message || "Revisa tu bandeja de entrada.");
    } catch (error) {
      setMessage(error.response?.data?.error || "Error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light p-4">
      <div className="bg-white p-10 rounded-3xl shadow-medium w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white text-2xl font-bold">PI</div>
          <h1 className="text-3xl font-bold text-primary-dark">Recuperar Contraseña</h1>
          <p className="text-gray-500 mt-2">Ingresa tu correo para recibir un enlace seguro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-4 rounded-2xl font-bold shadow-lg transition-all transform hover:scale-[1.01] ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'}`}
          >
            {loading ? "Enviando..." : "Enviar Enlace"}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold ${message.includes('Error') || message.includes('No existe') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            <Link to="/login" className="text-primary font-bold hover:underline">← Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
