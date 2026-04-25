import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [courseName, setCourseName] = useState("Curso");

  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  useEffect(() => {
    fetchActivities();
    fetchCourseInfo();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API_URL}/activities/course/${id}`);
      setActivities(res.data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const fetchCourseInfo = async () => {
    try {
      const res = await axios.get(`${API_URL}/courses/detail/${id}`);
      setCourseName(res.data.nombre);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const deleteActivity = async (activityId) => {
    if (!window.confirm("¿Eliminar esta evidencia?")) return;
    await axios.delete(`${API_URL}/activities/${activityId}`);
    fetchActivities();
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white p-3 rounded-2xl shadow-soft hover:bg-gray-50 transition-all text-primary font-bold"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-primary-dark">
          {courseName}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((a) => (
          <div key={a._id} className="bg-white p-8 rounded-3xl shadow-soft border border-indigo-50 hover:shadow-medium transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{a.nombre}</h3>
                <p className="text-sm font-semibold text-primary mt-1">Calificación: {a.calificacion}/5.0</p>
              </div>
              <div className="bg-indigo-50 px-3 py-1 rounded-lg text-xs font-bold text-primary uppercase">
                Evidencia
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {a.habilidades?.map(h => (
                <span key={h} className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                  {h}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              <a
                href={a.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-primary/10 text-primary px-6 py-2 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                Abrir PDF
              </a>

              <button
                onClick={() => deleteActivity(a._id)}
                className="text-red-400 hover:text-red-600 font-bold text-sm transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-medium italic">No hay actividades registradas en este curso.</p>
        </div>
      )}
    </Layout>
  );
}