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


  // 🔥 AQUÍ VA LA IA (faltaba esto)
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/skills/${user._id}`
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

      {/* Título */}
      <h1 className="text-3xl font-bold mb-6">
        Bienvenido {user?.nombre}
      </h1>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="mb-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>

            <button
              onClick={generatePDF}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Descargar PDF
            </button>

      {/* Grid principal */}
      <div className="grid grid-cols-3 gap-6">

        {/* Perfil */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Perfil Profesional</h3>
          <p className="text-gray-600">
            Estudiante en formación con habilidades en desarrollo y trabajo en equipo.
          </p>
        </div>

        {/* Habilidades */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Habilidades</h3>
          <ul className="text-gray-600">
            <li>✔ Comunicación</li>
            <li>✔ Liderazgo</li>
            <li>✔ Resolución de problemas</li>
          </ul>
        </div>

        {/* Radar */}
        <div className="bg-white p-6 rounded-xl shadow flex justify-center items-center">
          <RadarChartComponent />
        </div>

      </div>

      {/* 🔥 NUEVA SECCIÓN IA */}
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

    </div>
  );
}