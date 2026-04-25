import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-72 bg-[#0F172A] text-white p-6 flex flex-col h-screen sticky top-0 shadow-2xl z-50 no-print">
      <div className="flex items-center gap-3 mb-10 px-2 mt-4">
        <div className="w-10 h-10 bg-[#5D5FEF] rounded-xl flex items-center justify-center font-bold shadow-lg">PI</div>
        <span className="text-xl font-bold tracking-tight">Portafolio</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        <Link to="/dashboard" className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-semibold ${isActive("/dashboard") || isActive("/") ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
          🏠 Dashboard
        </Link>
        <Link to="/courses" className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-semibold ${isActive("/courses") ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
          📚 Mis Cursos
        </Link>
        <Link to="/activities" className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-semibold ${isActive("/activities") ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
          📝 Mis Actividades
        </Link>
        <Link to="/profile" className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-semibold ${isActive("/profile") ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
          👤 Mi Perfil
        </Link>
      </nav>

      <button 
        onClick={handleLogout} 
        className="mt-auto flex items-center gap-3 p-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all mb-4 cursor-pointer font-bold group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
