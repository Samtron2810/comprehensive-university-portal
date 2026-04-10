import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import MainTopBar from "./Components/MainTopBar";
// import UserTopBar from "./Components/UserTopBar"; //comment this usertopbar fornow
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

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const isPortalPage =
    location.pathname.startsWith("/user-portal") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/lecturer");

  const isMainPage = !isAuthPage && !isPortalPage;

  return (
    <>
      {/* Main nav — public pages only */}
      {isMainPage && <MainTopBar />}

      {/* Portal top bar — inside any portal */}
      {/* comment this for now */}
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
          <Route path="student-dashboard" element={<StudentDashboard />} />
          <Route path="student-payment" element={<StudentPayment />} />
          <Route
            path="student-registration"
            element={<StudentRegistration />}
          />
          <Route path="student-courses" element={<StudentCourses />} />
          <Route path="student-drop" element={<StudentDrop />} />
          <Route path="student-result" element={<StudentResult />} />
          <Route path="student-notice" element={<StudentNotice />} />
          <Route path="student-schedule" element={<StudentSchedule />} />

          {/* For Admins */}
          <Route path="admin-dashboard" element={<AdminDashboard />} />
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
