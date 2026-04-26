import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function CoursesManager() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({ id: null, seconds: 0 });
  
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

  const setStatus = async (id, newStatus) => {
    await axios.put(`${API_URL}/courses/${id}`, { estado: newStatus });
    fetchCourses();
  };

  const deleteCourse = async (id) => {
    if (confirmDelete.id !== id) {
      setConfirmDelete({ id, seconds: 4 });
      const timer = setInterval(() => {
        setConfirmDelete(prev => {
          if (prev.seconds <= 1) {
            clearInterval(timer);
            return { id: null, seconds: 0 };
          }
          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);
      return;
    }
    
    await axios.delete(`${API_URL}/courses/${id}`);
    setConfirmDelete({ id: null, seconds: 0 });
    fetchCourses();
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-dark mb-1">Gestión de Cursos</h1>
        <p className="text-sm text-gray-500 font-medium tracking-tight">Organiza tus materias y ciclos académicos.</p>
      </div>

      <div className="bg-white p-5 md:p-6 rounded-3xl shadow-soft mb-10 flex flex-col sm:flex-row gap-4">
        <input 
          className="flex-1 bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
          placeholder="Nombre de la nueva materia"
          value={newCourse}
          onChange={e => setNewCourse(e.target.value)}
        />
        <button onClick={createCourse} className="bg-primary text-white p-4 rounded-2xl font-bold shadow-lg text-sm sm:px-8">Añadir Curso</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-5 md:p-6 rounded-3xl shadow-soft border border-indigo-50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-800 leading-tight">{course.nombre}</h3>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md inline-block mt-2 ${(!course.estado || course.estado === 'activo') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {(!course.estado || course.estado === 'activo') ? 'Activo' : 'Finalizado'}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-between sm:justify-end border-t sm:border-none pt-3 sm:pt-0">
              <button 
                disabled={!course.estado || course.estado === 'activo'}
                onClick={() => setStatus(course._id, 'activo')} 
                className={`text-xs font-bold ${(!course.estado || course.estado === 'activo') ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:underline'}`}
              >
                Activar
              </button>
              
              <button 
                disabled={course.estado === 'finalizado'}
                onClick={() => setStatus(course._id, 'finalizado')} 
                className={`text-xs font-bold ${(course.estado === 'finalizado') ? 'text-gray-300 cursor-not-allowed' : 'text-orange-500 hover:underline'}`}
              >
                Finalizar
              </button>
              
              <button 
                onClick={() => deleteCourse(course._id)} 
                className={`text-xs font-bold transition-all duration-300 ${confirmDelete.id === course._id ? 'bg-red-500 text-white px-3 py-1 rounded-lg shadow-md' : 'text-red-300 hover:text-red-500'}`}
              >
                {confirmDelete.id === course._id ? `¿Borrar? (${confirmDelete.seconds}s)` : 'Eliminar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
