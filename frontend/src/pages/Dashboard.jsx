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

  // 🔥 cargar datos
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

  // crear curso
  const createCourse = async () => {
    await axios.post(
      "https://proyecto-identidad-profesional.onrender.com/api/courses",
      {
        nombre: newCourse,
        userId: user._id
      }
    );

    fetchCourses();
  };

  // subir actividad
  const uploadActivity = async () => {

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

    fetchActivities();
  };

  // 🔥 CALCULAR RADAR
  const skills = {
    comunicacion: [],
    liderazgo: [],
    trabajoEquipo: [],
    creatividad: [],
    resolucion: []
  };

  activities.forEach(a => {
    a.habilidades.forEach(h => {
      skills[h].push(a.calificacion);
    });
  });

  const radarData = Object.keys(skills).map(k => ({
    subject: k,
    value: skills[k].length
      ? skills[k].reduce((a,b)=>a+b,0)/skills[k].length
      : 0
  }));

  return (
    <div className="p-8">

      <h1 className="text-2xl mb-4">Dashboard</h1>

      {/* CURSOS */}
      <div className="mb-6">
        <h2>Crear curso</h2>
        <input onChange={(e)=>setNewCourse(e.target.value)} />
        <button onClick={createCourse}>Crear</button>
      </div>

      {/* ACTIVIDAD */}
      <div className="mb-6">

        <h2>Subir actividad</h2>

        <input placeholder="Nombre"
          onChange={(e)=>setForm({...form, nombre: e.target.value})}
        /><br/>

        <input placeholder="Calificación"
          onChange={(e)=>setForm({...form, calificacion: e.target.value})}
        /><br/>

        <select onChange={(e)=>setSelectedCourse(e.target.value)}>
          <option>Selecciona curso</option>
          {courses.map(c=>(
            <option key={c._id} value={c._id}>{c.nombre}</option>
          ))}
        </select>

        <br/>

        {/* habilidades */}
        {["comunicacion","liderazgo","trabajoEquipo","creatividad","resolucion"].map(h=>(
          <label key={h}>
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

        <br/>

        <input type="file" onChange={(e)=>setFile(e.target.files[0])} />

        <br/>

        <button onClick={uploadActivity}>Subir</button>

      </div>

      {/* RADAR */}
      <RadarChartComponent data={radarData} />

    </div>
  );
}