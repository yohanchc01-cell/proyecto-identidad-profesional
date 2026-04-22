import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherPanel() {
  const [view, setView] = useState("students");

  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [editingStudent, setEditingStudent] = useState(null);

  // habilidades
  const [selectedStudentSkills, setSelectedStudentSkills] = useState(null);
  const [skillsForm, setSkillsForm] = useState({
    comunicacion: 0,
    liderazgo: 0,
    trabajoEquipo: 0,
    creatividad: 0,
    resolucion: 0,
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "proyecto",
  });

  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [assignAll, setAssignAll] = useState(false);

  const [selectedStudentView, setSelectedStudentView] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchAssignments();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get(
      "https://proyecto-identidad-profesional.onrender.com/api/auth/students"
    );
    setStudents(res.data);
  };

  const fetchAssignments = async () => {
    const res = await axios.get(
      "https://proyecto-identidad-profesional.onrender.com/api/assignments"
    );
    setAssignments(res.data);
  };

  // 🔹 eliminar estudiante
  const deleteStudent = async (id) => {
    await axios.delete(
      `https://proyecto-identidad-profesional.onrender.com/api/auth/${id}`
    );
    fetchStudents();
  };

  // 🔹 actualizar estudiante
  const updateStudent = async () => {
    await axios.put(
      `https://proyecto-identidad-profesional.onrender.com/api/auth/${editingStudent._id}`,
      {
        nombre: editingStudent.nombre,
        email: editingStudent.email,
      }
    );
    setEditingStudent(null);
    fetchStudents();
  };

  // 🔹 guardar habilidades
  const saveSkills = async () => {
    await axios.put(
      `https://proyecto-identidad-profesional.onrender.com/api/skills/${selectedStudentSkills._id}`,
      skillsForm
    );

    alert("Habilidades actualizadas ✅");
    setSelectedStudentSkills(null);
  };

  const createAssignment = async () => {
    await axios.post(
      "https://proyecto-identidad-profesional.onrender.com/api/assignments",
      {
        ...form,
        userIds: [],
        assignToAll: false,
      }
    );
    fetchAssignments();
  };

  const deleteAssignment = async (id) => {
    await axios.delete(
      `https://proyecto-identidad-profesional.onrender.com/api/assignments/${id}`
    );
    fetchAssignments();
  };

  const assign = async () => {
    await axios.put(
      `https://proyecto-identidad-profesional.onrender.com/api/assignments/${selectedAssignment}`,
      {
        assignedTo: assignAll
          ? students.map((s) => s._id)
          : selectedStudents.map((s) => s._id),
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
        <button onClick={() => setView("students")}>Editar estudiantes</button>
        <button onClick={() => setView("skills")}>
          Valorar habilidades
        </button>
        <button onClick={() => setView("projects")}>
          Proyectos / Oportunidades
        </button>
        <button onClick={() => setView("assign")}>Asignar</button>
        <button onClick={() => setView("view")}>Ver estudiante</button>
      </div>

      {/* ================= EDITAR ESTUDIANTES ================= */}
      {view === "students" && (
        <div>
          <h2>Editar estudiantes</h2>

          {students.map((s) => (
            <div key={s._id} className="p-3 border mb-2">
              <p>
                <b>{s.nombre}</b> - {s.email}
              </p>

              <button onClick={() => setEditingStudent(s)}>
                Editar
              </button>

              <button onClick={() => deleteStudent(s._id)}>
                Eliminar
              </button>
            </div>
          ))}

          {/* EDIT MODAL */}
          {editingStudent && (
            <div className="p-4 bg-gray-100 mt-4">
              <h3>Editar estudiante</h3>

              <input
                value={editingStudent.nombre}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    nombre: e.target.value,
                  })
                }
              />

              <input
                value={editingStudent.email}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    email: e.target.value,
                  })
                }
              />

              <button onClick={updateStudent}>Guardar</button>
            </div>
          )}
        </div>
      )}

      {/* ================= VALORAR HABILIDADES ================= */}
      {view === "skills" && (
        <div>
          <h2>Valorar habilidades (0 - 100)</h2>

          <select
            onChange={(e) => {
              const student = students.find((s) => s._id === e.target.value);
              setSelectedStudentSkills(student);
            }}
          >
            <option>Seleccionar estudiante</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.nombre}
              </option>
            ))}
          </select>

          {selectedStudentSkills && (
            <div>
              {Object.keys(skillsForm).map((k) => (
                <div key={k}>
                  <label>{k}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillsForm[k]}
                    onChange={(e) =>
                      setSkillsForm({
                        ...skillsForm,
                        [k]: Number(e.target.value),
                      })
                    }
                  />
                  <span>{skillsForm[k]}</span>
                </div>
              ))}

              <button onClick={saveSkills}>Guardar habilidades</button>
            </div>
          )}
        </div>
      )}

      {/* ================= PROYECTOS ================= */}
      {view === "projects" && (
        <div>
          <h2>Proyectos / Oportunidades</h2>
        </div>
      )}

      {/* ================= ASIGNAR ================= */}
      {view === "assign" && (
        <div>
          <h2>Asignar</h2>
        </div>
      )}

      {/* ================= VER ================= */}
      {view === "view" && (
        <div>
          <h2>Ver estudiante</h2>
        </div>
      )}
    </div>
  );
}