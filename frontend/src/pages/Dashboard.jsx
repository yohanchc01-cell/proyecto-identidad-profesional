import { useEffect, useState } from "react";
import axios from "axios";
import RadarChartComponent from "../components/RadarChart";

export default function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);

  const [newCourse, setNewCourse] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    calificacion: "",
    habilidades: []
  });

  const [file, setFile] = useState(null);

  // 🔥 CARGAR DATOS
  useEffect(() => {
    fetchCourses();
    fetchActivities();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get(
      `https://proyecto-identidad-profesional.onrender.com/api/courses/${user._id}`
    );
    setCourses(res.data);
  };

  const fetchActivities = async () => {
    const res = await axios.get(
      `https://proyecto-identidad-profesional.onrender.com/api/activities/${user._id}`
    );
    setActivities(res.data);
  };

  // 🔹 CREAR CURSO
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

  // 🔹 SUBIR ACTIVIDAD + PDF
  const uploadActivity = async () => {

    if (!file) return alert("Selecciona un PDF");
    if (!selectedCourse) return alert("Selecciona un curso");

    const data = new FormData();
    data.append("file", file);

    const upload = await axios.post(
      "https://proyecto-identidad-profesional.onrender.com/api/upload",
      data
    );

    await axios.post(
      "https://proyecto-identidad-profesional.onrender.com/api/activities",
      {
        nombre: form.nombre,
        calificacion: Number(form.calificacion),
        habilidades: form.habilidades,
        cursoId: selectedCourse,
        userId: user._id,
        pdfUrl: upload.data.url
      }
    );

    // reset
    setForm({ nombre: "", calificacion: "", habilidades: [] });
    setFile(null);

    fetchActivities();
  };

  // 🔥 CALCULAR RADAR DINÁMICO
  const skills = {
    comunicacion: [],
    liderazgo: [],
    trabajoEquipo: [],
    creatividad: [],
    resolucion: []
  };

  activities.forEach(a => {
    a.habilidades.forEach(h => {
      if (skills[h]) {
        skills[h].push(a.calificacion);
      }
    });
  });

  const radarData = Object.keys(skills).map(k => ({
    subject: k,
    value: skills[k].length
      ? skills[k].reduce((a, b) => a + b, 0) / skills[k].length
      : 0
  }));

  // 🔴 LOGOUT
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

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Perfil Profesional</h3>
          <p className="text-gray-600">
            Estudiante de licenciatura en educación física y deporte,
            con enfoque en desarrollo integral, liderazgo, trabajo en equipo
            y fortalecimiento de habilidades motrices y pedagógicas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="mb-2 font-semibold">Mapa de Competencias</h3>
          <RadarChartComponent data={radarData} />
        </div>

      </div>

      {/* CURSOS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Cursos</h2>

        <div className="flex gap-2">
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

        <ul className="mt-4 text-gray-700">
          {courses.map(c => (
            <li key={c._id}>• {c.nombre}</li>
          ))}
        </ul>
      </div>

      {/* SUBIR ACTIVIDAD */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-xl font-semibold mb-3">Subir actividad</h2>

        <input
          placeholder="Nombre actividad"
          className="border p-2 w-full mb-2"
          onChange={(e)=>setForm({...form, nombre:e.target.value})}
        />

        <input
          placeholder="Calificación (0-5)"
          className="border p-2 w-full mb-2"
          onChange={(e)=>setForm({...form, calificacion:e.target.value})}
        />

        <select
          className="border p-2 w-full mb-2"
          onChange={(e)=>setSelectedCourse(e.target.value)}
        >
          <option>Selecciona curso</option>
          {courses.map(c=>(
            <option key={c._id} value={c._id}>{c.nombre}</option>
          ))}
        </select>

        {/* habilidades */}
        <div className="mb-3">
          {["comunicacion","liderazgo","trabajoEquipo","creatividad","resolucion"].map(h=>(
            <label key={h} className="mr-3 text-sm">
              <input type="checkbox"
                onChange={(e)=>{
                  if(e.target.checked){
                    setForm({...form, habilidades:[...form.habilidades,h]});
                  }
                }}
              />
              {h}
            </label>
          ))}
        </div>

        <input type="file" onChange={(e)=>setFile(e.target.files[0])} />

        <br/><br/>

        <button
          onClick={uploadActivity}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Subir actividad
        </button>

      </div>

      {/* ACTIVIDADES */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-3">Actividades subidas</h2>

        {activities.map(a => (
          <div key={a._id} className="border p-3 mb-2 rounded">

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

          </div>
        ))}

      </div>

    </div>
  );
}