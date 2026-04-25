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

  useEffect(() => {
    if (!user) navigate("/login");
    fetchCourses();
    fetchActivities();
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
    } catch (e) {
      alert("❌ Error al subir");
    }
  };

  const skillsList = [
    { id: "pedagogia", name: "Pedagogía" },
    { id: "anatomia", name: "Anatomía" },
    { id: "planificacion", name: "Planificación" },
    { id: "primerosAuxilios", name: "1ros Auxilios" },
    { id: "liderazgoEquipo", name: "Liderazgo" },
    { id: "evaluacionFisica", name: "Evaluación" },
    { id: "eticaDeportiva", name: "Ética" },
  ];

  const calculateRadarData = () => {
    const map = {};
    skillsList.forEach(s => map[s.id] = []);
    
    activities.forEach(a => {
      a.habilidades?.forEach(h => {
        if (map[h]) map[h].push(Number(a.calificacion || 0));
      });
    });

    return skillsList.map(s => ({
      subject: s.id,
      value: map[s.id].length ? map[s.id].reduce((a, b) => a + b, 0) / map[s.id].length : 0
    }));
  };

  const radarData = calculateRadarData();

  // 🔥 Sistema de Recomendaciones
  const getRecommendation = () => {
    const sorted = [...radarData].sort((a, b) => a.value - b.value);
    const weakest = sorted[0];
    if (!weakest || weakest.value === 0) return "¡Comienza a registrar actividades para ver recomendaciones!";
    if (weakest.value > 4) return "¡Excelente desempeño general! Sigue manteniendo este nivel.";
    
    const tips = {
      pedagogia: "Podrías reforzar tus técnicas de enseñanza lúdica.",
      anatomia: "Repasar la biomecánica del movimiento te ayudaría en las evaluaciones.",
      planificacion: "Organizar mejor los microciclos optimizará el rendimiento de tus alumnos.",
      primerosAuxilios: "Es vital mantenerte actualizado en protocolos de RCP y trauma.",
      liderazgoEquipo: "Fomentar la comunicación asertiva mejorará la cohesión del grupo.",
      evaluacionFisica: "Usar más tests estandarizados daría mayor rigor a tus mediciones.",
      eticaDeportiva: "Recuerda siempre vincular los valores olímpicos en tus sesiones."
    };
    return tips[weakest.subject] || "Sigue trabajando en tus habilidades.";
  };

  const handleDownloadPDF = () => {
    window.print(); // Solución rápida y efectiva que respeta el nuevo Layout
  };

  const colors = ["bg-folder-red", "bg-folder-blue", "bg-folder-orange", "bg-folder-green"];

  return (
    <Layout>
      {/* Welcome Section */}
      <section className="mb-10">
        <div className="bg-white p-10 rounded-3xl flex items-center justify-between shadow-soft border border-indigo-50">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-4">Bienvenido, {user?.nombre}</h1>
            <p className="text-gray-500 mb-6 font-medium">
              Carrera: <span className="text-primary">{user?.carrera || "No definida"}</span> • 
              Universidad: <span className="text-primary">{user?.universidad || "No definida"}</span>
            </p>
            <div className="flex gap-4 no-print">
              <button className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:translate-y-[-2px] transition-all">
                Ver Mi Perfil
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
              <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center text-xl">
                {["🏀", "⚽", "🧠", "🚑"][idx % 4]}
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">{course.nombre}</h3>
                <p className="text-white/70 text-xs">Acceder al curso →</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Formulario Nueva Actividad */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-soft no-print">
          <h2 className="text-2xl font-bold mb-6">Registrar Actividad</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Nombre de la actividad"
              className="bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary"
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
            />
            <input
              placeholder="Calificación (0-5)"
              className="bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary"
              value={form.calificacion}
              onChange={e => setForm({...form, calificacion: e.target.value})}
            />
          </div>
          <select
            className="w-full bg-gray-50 border-none p-4 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
          >
            <option value="">Seleccionar Curso</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
          </select>
          
          <div className="mb-6">
            <p className="font-bold text-sm mb-3">Habilidades Evaluadas (1-3):</p>
            <div className="flex flex-wrap gap-2">
              {skillsList.map(s => (
                <label key={s.id} className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all border ${
                  form.habilidades.includes(s.id) ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                }`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.checked) {
                        if (form.habilidades.length < 3) setForm({...form, habilidades: [...form.habilidades, s.id]});
                        else { e.target.checked = false; alert("Máximo 3 habilidades"); }
                      } else {
                        setForm({...form, habilidades: form.habilidades.filter(h => h !== s.id)});
                      }
                    }}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input type="file" onChange={e => setFile(e.target.files[0])} className="flex-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary hover:file:bg-indigo-100 transition-all"/>
            <button onClick={uploadActivity} className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg">Guardar Actividad</button>
          </div>
        </div>

        {/* Resumen de Estadísticas / Radar */}
        <div className="bg-white p-8 rounded-3xl shadow-soft flex flex-col items-center">
          <h2 className="text-xl font-bold mb-6 text-center">Competencias Dominadas</h2>
          <RadarChartComponent data={radarData} />
          
          <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 w-full">
            <h4 className="text-primary font-bold text-xs uppercase mb-1">💡 Recomendación Inteligente</h4>
            <p className="text-gray-700 text-sm italic">"{getRecommendation()}"</p>
          </div>

          <div className="w-full mt-8 space-y-4">
            {radarData.slice(0, 3).map((s, i) => (
              <div key={s.subject} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-600">{skillsList.find(sl => sl.id === s.subject)?.name}</span>
                <span className="font-bold text-primary">{(s.value).toFixed(1)}/5.0</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}