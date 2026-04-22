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
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Panel Docente</h1>

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

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="mb-4 font-semibold">Crear asignación</h2>

        <input placeholder="Título"
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
        /><br/><br/>

        <input placeholder="Descripción"
          onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
        /><br/><br/>

        <select onChange={(e) => setAssignment({ ...assignment, type: e.target.value })}>
          <option value="proyecto">Proyecto</option>
          <option value="oportunidad">Oportunidad</option>
        </select>

        <br/><br/>

        <label>
          <input type="checkbox" onChange={(e) => setAssignAll(e.target.checked)} />
          Asignar a todos
        </label>

        <br/><br/>

        <button onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Actualizar" : "Asignar"}
        </button>

      </div>

      {/* LISTADO */}
      <h2 className="text-xl mb-4">Gestión</h2>

      {allAssignments.map((a) => (
        <div key={a._id} className="bg-white p-4 mb-4 rounded shadow">

          <h3 className="font-bold">{a.title}</h3>
          <p>{a.description}</p>

          <p className="text-blue-600">{a.type}</p>

          <p>
            {a.assignedTo.map(u => (
              <span key={u._id}> {u.nombre}, </span>
            ))}
          </p>

          <div className="flex gap-2 mt-2">

            <button
              onClick={() => {
                setEditing(a);
                setAssignment(a);
              }}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Editar
            </button>

            <button
              onClick={async () => {
                await axios.delete(`https://proyecto-identidad-profesional.onrender.com/api/assignments/${a._id}`);
                window.location.reload();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>

          </div>

        </div>
      ))}

      {/* VER COMO ESTUDIANTE */}
      <h2 className="text-xl mt-6">Ver como estudiante</h2>

      {students.map(s => (
        <button
          key={s._id}
          onClick={() => setViewStudent(s)}
          className="block border p-2 mt-2"
        >
          {s.nombre}
        </button>
      ))}

      {viewStudent && (
        <div className="mt-4 p-4 bg-gray-100">
          <h3>Vista de {viewStudent.nombre}</h3>

          <button
            onClick={() => {
              localStorage.setItem("user", JSON.stringify(viewStudent));
              window.location.reload();
            }}
            className="bg-green-600 text-white px-4 py-2 mt-2"
          >
            Entrar como este estudiante
          </button>
        </div>
      )}

    </div>
  );
}