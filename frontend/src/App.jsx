import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeacherPanel from "./pages/TeacherPanel";

function App() {
  const [user] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  if (!user) return <Login />;

  if (user.role === "docente") return <TeacherPanel />;

  return <Dashboard />;
}

export default App;