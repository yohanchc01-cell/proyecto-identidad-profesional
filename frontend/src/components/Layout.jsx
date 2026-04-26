import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import CompetencySidebar from "./CompetencySidebar";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-primary-light dark:bg-[#0B0F19] font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 xl:pb-8">

        {/* Mobile Header (Simplified) */}
        <div className="md:hidden flex justify-between items-center mb-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white text-xs">PI</div>
            <span className="font-bold text-primary-dark dark:text-white">Portafolio</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => {
              const current = localStorage.getItem("theme") === "dark";
              if (current) {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
              } else {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
              }
              // Forzar un mini-refresh de estado si es necesario
              window.dispatchEvent(new Event("storage"));
            }} className="text-xl">
              {document.documentElement.classList.contains("dark") ? '☀️' : '🌙'}
            </button>
            <button onClick={() => { localStorage.clear(); window.location.href="/login"; }} className="text-xs font-bold text-red-500">Cerrar Sesión</button>
          </div>
        </div>
        
        {children}

        {/* Competency Sidebar for Mobile (at bottom) */}
        <div className="xl:hidden mt-12 bg-white p-6 rounded-3xl shadow-soft border border-indigo-50">
          <CompetencySidebar />
        </div>
      </main>

      {/* Right Sidebar (Desktop only) */}
      <aside className="w-80 bg-white border-l p-8 hidden xl:flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 justify-end">
          <div className="flex items-center gap-2 bg-gray-100 p-2 pr-4 rounded-2xl hover:bg-gray-200 transition-all cursor-pointer group" onClick={() => { localStorage.clear(); window.location.href="/login"; }}>
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all">JD</div>
            <div className="text-left">
              <span className="block font-bold text-sm leading-tight dark:text-white">Cerrar Sesión</span>
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
