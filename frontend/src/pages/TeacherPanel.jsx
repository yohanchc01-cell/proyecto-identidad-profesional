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

  // 🔥 cargar datos
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

  // 🔹 eliminar estudiante
  const deleteStudent = async (id) => {
    await axios.delete(`https://proyecto-identidad-profesional.onrender.com/api/auth/${id}`);
    fetchStudents();
  };

  // 🔹 crear proyecto/oportunidad
  const createAssignment = async () => {
    await axios.post("https://proyecto-identidad-profesional.onrender.com/api/assignments", {
      ...form,
      userIds: [],
      assignToAll: false
    });
    fetchAssignments();
  };

  // 🔹 eliminar assignment
  const deleteAssignment = async (id) => {
    await axios.delete(`https://proyecto-identidad-profesional.onrender.com/api/assignments/${id}`);
    fetchAssignments();
  };

  // 🔹 asignar
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
        <button onClick={() => setView("students")} className="bg-gray-200 px-4 py-2 rounded">Editar estudiantes</button>
        <button onClick={() => setView("projects")} className="bg-gray-200 px-4 py-2 rounded">Proyectos / Oportunidades</button>
        <button onClick={() => setView("assign")} className="bg-gray-200 px-4 py-2 rounded">Asignar Proyecto/Oportunidad</button>
        <button onClick={() => setView("view")} className="bg-gray-200 px-4 py-2 rounded">Ver estudiante</button>
      </div>

      {/* ===================== 1. EDITAR ESTUDIANTES ===================== */}
      {view === "students" && (
        <div>
          <h2 className="text-2xl mb-4">Editar estudiantes</h2>

          {students.map(s => (
            <div key={s._id} className="bg-white p-4 mb-3 rounded shadow flex justify-between">

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

      {/* ===================== 2. PROYECTOS ===================== */}
      {view === "projects" && (
        <div>
          <h2 className="text-2xl mb-4">Proyectos / Oportunidades</h2>

          <input placeholder="Título"
            className="border p-2 w-full mb-2"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input placeholder="Descripción"
            className="border p-2 w-full mb-2"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            className="border p-2 w-full mb-2"
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="proyecto">Proyecto</option>
            <option value="oportunidad">Oportunidad</option>
          </select>

          <button
            onClick={createAssignment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Crear
          </button>

          <div className="mt-4">
            {assignments.map(a => (
              <div key={a._id} className="bg-white p-3 mb-2 rounded shadow flex justify-between">
                <div>
                  <b>{a.title}</b>
                  <p>{a.type}</p>
                </div>

                <button
                  onClick={() => deleteAssignment(a._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== 3. ASIGNAR ===================== */}
      {view === "assign" && (
        <div>
          <h2 className="text-2xl mb-4">Asignar</h2>

          <select
            className="border p-2 w-full mb-3"
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            <option>Selecciona proyecto u oportunidad</option>
            {assignments.map(a => (
              <option key={a._id} value={a._id}>
                {a.title} ({a.type})
              </option>
            ))}
          </select>

          <h3 className="mb-2">Estudiantes</h3>

          {students.map(s => (
            <label key={s._id} className="block">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStudents([...selectedStudents, s]);
                  } else {
                    setSelectedStudents(
                      selectedStudents.filter(st => st._id !== s._id)
                    );
                  }
                }}
              />
              <span className="ml-2">{s.nombre}</span>
            </label>
          ))}

          <label className="block mt-3">
            <input type="checkbox" onChange={(e) => setAssignAll(e.target.checked)} />
            <span className="ml-2">Asignar a todos</span>
          </label>

          <button
            onClick={assign}
            className="bg-green-600 text-white px-4 py-2 mt-3 rounded"
          >
            Asignar
          </button>
        </div>
      )}

      {/* ===================== 4. VER ESTUDIANTE ===================== */}
      {view === "view" && (
        <div>
          <h2 className="text-2xl mb-4">Ver estudiante</h2>

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
            <div className="mt-4 p-4 bg-white rounded shadow">
              <h3 className="text-xl">{selectedStudentView.nombre}</h3>
              <p>{selectedStudentView.email}</p>
              <p>Rol: {selectedStudentView.role}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

