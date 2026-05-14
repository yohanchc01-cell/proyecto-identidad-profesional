import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", email: "", documento: "", universidad: "", carrera: "", password: "", role: "" });
  const [confirmDelete, setConfirmDelete] = useState({ id: null, seconds: 0 });
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/students`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleDelete = async (userId) => {
    if (confirmDelete.id !== userId) {
      setConfirmDelete({ id: userId, seconds: 4 });
      const timer = setInterval(() => {
        setConfirmDelete(prev => {
          if (prev.seconds <= 1) {
            clearInterval(timer);
            return { id: null, seconds: 0 };
          }
          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);
      return;
    }

    try {
      await axios.delete(`${API_URL}/auth/user/${userId}`);
      setConfirmDelete({ id: null, seconds: 0 });
      fetchUsers();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || "",
      email: user.email || "",
      documento: user.documento || "",
      universidad: user.universidad || "",
      carrera: user.carrera || "",
      password: "", // Contraseña vacía por defecto al editar
      role: user.role || "student"
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password; // Solo enviar si se cambió
      await axios.put(`${API_URL}/auth/user/${editingUser._id}`, payload);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert("Error al guardar cambios");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-black mb-8 text-gray-800 dark:text-white">Panel de Administrador</h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-soft">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Gestión de Usuarios</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 dark:border-gray-700">
                  <th className="py-3 text-gray-500 font-bold uppercase text-xs">Nombre</th>
                  <th className="py-3 text-gray-500 font-bold uppercase text-xs">Email</th>
                  <th className="py-3 text-gray-500 font-bold uppercase text-xs">Rol</th>
                  <th className="py-3 text-gray-500 font-bold uppercase text-xs text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 text-sm font-bold text-gray-800 dark:text-white">{u.nombre}</td>
                    <td className="py-4 text-sm text-gray-600 dark:text-gray-300">{u.email}</td>
                    <td className="py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${u.role === 'admin' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role || 'student'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => handleEdit(u)} className="bg-folder-blue text-white text-xs px-3 py-1 rounded-lg mr-2 font-bold hover:scale-105 transition-all">Editar</button>
                      {u._id !== currentUser._id && (
                        <button onClick={() => handleDelete(u._id)} className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${confirmDelete.id === u._id ? 'bg-red-500 text-white shadow-lg scale-105' : 'bg-folder-red text-white hover:scale-105'}`}>
                          {confirmDelete.id === u._id ? `¿Borrar? (${confirmDelete.seconds}s)` : 'Eliminar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Edición */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold">✕</button>
              <h2 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">Editar Usuario</h2>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} placeholder="Nombre" className="w-full bg-gray-50 dark:bg-gray-700 border-none p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" required />
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" className="w-full bg-gray-50 dark:bg-gray-700 border-none p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" required />
                <input value={formData.documento} onChange={e => setFormData({...formData, documento: e.target.value})} placeholder="Documento" className="w-full bg-gray-50 dark:bg-gray-700 border-none p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                <input value={formData.universidad} onChange={e => setFormData({...formData, universidad: e.target.value})} placeholder="Universidad" className="w-full bg-gray-50 dark:bg-gray-700 border-none p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                <input value={formData.carrera} onChange={e => setFormData({...formData, carrera: e.target.value})} placeholder="Carrera" className="w-full bg-gray-50 dark:bg-gray-700 border-none p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 border-none p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none">
                  <option value="student">Estudiante</option>
                  <option value="admin">Administrador</option>
                </select>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-folder-red font-bold mb-2">Peligro: Cambio de Contraseña</p>
                  <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Nueva contraseña (dejar vacío para no cambiar)" className="w-full bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 border-none p-3 rounded-xl focus:ring-2 focus:ring-folder-red outline-none" />
                </div>
                <button type="submit" className="w-full bg-primary text-white p-3 rounded-xl font-bold mt-4 hover:scale-105 transition-transform">Guardar Cambios</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
