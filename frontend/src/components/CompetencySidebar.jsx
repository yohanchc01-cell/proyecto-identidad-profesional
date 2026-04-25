import { useEffect, useState } from "react";
import axios from "axios";
import RadarChartComponent from "./RadarChart";

export default function CompetencySidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activities, setActivities] = useState([]);
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
    try {
      const res = await axios.get(`${API_URL}/activities/user/${user._id}`);
      setActivities(res.data);
    } catch (error) {
      console.log("Error sidebar", error);
    }
  };

  useEffect(() => {
    fetchActivities();
    // Listen for custom event to refresh when new activity is added
    window.addEventListener("activityUpdated", fetchActivities);
    return () => window.removeEventListener("activityUpdated", fetchActivities);
  }, []);

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

  const getRecommendation = () => {
    const sorted = [...radarData].sort((a, b) => a.value - b.value);
    const weakest = sorted.find(s => s.value > 0) || sorted[0];
    
    if (!weakest || weakest.value === 0) return "¡Comienza a registrar actividades para ver recomendaciones!";
    if (weakest.value > 4.5) return "¡Excelente desempeño general! Sigue manteniendo este nivel.";
    
    const tips = {
      comunicacion: "Intenta participar más en debates y ejercicios de oratoria.",
      liderazgo: "Asumir la capitanía en pequeños retos fortalecerá tu liderazgo.",
      adaptabilidad: "Prueba cambiar tus rutinas de entrenamiento para mejorar tu flexibilidad mental.",
      gestionDeportiva: "Leer sobre administración de clubes te daría una ventaja competitiva.",
      trabajoEquipo: "Fomenta la confianza delegando tareas importantes a tus compañeros."
    };
    return tips[weakest.subject] || "Sigue trabajando en tus habilidades.";
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span>📊</span> Mapa de Competencias
      </h3>
      
      <div className="bg-gray-50 rounded-3xl p-4 mb-6 border border-gray-100">
        <RadarChartComponent data={radarData} />
      </div>

      <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 mb-8">
        <h4 className="text-primary font-bold text-[10px] uppercase mb-1 flex items-center gap-1">
          <span>💡</span> Recomendación IA
        </h4>
        <p className="text-gray-700 text-xs italic leading-relaxed">"{getRecommendation()}"</p>
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
              <span className="text-xs font-black text-primary">{(s.value).toFixed(1)}</span>
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
