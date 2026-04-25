import React from "react";
import Sidebar from "./Sidebar";
import CompetencySidebar from "./CompetencySidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-primary-light font-sans text-gray-800">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Buscar actividades, cursos..."
              className="w-full p-4 pl-12 rounded-2xl bg-white border-none shadow-soft focus:ring-2 focus:ring-primary outline-none"
            />
            <span className="absolute left-4 top-4 opacity-40">🔍</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-medium hover:bg-primary/90 transition-all">
              + Nueva Actividad
            </button>
          </div>
        </header>
        
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 bg-white border-l p-8 hidden xl:flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 justify-end">
          <div className="flex items-center gap-2 bg-gray-100 p-2 pr-4 rounded-2xl hover:bg-gray-200 transition-all cursor-pointer group" onClick={() => { localStorage.clear(); window.location.href="/login"; }}>
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all">JD</div>
            <div className="text-left">
              <span className="block font-bold text-sm leading-tight">Cerrar Sesión</span>
              <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider">Finalizar</span>
            </div>
          </div>
        </div>

        <CompetencySidebar />
      </aside>
    </div>
  );
};

export default Layout;
