import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function ProfileView() {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")));
  const API_URL = "https://proyecto-identidad-profesional.onrender.com/api";

  useEffect(() => {
    // Refrescar datos desde el servidor para asegurar que vemos lo último
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/students`); // En un sistema real usaríamos /auth/me
        const found = res.data.find(u => u._id === userData._id);
        if (found) {
          setUserData(found);
          localStorage.setItem("user", JSON.stringify(found));
        }
      } catch (e) {
        console.log("Error al refrescar perfil", e);
      }
    };
    fetchUser();
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-soft border border-indigo-50">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-gray-100 pb-8 text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-indigo-50 shadow-inner flex items-center justify-center">
              {userData?.fotoUrl ? (
                <img src={userData.fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-primary font-bold">{userData?.nombre?.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-gray-800 leading-tight mb-1">{userData?.nombre}</h1>
              <p className="text-sm md:text-base text-gray-500 font-medium break-all">{userData?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Universidad</span>
              <p className="text-lg font-bold text-primary-dark dark:text-white">{userData?.universidad || "No definida"}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Carrera / Programa</span>
              <p className="text-lg font-bold text-primary-dark dark:text-white">{userData?.carrera || "No definida"}</p>
            </div>

          </div>
          
          <div className="mt-10 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-50">
            <p className="text-sm text-indigo-600 dark:text-indigo-200 font-medium text-center italic">
              "La educación es el arma más poderosa para cambiar el mundo y el deporte es el lenguaje universal."
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
