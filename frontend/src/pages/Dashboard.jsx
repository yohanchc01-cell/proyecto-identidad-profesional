import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RadarChartComponent from "../components/RadarChart";

export default function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");

  const [selectedCourse, setSelectedCourse] = useState("");
  const [file, setFile] = useState(null);
  const [activities, setActivities] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    calificacion: "",
    habilidades: []
  });

  // 🔹 Radar base
  const radarData = [
    { subject: "Comunicación", value: 0 },
    { subject: "Liderazgo", value: 0 },
    { subject: "TrabajoEquipo", value: 0 },
    { subject: "Creatividad", value: 0 },
    { subject: "ResoluciónConflictos", value: 0 }
  ];

  const fetchActivities = async () => {
    const res = await axios.get(
      `https://proyecto-identidad-profesional.onrender.com/api/activities/user/${user._id}`
    );
    setActivities(res.data);
  };

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

  const createCourse = async () => {
    if (!newCourse || newCourse.trim() === "") {
      return alert("El nombre del curso es obligatorio ❌");
    }

    await axios.post(
      "https://proyecto-identidad-profesional.onrender.com/api/courses",
      {
        nombre: newCourse.trim(),
        userId: user._id
      }
    );

    setNewCourse("");
    fetchCourses();
  };

  // 🔥 CREAR ACTIVIDAD
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

    alert("Actividad creada ✅");

    setForm({ nombre: "", calificacion: "", habilidades: [] });
    setFile(null);
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

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-2 gap-6">

        {/* IZQUIERDA */}
        <div className="flex flex-col gap-6">

          {/* PERFIL */}
          <div className="bg-white p-6 rounded-xl shadow">
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

            {/* TARJETAS */}
            <div className="grid gap-3">
              {courses
                .filter(c => c.nombre && c.nombre.trim() !== "")
                .map(c => (
                  <div
                    key={c._id}
                    onClick={() => navigate(`/course/${c._id}`)}
                    className="p-4 border rounded cursor-pointer hover:bg-blue-50"
                  >
                    {c.nombre}
                  </div>
                ))}
            </div>

          </div>

        </div>

        {/* DERECHA */}
        <div className="flex flex-col gap-6">

          {/* MAPA */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Mapa de Competencias</h3>
            <RadarChartComponent data={radarData} />
          </div>

          {/* CREAR ACTIVIDAD */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-semibold mb-4">Crear Actividad</h2>

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

            {/* HABILIDADES */}
            <div className="mb-3">
              {["Comunicación","Liderazgo","TrabajoEquipo","Creatividad","ResoluciónConflictos"].map(h=>(
                <label key={h} className="mr-3 text-sm">
                  <input
                    type="checkbox"
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
              Guardar actividad
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}