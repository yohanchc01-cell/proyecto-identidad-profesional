import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RadarChartComponent from "../components/RadarChart";

export default function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");

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
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Bienvenido {user?.nombre}
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {/* PERFIL */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-2">Perfil Profesional</h3>
        <p className="text-gray-600">
          Estudiante de licenciatura en educación física y deporte,
          con habilidades en liderazgo, trabajo en equipo y desarrollo integral.
        </p>
      </div>

      {/* CURSOS */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">Cursos</h2>

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

        {/* LISTA */}
        {courses.map(c => (
          <div
            key={c._id}
            onClick={() => navigate(`/course/${c._id}`)}
            className="p-3 border mb-2 rounded cursor-pointer hover:bg-gray-100"
          >
            {c.nombre}
          </div>
        ))}

      </div>

    </div>
  );
}