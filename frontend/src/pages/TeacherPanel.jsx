import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherPanel() {

  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
const [editUser, setEditUser] = useState(null);

  const [form, setForm] = useState({
    comunicacion: "",
    liderazgo: "",
    trabajoEquipo: "",
    creatividad: "",
    resolucion: ""
  });

  // 🔥 Obtener estudiantes
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get("https://proyecto-identidad-profesional.onrender.com/api/auth/students");
      setStudents(res.data);
    };

    fetchStudents();
  }, []);

  // 🔥 Guardar evaluación
  const handleSubmit = async () => {
    if (!selected) {
      alert("Selecciona un estudiante ❌");
      return;
    }

    await axios.post("https://proyecto-identidad-profesional.onrender.com/api/skills", {
      userId: selected._id,
      comunicacion: Number(form.comunicacion),
      liderazgo: Number(form.liderazgo),
      trabajoEquipo: Number(form.trabajoEquipo),
      creatividad: Number(form.creatividad),
      resolucion: Number(form.resolucion)
    });

    alert("Evaluación guardada ✅");
  };

  return (
    <div className="p-8">

      {/* 🔥 HEADER CON LOGOUT */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel Docente</h1>

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

      {/* CONTENIDO */}
      <div className="grid grid-cols-2 gap-6">

        {/* Lista estudiantes */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl mb-4">Estudiantes</h2>

          {students.map((s) => (
                <div
                    key={s._id}
                    className={`p-2 rounded ${
                    selected?._id === s._id ? "bg-blue-200" : "hover:bg-gray-100"
                    }`}
                >
                    <div onClick={() => setSelected(s)} className="cursor-pointer">
                    {s.nombre} ({s.email})
                    </div>

                    <div className="flex gap-2 mt-1">
                    <button
                        onClick={async () => {
                        await axios.delete(`https://proyecto-identidad-profesional.onrender.com/api/auth/user/${s._id}`);
                        alert("Eliminado ✅");
                        window.location.reload();
                        }}
                        className="text-red-600 text-sm"
                    >
                        Eliminar
                    </button>

                    <button
                        onClick={() => {
                            setEditMode(true);
                            setEditUser(s);
                        }}
                        className="text-blue-600 text-sm"
                        >
                        Editar
                        </button>

                    </div>
                </div>
                ))}
        </div>

        {/* Formulario */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl mb-4">
            Evaluar: {selected ? selected.nombre : "Ninguno"}
          </h2>

          <input placeholder="Comunicación"
            onChange={(e) => setForm({ ...form, comunicacion: e.target.value })}
          /><br/><br/>

          <input placeholder="Liderazgo"
            onChange={(e) => setForm({ ...form, liderazgo: e.target.value })}
          /><br/><br/>

          <input placeholder="Trabajo en equipo"
            onChange={(e) => setForm({ ...form, trabajoEquipo: e.target.value })}
          /><br/><br/>

          <input placeholder="Creatividad"
            onChange={(e) => setForm({ ...form, creatividad: e.target.value })}
          /><br/><br/>

          <input placeholder="Resolución"
            onChange={(e) => setForm({ ...form, resolucion: e.target.value })}
          /><br/><br/>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar evaluación
          </button>
        </div>

      </div>

            {editMode && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">

            <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl mb-4">Editar Usuario</h2>

            <input
                value={editUser?.nombre}
                onChange={(e) =>
                setEditUser({ ...editUser, nombre: e.target.value })
                }
                className="border p-2 w-full mb-2"
            />

            <input
                value={editUser?.email}
                onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
                }
                className="border p-2 w-full mb-2"
            />

            <select
                value={editUser?.role}
                onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
                }
                className="border p-2 w-full mb-2"
            >
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
            </select>

            <div className="flex justify-between mt-4">
                <button
                onClick={async () => {
                    await axios.put(
                    `https://proyecto-identidad-profesional.onrender.com/api/auth/user/${editUser._id}`,
                    editUser
                    );
                    alert("Actualizado ✅");
                    setEditMode(false);
                    window.location.reload();
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
                >
                Guardar
                </button>

                <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                Cancelar
                </button>
            </div>
            </div>

        </div>
        )}
    </div>
  );
}