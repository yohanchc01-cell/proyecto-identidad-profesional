import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function CourseDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const res = await axios.get(
      `https://proyecto-identidad-profesional.onrender.com/api/activities/course/${id}`
    );
    setActivities(res.data);
  };

  const deleteActivity = async (activityId) => {
    await axios.delete(
      `https://proyecto-identidad-profesional.onrender.com/api/activities/${activityId}`
    );
    fetchActivities();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 bg-gray-500 text-white px-3 py-2 rounded"
      >
        ← Volver
      </button>

      <h1 className="text-2xl mb-6 font-bold">
        Actividades del curso
      </h1>

      {activities.map(a => (
        <div key={a._id} className="bg-white p-4 mb-3 rounded shadow">

          <p><b>{a.nombre}</b></p>
          <p>Nota: {a.calificacion}</p>

          <a
            href={a.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Ver PDF
          </a>

          <div className="mt-3 flex gap-2">

            <button className="bg-yellow-500 text-white px-3 py-1 rounded">
              Editar
            </button>

            <button
              onClick={() => deleteActivity(a._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}