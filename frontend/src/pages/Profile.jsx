import { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    universidad: user?.universidad || "",
    carrera: user?.carrera || ""
  });
  
  const [msg, setMsg] = useState("");
  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/auth/user/${user._id || user.id}`, formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      setMsg("Perfil actualizado con éxito ✅");
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      console.error("Fallo de actualización:", error.response?.data || error.message);
      setMsg(`Error: ${error.response?.data || "Conexión fallida"} ❌`);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">Mi Perfil Profesional</h1>
        <p className="text-gray-500 mb-10">Mantén tu información académica actualizada para tu portafolio.</p>

        <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl shadow-soft space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
            <input 
              className="w-full bg-gray-50 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary text-gray-800 font-medium"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Universidad</label>
            <input 
              className="w-full bg-gray-50 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary text-gray-800 font-medium"
              value={formData.universidad}
              onChange={e => setFormData({...formData, universidad: e.target.value})}
              placeholder="Ej: Universidad de Antioquia"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Carrera / Programa</label>
            <input 
              className="w-full bg-gray-50 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary text-gray-800 font-medium"
              value={formData.carrera}
              onChange={e => setFormData({...formData, carrera: e.target.value})}
              placeholder="Ej: Licenciatura en Educación Física"
            />
          </div>

          <button className="w-full bg-[#5D5FEF] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#4a4cd9] transition-all cursor-pointer">
            Guardar Cambios
          </button>
          
          {msg && <p className="text-center text-sm font-bold text-indigo-600 animate-bounce">{msg}</p>}
        </form>
      </div>
    </Layout>
  );
}
