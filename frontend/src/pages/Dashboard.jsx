import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RadarChartComponent from "../components/RadarChart";

export default function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");

  // 🔹 Radar vacío (luego lo conectamos dinámico)
  const radarData = [
    { subject: "Comunicación", value: 0 },
    { subject: "Liderazgo", value: 0 },
    { subject: "Trabajo en equipo", value: 0 },
    { subject: "Creatividad", value: 0 },
    { subject: "Resolución", value: 0 }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get(
      `https://proyecto-identidad-profesional.onrender.com/api/courses/${user._id}`
    );
    setCourses(res.data);
  };

  const createCourse = async () => {
    if (!newCourse) return alert("Escribe un nombre");

    await axios.post(
      "https://proyecto-identidad-profesional.onrender.com/api/courses",
      {
        nombre: newCourse,
        userId: user._id
      }
    );

    setNewCourse("");
    fetchCourses();
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Bienvenido {user?.nombre}
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {/* PERFIL + RADAR */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* PERFIL */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Perfil Profesional</h3>
          <p className="text-gray-600">
            Estudiante de licenciatura en educación física y deporte,
            con habilidades en liderazgo, trabajo en equipo y desarrollo integral.
          </p>
        </div>

        {/* RADAR */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Mapa de Competencias</h3>
          <RadarChartComponent data={radarData} />
        </div>

      </div>

      {/* CURSOS */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">Cursos</h2>

        {/* CREAR CURSO */}
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Nuevo curso"
            value={newCourse}
            className="border p-2 flex-1"
            onChange={(e) => setNewCourse(e.target.value)}
          />

          <button
            onClick={createCourse}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </div>

        {/* CURSOS EN TARJETAS */}
        <div className="grid grid-cols-3 gap-4">

          {courses.map(c => (
            <div
              key={c._id}
              onClick={() => navigate(`/course/${c._id}`)}
              className="bg-gray-50 p-6 rounded-xl shadow cursor-pointer hover:bg-blue-50 transition border"
            >
              <h3 className="text-lg font-semibold">{c.nombre}</h3>

              <p className="text-gray-500 mt-2">
                Ver actividades →
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}