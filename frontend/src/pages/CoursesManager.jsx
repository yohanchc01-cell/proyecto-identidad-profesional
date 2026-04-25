import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function CoursesManager() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  
  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get(`${API_URL}/courses/${user._id}`);
    setCourses(res.data);
  };

  const createCourse = async () => {
    if (!newCourse.trim()) return;
    await axios.post(`${API_URL}/courses`, { nombre: newCourse.trim(), userId: user._id, estado: "activo" });
    setNewCourse("");
    fetchCourses();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "activo" ? "finalizado" : "activo";
    await axios.put(`${API_URL}/courses/${id}`, { estado: newStatus });
    fetchCourses();
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este curso? Se borrarán sus actividades.")) return;
    await axios.delete(`${API_URL}/courses/${id}`);
    fetchCourses();
  };

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">Gestión de Cursos</h1>
        <p className="text-gray-500">Organiza tus materias y ciclos académicos.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-soft mb-10 flex gap-4">
        <input 
          className="flex-1 bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nombre de la nueva materia / curso"
          value={newCourse}
          onChange={e => setNewCourse(e.target.value)}
        />
        <button onClick={createCourse} className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg">Crear Curso</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-6 rounded-3xl shadow-soft border border-indigo-50 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{course.nombre}</h3>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${course.estado === 'activo' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {course.estado || 'activo'}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleStatus(course._id, course.estado)} className="text-sm font-bold text-primary hover:underline">
                {course.estado === 'activo' ? 'Finalizar' : 'Activar'}
              </button>
              <button onClick={() => deleteCourse(course._id)} className="text-sm font-bold text-red-400 hover:text-red-600">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
