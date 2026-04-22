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
        setAnalysis(analyzeSkills(res.data || {}));
      } catch (error) {
        console.log(error);
      }
    };

    fetchSkills();
  }, []);

    return (
    <div id="pdf-content" className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          👋 Hola, {user?.nombre}
          <span className="text-sm text-gray-500 ml-2">({user?.role})</span>
        </h1>

        <div className="flex gap-2">
          <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Descargar PDF
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* PERFIL + ANALISIS */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        {/* PERFIL */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">
            Perfil Profesional
          </h2>
          <p className="text-gray-600">
            Estudiante de Licenciatura en Educación Física y Deporte en formación integral, con interés en la promoción de estilos de vida saludables, el desarrollo de habilidades motrices y el bienestar físico de la población. Posee competencias en trabajo en equipo, liderazgo y planificación de actividades deportivas y recreativas. Se caracteriza por su compromiso, disciplina y capacidad para motivar a otros, contribuyendo al desarrollo físico, social y emocional de niños, jóvenes y adultos a través del deporte y la actividad física.
          </p>
        </div>

        {/* ANALISIS */}
        {analysis && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold mb-4 text-purple-600">
              🧠 Análisis Inteligente
            </h3>

            <div className="grid grid-cols-2 gap-2 text-gray-600 text-sm">
              <p>Comunicación: <b>{analysis.comunicacion}</b></p>
              <p>Liderazgo: <b>{analysis.liderazgo}</b></p>
              <p>Trabajo en equipo: <b>{analysis.trabajoEquipo}</b></p>
              <p>Creatividad: <b>{analysis.creatividad}</b></p>
              <p>Resolución: <b>{analysis.resolucion}</b></p>
            </div>
          </div>
        )}

      </div>

      {/* HABILIDADES + RADAR */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4 text-gray-700">
            Habilidades
          </h3>

          <ul className="space-y-3">
            {["Comunicación", "Liderazgo", "Trabajo en equipo", "Creatividad", "Resolución"].map((h, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-4 text-center text-gray-700">
            Mapa de Competencias
          </h3>

          <div className="h-[350px] flex justify-center items-center">
            <RadarChartComponent />
          </div>
        </div>

      </div>

      {/* EXTRA */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-3 text-green-600">
            🚀 Proyectos Destacados
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Diseño e implementación de un programa de actividad física para mejorar la salud en comunidades escolares.</li>
            <li>• Organización de eventos deportivos comunitarios para fomentar la inclusión y el trabajo en equipo</li>
            <li>• Creación de una escuela deportiva enfocada en el desarrollo de habilidades básicas en niños</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-semibold mb-3 text-yellow-600">
            🌟 Oportunidades Recomendadas
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Participación en ligas deportivas locales y programas de entrenamiento</li>
            <li>• Cursos y certificaciones en entrenamiento deportivo, recreación y actividad física</li>
            <li>• Participación en eventos académicos y deportivos como congresos, seminarios y torneos</li>
            <li>• Convocatorias para proyectos sociales enfocados en deporte y salud</li>
          </ul>
        </div>

      </div>

    </div>
  );
}