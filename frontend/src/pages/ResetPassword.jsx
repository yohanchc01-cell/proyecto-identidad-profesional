import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || "Contraseña restablecida correctamente.");
      setSuccess(true);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error al restablecer la contraseña. Es posible que el enlace haya expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light p-4">
      <div className="bg-white p-10 rounded-3xl shadow-medium w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white text-2xl font-bold">PI</div>
          <h1 className="text-3xl font-bold text-primary-dark">Nueva Contraseña</h1>
          <p className="text-gray-500 mt-2">Crea una nueva contraseña segura</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-600 p-4 rounded-xl font-bold mb-6">
              ¡Tu contraseña se ha cambiado correctamente!
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-[1.01]"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nueva Contraseña</label>
              <input
                type="password"
                required
                className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Confirmar Contraseña</label>
              <input
                type="password"
                required
                className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-4 rounded-2xl font-bold shadow-lg transition-all transform hover:scale-[1.01] ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'}`}
            >
              {loading ? "Guardando..." : "Guardar Contraseña"}
            </button>
          </form>
        )}

        {!success && message && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold bg-red-50 text-red-600`}>
            {message}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            <Link to="/login" className="text-primary font-bold hover:underline">Cancelar y volver</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
