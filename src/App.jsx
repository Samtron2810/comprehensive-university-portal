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
import StudentPortal from "./Pages/Auth/StudentPortal";
import AdminPortal from "./Pages/Auth/AdminPortal";

// Student Child Routes
import Dashboard from "./Pages/Auth/StudentRoutes/Dashboard";
import Payment from "./Pages/Auth/StudentRoutes/Payment";
import Registration from "./Pages/Auth/StudentRoutes/Registration";
import Courses from "./Pages/Auth/StudentRoutes/Courses";
import Drop from "./Pages/Auth/StudentRoutes/Drop";
import Result from "./Pages/Auth/StudentRoutes/Result";
import Notice from "./Pages/Auth/StudentRoutes/Notice";
import Schedule from "./Pages/Auth/StudentRoutes/Schedule";

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const isPortalPage =
    location.pathname.startsWith("/student-portal") ||
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

        {/* ── Student Portal Routes ── */}
        <Route path="/student-portal" element={<StudentPortal />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="payment" element={<Payment />} />
          <Route path="registration" element={<Registration />} />
          <Route path="courses" element={<Courses />} />
          <Route path="drop" element={<Drop />} />
          <Route path="result" element={<Result />} />
          <Route path="notice" element={<Notice />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>

        {/* ── Admin Portal Routes (placeholder — build later) ── */}
        <Route path="/admin" element={<AdminPortal />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* ── Lecturer Portal Routes (placeholder — build later) ── */}
        {/* <Route path="/lecturer" element={<UserPortal />}> */}
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
        {/* </Route> */}
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
