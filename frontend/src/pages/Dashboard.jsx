import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherPanel() {

  const [view, setView] = useState("students");

  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "proyecto"
  });

  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [assignAll, setAssignAll] = useState(false);

  const [selectedStudentView, setSelectedStudentView] = useState(null);

  // 🔥 NUEVO: habilidades
  const [selectedStudentSkills, setSelectedStudentSkills] = useState(null);

  const [skillsForm, setSkillsForm] = useState({
    comunicacion: 0,
    liderazgo: 0,
    trabajoEquipo: 0,
    creatividad: 0,
    resolucion: 0
  });

  useEffect(() => {
    fetchStudents();
    fetchAssignments();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get("https://proyecto-identidad-profesional.onrender.com/api/auth/students");
    setStudents(res.data);
  };

  const fetchAssignments = async () => {
    const res = await axios.get("https://proyecto-identidad-profesional.onrender.com/api/assignments");
    setAssignments(res.data);
  };

  const deleteStudent = async (id) => {
    await axios.delete(`https://proyecto-identidad-profesional.onrender.com/api/auth/${id}`);
    fetchStudents();
  };

  const createAssignment = async () => {
    await axios.post("https://proyecto-identidad-profesional.onrender.com/api/assignments", {
      ...form,
      userIds: [],
      assignToAll: false
    });
    fetchAssignments();
  };

  const deleteAssignment = async (id) => {
    await axios.delete(`https://proyecto-identidad-profesional.onrender.com/api/assignments/${id}`);
    fetchAssignments();
  };

  const assign = async () => {
    await axios.put(
      `https://proyecto-identidad-profesional.onrender.com/api/assignments/${selectedAssignment}`,
      {
        assignedTo: assignAll
          ? students.map(s => s._id)
          : selectedStudents.map(s => s._id)
      }
    );

    alert("Asignado correctamente ✅");
  };

  // 🔥 NUEVO: guardar habilidades
  const saveSkills = async () => {
    await axios.put(
      `https://proyecto-identidad-profesional.onrender.com/api/skills/${selectedStudentSkills._id}`,
      skillsForm
    );

    alert("Habilidades actualizadas ✅");
  };

  return (
    <div className="p-8 text-lg">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Panel Docente</h1>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {/* MENU */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setView("students")}>Editar estudiantes</button>
        <button onClick={() => setView("skills")}>Valorar habilidades</button>
        <button onClick={() => setView("projects")}>Proyectos / Oportunidades</button>
        <button onClick={() => setView("assign")}>Asignar</button>
        <button onClick={() => setView("view")}>Ver estudiante</button>
      </div>

      {/* ===================== 1. EDITAR ESTUDIANTES ===================== */}
      {view === "students" && (
        <div>
          <h2>Editar estudiantes</h2>

          {students.map(s => (
            <div key={s._id} className="p-3 border mb-2 flex justify-between">
              <div>
                <p><b>{s.nombre}</b></p>
                <p>{s.email}</p>
              </div>

              <button
                onClick={() => deleteStudent(s._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ===================== 2. NUEVO: VALORAR HABILIDADES ===================== */}
      {view === "skills" && (
        <div>
          <h2 className="text-2xl mb-4">Valorar habilidades (0 - 100)</h2>

          <select
            className="border p-2 mb-4"
            onChange={(e) => {
              const student = students.find(s => s._id === e.target.value);
              setSelectedStudentSkills(student);
            }}
          >
            <option>Selecciona estudiante</option>
            {students.map(s => (
              <option key={s._id} value={s._id}>
                {s.nombre}
              </option>
            ))}
          </select>

          {selectedStudentSkills && (
            <div className="bg-white p-4 shadow rounded">

              {Object.keys(skillsForm).map(key => (
                <div key={key} className="mb-3">
                  <label className="block capitalize">{key}</label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillsForm[key]}
                    onChange={(e) =>
                      setSkillsForm({
                        ...skillsForm,
                        [key]: Number(e.target.value)
                      })
                    }
                  />

                  <span>{skillsForm[key]}</span>
                </div>
              ))}

              <button
                onClick={saveSkills}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Guardar habilidades
              </button>

            </div>
          )}
        </div>
      )}

      {/* ===================== 3. PROYECTOS ===================== */}
      {view === "projects" && (
        <div>
          <h2>Proyectos / Oportunidades</h2>
        </div>
      )}

      {/* ===================== 4. ASIGNAR ===================== */}
      {view === "assign" && (
        <div>
          <h2>Asignar</h2>
        </div>
      )}

      {/* ===================== 5. VER ESTUDIANTE ===================== */}
      {view === "view" && (
        <div>
          <h2>Ver estudiante</h2>

          {students.map(s => (
            <button
              key={s._id}
              onClick={() => setSelectedStudentView(s)}
              className="block border p-2 mb-2 w-full text-left"
            >
              {s.nombre}
            </button>
          ))}

          {selectedStudentView && (
            <div className="mt-4 p-4 bg-white shadow">
              <h3>{selectedStudentView.nombre}</h3>
              <p>{selectedStudentView.email}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}