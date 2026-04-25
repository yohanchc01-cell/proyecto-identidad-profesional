import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "🏠" },
    { name: "Mis Cursos", path: "/cursos", icon: "📚" },
    { name: "Habilidades", path: "/habilidades", icon: "🧠" },
    { name: "Estadísticas", path: "/stats", icon: "📊" },
  ];

  return (
    <aside className="w-64 bg-primary-dark text-white flex flex-col p-6 hidden md:flex sticky top-0 h-screen">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold">PI</div>
        <span className="text-xl font-bold italic">Portafolio.</span>
      </div>
      
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{item.icon}</span> {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
        <p className="text-xs opacity-60 mb-2">Desempeño General</p>
        <div className="w-full bg-white/20 h-2 rounded-full mb-2">
          <div className="bg-primary h-full w-[85%] rounded-full"></div>
        </div>
        <p className="text-[10px] font-bold">Excelente (4.25/5.0)</p>
      </div>

      <button className="mt-6 flex items-center gap-3 p-3 text-white/60 hover:text-red-400 transition-colors">
        <span>🚪</span> Cerrar Sesión
      </button>
    </aside>
  );
};

export default Sidebar;
