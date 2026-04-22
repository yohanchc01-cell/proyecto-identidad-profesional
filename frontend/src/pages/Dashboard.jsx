import RadarChartComponent from "../components/RadarChart";
import { analyzeSkills } from "../utils/aiAnalysis";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [analysis, setAnalysis] = useState(null);

  const generatePDF = async () => {
    const element = document.getElementById("pdf-content");

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
    pdf.save("perfil_profesional.pdf");
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(
          `https://proyecto-identidad-profesional.onrender.com/api/skills/${user._id}`
        );

        const result = analyzeSkills(res.data || {});
        setAnalysis(result);
      } catch (error) {
        console.log("Error obteniendo skills", error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div id="pdf-content" className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Bienvenido {user?.nombre} ({user?.role})
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>

          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Descargar PDF
          </button>
        </div>
      </div>

      {/* PERFIL PROFESIONAL */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Perfil Profesional</h2>
        <p className="text-gray-600">
          Estudiante en formación con habilidades en desarrollo, trabajo en equipo y pensamiento crítico.
          Interesado en el crecimiento profesional y la mejora continua.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-6">

        {/* HABILIDADES */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Habilidades</h3>
          <ul className="text-gray-600 space-y-2">
            <li>✔ Comunicación</li>
            <li>✔ Liderazgo</li>
            <li>✔ Trabajo en equipo</li>
            <li>✔ Creatividad</li>
            <li>✔ Resolución de problemas</li>
          </ul>
        </div>

        {/* RADAR */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3 text-center">
            Mapa de Competencias
          </h3>

          <div className="w-full h-[400px] flex justify-center items-center">
            <RadarChartComponent />
          </div>
        </div>

      </div>

      {/* ANÁLISIS IA */}
      {analysis && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">🧠 Análisis Inteligente</h3>

          <p>Comunicación: <b>{analysis.comunicacion}</b></p>
          <p>Liderazgo: <b>{analysis.liderazgo}</b></p>
          <p>Trabajo en equipo: <b>{analysis.trabajoEquipo}</b></p>
          <p>Creatividad: <b>{analysis.creatividad}</b></p>
          <p>Resolución: <b>{analysis.resolucion}</b></p>
        </div>
      )}

      {/* NUEVOS MÓDULOS */}
      <div className="grid grid-cols-2 gap-6 mt-6">

        {/* PROYECTOS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">🚀 Proyectos recomendados</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Sistema web de gestión académica</li>
            <li>• App móvil de seguimiento de hábitos</li>
            <li>• Plataforma de análisis de datos</li>
          </ul>
        </div>

        {/* OPORTUNIDADES */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">🌟 Oportunidades destacadas</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Convocatoria prácticas profesionales</li>
            <li>• Curso avanzado en desarrollo web</li>
            <li>• Hackathon universitario</li>
          </ul>
        </div>

      </div>

    </div>
  );
}