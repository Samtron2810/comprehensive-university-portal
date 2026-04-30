import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import MainTopBar from "./Components/MainTopBar";
// import UserTopBar from "./Components/UserTopBar";
import Footer from "./Components/Footer";
import HomePage from "./Pages/MainPages/Home";
import About from "./Pages/MainPages/About";
import News from "./Pages/HomePageSections/NewsSection";
import Admission from "./Pages/MainPages/Admission";
import Support from "./Pages/MainPages/Support";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import UserPortal from "./Pages/Auth/UserPortal";

// Student Child Routes
import StudentDashboard from "./Pages/Auth/StudentRoutes/Dashboard";
import StudentPayment from "./Pages/Auth/StudentRoutes/Payment";
import StudentRegistration from "./Pages/Auth/StudentRoutes/Registration";
import StudentCourses from "./Pages/Auth/StudentRoutes/Courses";
import StudentDrop from "./Pages/Auth/StudentRoutes/Drop";
import StudentResult from "./Pages/Auth/StudentRoutes/Result";
import StudentNotice from "./Pages/Auth/StudentRoutes/Notice";
import StudentSchedule from "./Pages/Auth/StudentRoutes/Schedule";

// Admin Child Routes
import AdminDashboard from "./Pages/Auth/AdminRoutes/Dashboard";
import AdminStudents from "./Pages/Auth/AdminRoutes/Students";
import AdminLecturers from "./Pages/Auth/AdminRoutes/Lecturers";
import AdminCourses from "./Pages/Auth/AdminRoutes/Courses";
import AdminApprovals from "./Pages/Auth/AdminRoutes/Approvals";
import AdminSessions from "./Pages/Auth/AdminRoutes/Sessions";
import AdminSemesters from "./Pages/Auth/AdminRoutes/Semesters";

// ─── Protected Route Helper ──────────────────────────────────────────────────

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    const fallback =
      role === "ADMIN"
        ? "/user-portal/admin-dashboard"
        : "/user-portal/student-dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const isPortalPage = location.pathname.startsWith("/user-portal");

  const isMainPage = !isAuthPage && !isPortalPage;

  return (
    <>
      {/* Main nav — public pages only */}
      {isMainPage && <MainTopBar />}

      {/* Portal top bar — inside any portal */}
      {/* {isPortalPage && <UserTopBar />} */}

      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/support" element={<Support />} />

        {/* ── Auth Routes ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── User Portal Routes ── */}
        <Route path="/user-portal" element={<UserPortal />}>
          {/* For students */}
          <Route
            path="student-dashboard"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="student-payment"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="student-registration"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="student-courses"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="student-drop"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentDrop />
              </ProtectedRoute>
            }
          />
          <Route
            path="student-result"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="student-notice"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentNotice />
              </ProtectedRoute>
            }
          />
          <Route
            path="student-schedule"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentSchedule />
              </ProtectedRoute>
            }
          />

          {/* For Admins */}
          <Route
            path="admin-dashboard"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-students"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-lecturers"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminLecturers />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-courses"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-approvals"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-sessions"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminSessions />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-semesters"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminSemesters />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>

      {/* Footer — hide inside all portals */}
      {!isPortalPage && <Footer />}
    </>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
