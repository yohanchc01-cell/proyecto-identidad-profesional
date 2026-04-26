import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CoursesManager from "./pages/CoursesManager";
import ActivitiesManager from "./pages/ActivitiesManager";
import Profile from "./pages/Profile";
import ProfileView from "./pages/ProfileView";

function App() {
  // Asegurar que cuando se inicie la sesión (nueva pestaña o app recién abierta),
  // se empiece desde el dashboard y no desde el último menú restaurado por el celular.
  useEffect(() => {
    if (!sessionStorage.getItem("appStarted")) {
      sessionStorage.setItem("appStarted", "true");
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register" && path !== "/") {
        window.location.href = "/";
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CoursesManager />} />
        <Route path="/activities" element={<ActivitiesManager />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/view-profile" element={<ProfileView />} />
        <Route path="/course/:id" element={<CourseDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;