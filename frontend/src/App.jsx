import Login from "./pages/Login";
import Register from "./pages/Register";
import CoursesManager from "./pages/CoursesManager";
import ActivitiesManager from "./pages/ActivitiesManager";
import Profile from "./pages/Profile";

function App() {
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
        <Route path="/course/:id" element={<CourseDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;