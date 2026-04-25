import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <aside className="w-20 bg-primary-dark min-h-screen flex flex-col items-center py-8 gap-10 overflow-y-auto no-print">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg cursor-pointer" onClick={() => navigate("/")}>
        PI
      </div>
      
      <nav className="flex flex-col gap-8 flex-1">
        <button 
          onClick={() => navigate("/dashboard")} 
          className={`p-3 rounded-2xl transition-all cursor-pointer ${location.pathname === '/' || location.pathname === '/dashboard' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          title="Dashboard"
        >
          🏠
        </button>
        <button 
          onClick={() => navigate("/courses")} 
          className={`p-3 rounded-2xl transition-all cursor-pointer ${location.pathname === '/courses' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          title="Mis Cursos"
        >
          📚
        </button>
        <button 
          onClick={() => navigate("/activities")} 
          className={`p-3 rounded-2xl transition-all cursor-pointer ${location.pathname === '/activities' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
          title="Mis Actividades"
        >
          📝
        </button>
      </nav>

      <button 
        onClick={handleLogout} 
        className="mt-auto p-3 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-2xl transition-all mb-4 cursor-pointer" 
        title="Cerrar Sesión"
      >
        🚪
      </button>
    </aside>
  );
};

export default Sidebar;
