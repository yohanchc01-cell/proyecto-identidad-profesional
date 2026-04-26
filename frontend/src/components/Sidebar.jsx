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
    <div className="fixed bottom-0 left-0 right-0 xl:sticky xl:top-0 xl:w-72 bg-[#0F172A] text-white p-4 xl:p-6 flex flex-row xl:flex-col items-center justify-around xl:justify-start xl:h-screen xl:overflow-y-auto shadow-2xl z-50 no-print">
      <div className="hidden xl:flex items-center gap-3 mb-10 px-2 mt-4">
        <div className="w-10 h-10 bg-[#5D5FEF] rounded-xl flex items-center justify-center font-bold shadow-lg">PI</div>
        <span className="text-xl font-bold tracking-tight">Portafolio</span>
      </div>
      
      <nav className="flex flex-row xl:flex-col flex-1 gap-2 w-full justify-around xl:justify-start">
        <Link to="/dashboard" className={`flex flex-col xl:flex-row items-center gap-1 xl:gap-4 p-2 xl:p-4 rounded-2xl transition-all font-semibold ${isActive("/dashboard") || isActive("/") ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
          <span className="text-lg xl:text-base">🏠</span>
          <span className="text-[10px] xl:text-base">Dashboard</span>
        </Link>
        <Link to="/view-profile" className={`flex flex-col xl:flex-row items-center gap-1 xl:gap-4 p-2 xl:p-4 rounded-2xl transition-all font-semibold ${isActive("/view-profile") ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
          <span className="text-lg xl:text-base">👤</span>
          <span className="text-[10px] xl:text-base">Perfil</span>
        </Link>
        <Link to="/courses" className={`flex flex-col xl:flex-row items-center gap-1 xl:gap-4 p-2 xl:p-4 rounded-2xl transition-all font-semibold ${isActive("/courses") ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
          <span className="text-lg xl:text-base">📚</span>
          <span className="text-[10px] xl:text-base">Cursos</span>
        </Link>
        <Link to="/activities" className={`flex flex-col xl:flex-row items-center gap-1 xl:gap-4 p-2 xl:p-4 rounded-2xl transition-all font-semibold ${isActive("/activities") ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
          <span className="text-lg xl:text-base">📝</span>
          <span className="text-[10px] xl:text-base">Actividades</span>
        </Link>
      </nav>

      <button 
        onClick={handleLogout} 
        className="hidden xl:flex mt-auto items-center gap-3 p-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all mb-4 cursor-pointer font-bold group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
