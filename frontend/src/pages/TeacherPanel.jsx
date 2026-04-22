import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherPanel() {

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [assignAll, setAssignAll] = useState(false);

  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    type: "proyecto"
  });

  const [allAssignments, setAllAssignments] = useState([]);
  const [editing, setEditing] = useState(null);

  const [viewStudent, setViewStudent] = useState(null);

  // 🔥 traer estudiantes
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get("https://proyecto-identidad-profesional.onrender.com/api/auth/students");
      setStudents(res.data);
    };

    const fetchAssignments = async () => {
      const res = await axios.get("https://proyecto-identidad-profesional.onrender.com/api/assignments");
      setAllAssignments(res.data);
    };

    fetchStudents();
    fetchAssignments();
  }, []);

  // 🔥 guardar / editar
  const handleSubmit = async () => {

    if (editing) {
      await axios.put(
        `https://proyecto-identidad-profesional.onrender.com/api/assignments/${editing._id}`,
        assignment
      );
      alert("Actualizado ✅");
    } else {
      await axios.post(
        "https://proyecto-identidad-profesional.onrender.com/api/assignments",
        {
          ...assignment,
          userIds: selectedStudents.map(s => s._id),
          assignToAll: assignAll
        }
      );
      alert("Asignado ✅");
    }

    window.location.reload();
  };

  return (
    <div className="p-8 text-lg">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel Docente</h1>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {/* 🔙 VOLVER DESDE ESTUDIANTE */}
      {localStorage.getItem("originalUser") && (
        <button
          onClick={() => {
            const original = localStorage.getItem("originalUser");
            localStorage.setItem("user", original);
            localStorage.removeItem("originalUser");
            window.location.reload();
          }}
          className="mb-6 bg-gray-700 text-white px-4 py-2 rounded"
        >
          ⬅ Volver a docente
        </button>
      )}

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Crear / Editar asignación
        </h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Título"
          value={assignment.title}
          onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Descripción"
          value={assignment.description}
          onChange={(e) =>
            setAssignment({ ...assignment, description: e.target.value })
          }
        />

        <select
          className="border p-2 w-full mb-3"
          value={assignment.type}
          onChange={(e) =>
            setAssignment({ ...assignment, type: e.target.value })
          }
        >
          <option value="proyecto">Proyecto</option>
          <option value="oportunidad">Oportunidad</option>
        </select>

        {/* 🔥 SELECCIÓN DE ESTUDIANTES */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Seleccionar estudiantes</h3>

          {students.map((s) => (
            <label key={s._id} className="block">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStudents([...selectedStudents, s]);
                  } else {
                    setSelectedStudents(
                      selectedStudents.filter((st) => st._id !== s._id)
                    );
                  }
                }}
              />
              <span className="ml-2">{s.nombre}</span>
            </label>
          ))}
        </div>

        <label className="block mb-4">
          <input
            type="checkbox"
            onChange={(e) => setAssignAll(e.target.checked)}
          />
          <span className="ml-2">Asignar a todos</span>
        </label>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {editing ? "Actualizar" : "Asignar"}
        </button>
      </div>

      {/* LISTADO */}
      <h2 className="text-2xl mb-4">Gestión de asignaciones</h2>

      {allAssignments.map((a) => (
        <div key={a._id} className="bg-white p-4 mb-4 rounded shadow">

          <h3 className="font-bold text-xl">{a.title}</h3>
          <p>{a.description}</p>
          <p className="text-blue-600">{a.type}</p>

          <p className="text-sm mt-2">
            <b>Asignado a:</b>{" "}
            {a.assignedTo.map((u) => u.nombre).join(", ")}
          </p>

          <div className="flex gap-3 mt-3">

            <button
              onClick={() => {
                setEditing(a);
                setAssignment(a);
              }}
              className="bg-yellow-500 text-white px-4 py-1 rounded"
            >
              Editar
            </button>

            <button
              onClick={async () => {
                await axios.delete(
                  `https://proyecto-identidad-profesional.onrender.com/api/assignments/${a._id}`
                );
                window.location.reload();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Eliminar
            </button>

          </div>
        </div>
      ))}

      {/* 👀 VER COMO ESTUDIANTE */}
      <h2 className="text-2xl mt-8 mb-4">Ver como estudiante</h2>

      {students.map((s) => (
        <button
          key={s._id}
          onClick={() => {
            localStorage.setItem("originalUser", localStorage.getItem("user"));
            localStorage.setItem("user", JSON.stringify(s));
            window.location.reload();
          }}
          className="block border p-3 mb-2 w-full text-left hover:bg-gray-100"
        >
          {s.nombre} ({s.email})
        </button>
      ))}

    </div>
  );
}