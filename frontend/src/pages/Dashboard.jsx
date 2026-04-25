import { useEffect, useState } from "react";
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
    const courseActivities = activities.filter(a => a.cursoId === courseId);
    if (courseActivities.length === 0) return "S/N"; // Sin notas
    const sum = courseActivities.reduce((acc, curr) => acc + Number(curr.calificacion || 0), 0);
    return (sum / courseActivities.length).toFixed(1);
  };

  return (
    <Layout>
      {/* Welcome Section */}
      <section className="mb-10">
        <div className="bg-white p-10 rounded-3xl flex items-center justify-between shadow-soft border border-indigo-50">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-4">Bienvenido, {userData?.nombre}</h1>
            <p className="text-gray-500 mb-6 font-medium">
              Carrera: <span className="text-primary">{userData?.carrera || "No definida"}</span> • 
              Universidad: <span className="text-primary">{userData?.universidad || "No definida"}</span>
            </p>
            <div className="flex gap-4 no-print">
              <button 
                onClick={() => navigate("/profile")}
                className="bg-[#5D5FEF] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:translate-y-[-2px] transition-all cursor-pointer"
              >
                Actualizar Perfil
              </button>
              <button onClick={handleDownloadPDF} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                Descargar Portafolio
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-48 h-48 bg-indigo-50 rounded-full flex items-center justify-center">
            <span className="text-6xl">🎓</span>
          </div>
        </div>
      </section>

      {/* Mis Cursos */}
      <section className="mb-10 no-print">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mis Cursos</h2>
          <div className="flex gap-2">
            <input 
              value={newCourse} 
              onChange={e => setNewCourse(e.target.value)}
              placeholder="Nombre del curso"
              className="bg-white border-none p-3 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-primary w-48"
            />
            <button onClick={createCourse} className="bg-primary text-white px-4 py-2 rounded-xl font-bold">+</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <div 
              key={course._id}
              onClick={() => navigate(`/course/${course._id}`)}
              className={`${colors[idx % colors.length]} p-6 rounded-3xl text-white h-48 flex flex-col justify-between shadow-medium cursor-pointer hover:scale-[1.02] transition-all`}
            >
              <div className="flex justify-between items-start">
                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center text-xl">
                  {["🏀", "⚽", "🧠", "🚑"][idx % 4]}
                </div>
                <div className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold">
                  Promedio: {getCourseAverage(course._id)}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-2xl mb-2 drop-shadow-sm">{course.nombre}</h3>
                <div className="bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-xs font-bold w-fit hover:bg-white/50 transition-all">
                  Ver Actividades →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </Layout>
  );
}