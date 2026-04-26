import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RadarChartComponent from "../components/RadarChart";
import Layout from "../components/Layout";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [file, setFile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    calificacion: "",
    habilidades: []
  });

  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API_URL}/activities/user/${user._id}`);
      setActivities(res.data);
    } catch (error) {
      console.log("Error actividades", error);
    }
  };

  const fetchCourses = async () => {
    const res = await axios.get(`${API_URL}/courses/${user._id}`);
    setCourses(res.data);
  };

  const [userData, setUserData] = useState(user);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/students`);
      const found = res.data.find(u => u._id === user._id);
      if (found) {
        setUserData(found);
        localStorage.setItem("user", JSON.stringify(found));
      }
    } catch (e) {
      console.log("Error al refrescar usuario", e);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = new FormData();
      data.append("file", file);
      const upload = await axios.post(`${API_URL}/upload`, data);
      const res = await axios.put(`${API_URL}/auth/user/${user._id}`, { fotoUrl: upload.data.url });
      
      setUserData(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Foto de perfil actualizada ✅");
    } catch (err) {
      alert("Error al actualizar foto");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCourses();
    fetchActivities();
    fetchUser();
  }, []);

  const createCourse = async () => {
    if (!newCourse || newCourse.trim() === "") return alert("Nombre obligatorio");
    await axios.post(`${API_URL}/courses`, { nombre: newCourse.trim(), userId: user._id });
    setNewCourse("");
    fetchCourses();
  };

  const uploadActivity = async () => {
    if (!file || !selectedCourse) return alert("Faltan datos");

    const data = new FormData();
    data.append("file", file);

    try {
      const upload = await axios.post(`${API_URL}/upload`, data);
      await axios.post(`${API_URL}/activities`, {
        ...form,
        calificacion: Number(form.calificacion),
        cursoId: selectedCourse,
        userId: user._id,
        pdfUrl: upload.data.url
      });
      alert("✅ Guardado");
      setForm({ nombre: "", calificacion: "", habilidades: [] });
      setFile(null);
      fetchActivities();
      // Notificar a la barra lateral para actualizar los gráficos
      window.dispatchEvent(new CustomEvent("activityUpdated"));
    } catch (e) {
      alert("❌ Error al subir");
    }
  };

  const skillsList = [
    { id: "comunicacion", name: "Comunicación y Escucha Activa" },
    { id: "liderazgo", name: "Liderazgo y Motivación" },
    { id: "adaptabilidad", name: "Adaptabilidad y Resolución de Problemas" },
    { id: "gestionDeportiva", name: "Gestión Deportiva" },
    { id: "trabajoEquipo", name: "Trabajo en equipo" },
  ];

  const handleDownloadPDF = () => {
    window.print(); // Solución rápida y efectiva que respeta el nuevo Layout
  };

  const colors = ["bg-folder-red", "bg-folder-blue", "bg-folder-orange", "bg-folder-green"];

  const getCourseAverage = (courseId) => {
    const id = courseId?.toString();
    const courseActivities = activities.filter(a => (a.cursoId?._id || a.cursoId)?.toString() === id);
    if (courseActivities.length === 0) return "S/N";
    const valid = courseActivities.filter(a => a.calificacion !== undefined && a.calificacion !== null && a.calificacion !== "");
    if (valid.length === 0) return "S/N";
    const sum = valid.reduce((acc, curr) => acc + Number(curr.calificacion), 0);
    return (sum / valid.length).toFixed(1);
  };

  const dashboardStats = useMemo(() => {
    const radarData = skillsList.map(s => {
      const map = {};
      activities.forEach(a => {
        a.habilidades?.forEach(h => {
          if (!map[h]) map[h] = [];
          map[h].push(Number(a.calificacion || 0));
        });
      });
      return {
        subject: s.id,
        value: map[s.id]?.length ? map[s.id].reduce((a, b) => a + b, 0) / map[s.id].length : 0
      };
    });

    const sorted = [...radarData].sort((a, b) => b.value - a.value);
    const topSkill = sorted[0]?.value > 0 ? sorted[0].subject : "N/A";
    const valid = activities.filter(a => a.calificacion !== undefined && a.calificacion !== null && a.calificacion !== "");
    const avg = valid.length ? (valid.reduce((a, b) => a + Number(b.calificacion), 0) / valid.length).toFixed(1) : "0.0";

    return { topSkill, avg, total: activities.length, courses: courses.length };
  }, [activities, courses]);

  return (
    <Layout>
      {/* Welcome Section */}
      <section className="mb-8">
        <div className="bg-white p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between shadow-soft border border-indigo-50 relative overflow-hidden">
          <div className="max-w-xl z-10 text-center md:text-left">
            <h1 className="text-4xl font-black mb-4 text-gray-800">Bienvenido, {userData?.nombre}</h1>
            <p className="text-gray-500 mb-8 font-medium text-lg leading-relaxed">
              Carrera: <span className="text-primary font-bold">{userData?.carrera || "No definida"}</span> <br/>
              Universidad: <span className="text-primary font-bold">{userData?.universidad || "No definida"}</span>
            </p>
            <div className="flex flex-wrap gap-4 no-print justify-center md:justify-start">
              <button 
                onClick={() => navigate("/profile")}
                className="bg-[#5D5FEF] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                Actualizar Perfil
              </button>
              <button onClick={handleDownloadPDF} className="bg-gray-50 text-gray-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100">
                Descargar Portafolio
              </button>
            </div>
          </div>

          <div className="relative mt-8 md:mt-0 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full border-8 border-indigo-50 overflow-hidden shadow-2xl bg-gray-100 flex items-center justify-center relative group">
              {userData?.fotoUrl ? (
                <img src={userData.fotoUrl} alt="Foto Perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-7xl">👤</span>
              )}
              {/* Overlay para subir foto directamente */}
              <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-xs font-bold p-4 text-center">
                <span>➕</span>
                <span>Cambiar Foto</span>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>
            {!userData?.fotoUrl && (
              <label className="mt-4 text-primary text-xs font-bold uppercase tracking-wider cursor-pointer hover:underline">
                ➕ Agregar Imagen
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            )}
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-indigo-50 transform rotate-12">
              <span className="text-3xl">🎓</span>
            </div>
          </div>
        </div>
      </section>

      {/* Perfil Automatizado Inteligente */}
      <section className="mb-10 animate-fade-in">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Perfil Inteligente Automatizado</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-soft border-b-4 border-primary">
            <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Promedio General</p>
            <h4 className="text-3xl font-black text-gray-800">{dashboardStats.avg}</h4>
            <div className="mt-2 text-[10px] text-green-500 font-bold bg-green-50 px-2 py-1 rounded-lg w-fit">Desempeño Óptimo</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-soft border-b-4 border-folder-blue">
            <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Evidencias Cargadas</p>
            <h4 className="text-3xl font-black text-gray-800">{dashboardStats.total}</h4>
            <div className="mt-2 text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-1 rounded-lg w-fit">Progreso Registrado</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-soft border-b-4 border-folder-orange">
            <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Cursos Activos</p>
            <h4 className="text-3xl font-black text-gray-800">{dashboardStats.courses}</h4>
            <div className="mt-2 text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-lg w-fit">Materias en Curso</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-soft border-b-4 border-folder-green">
            <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Fortaleza Principal</p>
            <h4 className="text-sm font-black text-gray-800 uppercase truncate">{dashboardStats.topSkill !== 'N/A' ? (skillsList.find(s => s.id === dashboardStats.topSkill)?.name.split(' ')[0]) : 'S/N'}</h4>
            <div className="mt-2 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg w-fit">Punta de Lanza</div>
          </div>
        </div>
      </section>

      {/* Mis Cursos */}
      <section className="mb-10 no-print px-1 md:px-0">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-black text-gray-800">Mis Cursos</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              value={newCourse} 
              onChange={e => setNewCourse(e.target.value)}
              placeholder="Nueva materia..."
              className="bg-white border-none p-3 rounded-xl shadow-soft outline-none focus:ring-2 focus:ring-primary flex-1 sm:w-48 text-sm"
            />
            <button onClick={createCourse} className="bg-primary text-white px-5 py-3 rounded-xl font-bold shadow-soft transition-all active:scale-95">+</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <div 
              key={course._id}
              onClick={() => navigate(`/course/${course._id}`)}
              className={`${colors[idx % colors.length]} p-6 rounded-[2.5rem] text-white min-h-[180px] flex flex-col justify-between shadow-medium cursor-pointer hover:scale-[1.02] active:scale-95 transition-all`}
            >
              <div className="flex justify-between items-center">
                <div className="bg-white/20 w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                  {["🏀", "⚽", "🧠", "🚑"][idx % 4]}
                </div>
                <div className="bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  Promedio: {getCourseAverage(course._id)}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-xl md:text-2xl leading-tight mb-3 drop-shadow-md truncate">{course.nombre}</h3>
                <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-[10px] font-bold w-fit uppercase tracking-widest border border-white/10">
                  Ver Detalles
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </Layout>
  );
}