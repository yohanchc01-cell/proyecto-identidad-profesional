import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import RadarChartComponent from "./RadarChart";

export default function CompetencySidebar({ courseIdFilter }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  const skillsList = [
    { id: "comunicacion", name: "Comunicación y Escucha Activa" },
    { id: "liderazgo", name: "Liderazgo y Motivación" },
    { id: "adaptabilidad", name: "Adaptabilidad y Resolución de Problemas" },
    { id: "gestionDeportiva", name: "Gestión Deportiva" },
    { id: "trabajoEquipo", name: "Trabajo en equipo" },
  ];

  const fetchActivities = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/activities/user/${user._id}`);
      setActivities(res.data);
    } catch (error) {
      console.log("Error sidebar", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // Listen for custom event to refresh when new activity is added
    window.addEventListener("activityUpdated", fetchActivities);
    return () => window.removeEventListener("activityUpdated", fetchActivities);
  }, []);

  const activeActivities = useMemo(() => {
    if (!courseIdFilter) return activities;
    return activities.filter(a => {
      const cId = a.cursoId?._id || a.cursoId;
      return cId === courseIdFilter;
    });
  }, [activities, courseIdFilter]);

  const radarData = useMemo(() => {
    const map = {};
    skillsList.forEach(s => map[s.id] = []);
    
    activeActivities.forEach(a => {
      a.habilidades?.forEach(h => {
        if (map[h]) map[h].push(Number(a.calificacion || 0));
      });
    });

    return skillsList.map(s => ({
      subject: s.id,
      value: map[s.id].length ? map[s.id].reduce((a, b) => a + b, 0) / map[s.id].length : 0
    }));
  }, [activeActivities]);

  const getRecommendation = () => {
    const active = radarData.filter(s => s.value > 0);
    if (active.length === 0) {
      return <span>🤖 <strong>¡Hola! Soy tu Asesor Virtual.</strong> Comienza a registrar tus actividades para empezar a evaluar tu perfil y darte retos personalizados.</span>;
    }
    
    const sorted = [...active].sort((a, b) => a.value - b.value);
    const weakest = sorted[0];
    const strongest = sorted[sorted.length - 1];
    const weakestName = skillsList.find(s=>s.id === weakest.subject)?.name || "";
    const strongestName = skillsList.find(s=>s.id===strongest.subject)?.name || "";
    
    if (weakest.value >= 4.5) {
      return <span>🌟 <strong>¡Nivel Élite!</strong> Todas tus competencias están sobresalientes. Destacas orgánicamente en <strong>{strongestName}</strong>. Tu nuevo reto es ser mentor y apoyar los procesos de otros estudiantes.</span>;
    }

    const shortFocus = {
      comunicacion: "ejercicios de oratoria y expresión asertiva",
      liderazgo: "asumir la capitanía o dirección de un grupo",
      adaptabilidad: "enfrentarte a situaciones de crisis imprevistas",
      gestionDeportiva: "logística y administración de recursos",
      trabajoEquipo: "cooperación masiva y en delegar tareas"
    }[weakest.subject] || "mejorar este punto";

    if (weakest.value < 3.8) {
      return <span>🚨 <strong>¡Cuidado!</strong> Tu habilidad comunicativa y dominio en <strong>{weakestName}</strong> está bajando ({weakest.value.toFixed(1)}/5). <strong>Te reto</strong> a que la próxima actividad que subas se enfoque netamente en {shortFocus}.</span>;
    }

    return <span>📈 Buen trabajo impulsado por tu <strong>{strongestName}</strong>, pero el punto de quiebre actual es <strong>{weakestName}</strong>. Dedícale tiempo a {shortFocus} para equilibrar tu diagrama de araña.</span>;
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span>📊</span> Mapa de Competencias
      </h3>
      
      <div className="bg-gray-50 rounded-3xl p-4 mb-6 border border-gray-100">
        <RadarChartComponent data={radarData} />
      </div>

      <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100/50 rounded-bl-full -z-10 group-hover:scale-150 transition-all"></div>
        <h4 className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="text-lg">🧠</span> Asesor Virtual IA
        </h4>
        <p className="text-gray-700 text-xs leading-relaxed">{getRecommendation()}</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Desglose de Nivel</h4>
        {radarData.map((s) => {
          const shortNames = {
            comunicacion: "Comunicación",
            liderazgo: "Liderazgo",
            adaptabilidad: "Adaptabilidad",
            gestionDeportiva: "Gestión Dep.",
            trabajoEquipo: "Trabajo Equipo"
          };
          return (
            <div key={s.subject} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-transparent hover:border-indigo-100 transition-all">
              <span className="text-[11px] font-bold text-gray-600">{shortNames[s.subject]}</span>
              {loading ? (
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
              ) : (
                <span className="text-xs font-black text-primary">{(s.value).toFixed(1)}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-100 items-center justify-center hidden xl:flex">
        <p className="text-[10px] text-gray-400 text-center italic">Sistema Inteligente de Identidad Profesional</p>
      </div>
    </div>
  );
}
