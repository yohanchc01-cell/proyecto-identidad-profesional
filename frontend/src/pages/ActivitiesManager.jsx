import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function ActivitiesManager() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ id: null, seconds: 0 });
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nombre: "",
    cursoId: "",
    habilidades: [],
    calificacion: "",
    pdfUrl: ""
  });

  const skillsList = [
    { id: "comunicacion", name: "Comunicación y Escucha Activa" },
    { id: "liderazgo", name: "Liderazgo y Motivación" },
    { id: "adaptabilidad", name: "Adaptabilidad y Resolución de Problemas" },
    { id: "gestionDeportiva", name: "Gestión Deportiva" },
    { id: "trabajoEquipo", name: "Trabajo en equipo" },
  ];

  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [cRes, aRes] = await Promise.all([
      axios.get(`${API_URL}/courses/${user._id}`),
      axios.get(`${API_URL}/activities/user/${user._id}`)
    ]);
    setCourses(cRes.data);
    setActivities(aRes.data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/upload`, fd);
      setFormData({ ...formData, pdfUrl: res.data.url });
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (id) => {
    let newSkills = [...formData.habilidades];
    if (newSkills.includes(id)) {
      newSkills = newSkills.filter(s => s !== id);
    } else {
      if (newSkills.length >= 3) return alert("Máximo 3 habilidades");
      newSkills.push(id);
    }
    setFormData({ ...formData, habilidades: newSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = true;
    if (!formData.cursoId) newErrors.cursoId = true;
    if (formData.habilidades.length < 1) newErrors.habilidades = true;
    if (!formData.calificacion) newErrors.calificacion = true;
    if (!formData.pdfUrl) newErrors.pdfUrl = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return alert("⚠️ Por favor completa todos los campos marcados en rojo, incluyendo la subida del PDF.");
    }

    setErrors({});
    await axios.post(`${API_URL}/activities`, { ...formData, userId: user._id });
    setFormData({ nombre: "", cursoId: "", habilidades: [], calificacion: "", pdfUrl: "" });
    fetchData();
    alert("Actividad creada ✅");
    window.dispatchEvent(new CustomEvent("activityUpdated"));
  };

  const deleteActivity = async (id) => {
    if (confirmDelete.id !== id) {
      setConfirmDelete({ id, seconds: 4 });
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
    
    await axios.delete(`${API_URL}/activities/${id}`);
    setConfirmDelete({ id: null, seconds: 0 });
    fetchData();
    window.dispatchEvent(new CustomEvent("activityUpdated"));
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-primary-dark mb-6">Mis Actividades y Evidencias</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-soft mb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Actividad</label>
            <input 
              className={`w-full bg-gray-50 p-4 rounded-2xl outline-none transition-all ${errors.nombre ? 'ring-2 ring-red-500 bg-red-50' : 'focus:ring-2 focus:ring-primary'}`}
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
              placeholder="Ej: Análisis de Táctica"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Curso / Materia</label>
            <select 
              className={`w-full bg-gray-50 p-4 rounded-2xl outline-none transition-all ${errors.cursoId ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
              value={formData.cursoId}
              onChange={e => setFormData({...formData, cursoId: e.target.value})}
            >
              <option value="">Selecciona un curso</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className={`p-6 rounded-3xl transition-all ${errors.habilidades ? 'ring-2 ring-red-500 bg-red-50' : 'bg-gray-50'}`}>
          <label className="block text-sm font-bold text-gray-700 mb-2">Habilidades Desarrolladas (1-3) <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-2">
            {skillsList.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSkill(s.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  formData.habilidades.includes(s.id) ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
          {errors.habilidades && <p className="text-[10px] text-red-500 font-bold mt-2">Selecciona al menos una habilidad obligatoriamente.</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Calificación (1-5)</label>
            <input 
              type="number" min="1" max="5" step="0.1"
              className={`w-full bg-gray-50 p-4 rounded-2xl outline-none transition-all ${errors.calificacion ? 'ring-2 ring-red-500 bg-red-50' : 'focus:ring-2 focus:ring-primary'}`}
              value={formData.calificacion}
              onChange={e => setFormData({...formData, calificacion: e.target.value})}
              placeholder="Ej: 4.5"
            />
          </div>
          <div className={`p-4 rounded-3xl border-2 border-dashed transition-all ${errors.pdfUrl ? 'border-red-500 bg-red-50' : formData.pdfUrl ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <label className="block text-sm font-bold text-gray-700 mb-2">Evidencia PDF (Obligatorio)</label>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
            {loading && <p className="text-xs text-primary animate-pulse mt-2">Subiendo a la nube...</p>}
            {formData.pdfUrl && <p className="text-xs text-green-600 font-bold mt-2">Evidencia lista para guardar ✅</p>}
          </div>
        </div>

        <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-primary-dark transition-all">
          Guardar Actividad
        </button>
      </form>

      <div className="space-y-4">
        {activities.map(a => (
          <div key={a._id} className="bg-white p-6 rounded-3xl shadow-soft flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">{a.nombre}</h3>
              <p className="text-xs text-gray-400">Calificación: {a.calificacion} • {a.habilidades?.length} habilidades</p>
            </div>
            <div className="flex gap-4 items-center">
              {a.pdfUrl && <a href={a.pdfUrl} target="_blank" className="text-primary text-sm font-bold">Ver PDF</a>}
              <button 
                onClick={() => deleteActivity(a._id)} 
                className={`text-sm font-bold transition-all duration-300 ${confirmDelete.id === a._id ? 'bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg scale-105' : 'text-red-400 hover:text-red-600'}`}
              >
                {confirmDelete.id === a._id ? `¿Borrar? (${confirmDelete.seconds}s)` : 'Eliminar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
