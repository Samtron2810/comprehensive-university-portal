import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import MainTopBar from "./Components/MainTopBar";
import StudentTopBar from "./Components/StudentTopBar";
import Footer from "./Components/Footer";
import HomePage from "./Pages/MainPages/Home";
import About from "./Pages/MainPages/About";
import News from "./Pages/HomePageSections/NewsSection";
import Admission from "./Pages/MainPages/Admission";
import Support from "./Pages/MainPages/Support";
import StudentLogin from "./Pages/Auth/StudentLogin";
import StudentRegister from "./Pages/Auth/StudentRegister";
import StudentPortal from "./Pages/Auth/StudentPortal";
// child routes
import Dashboard from "./Pages/Auth/StudentRoutes/Dashboard";
import Payment from "./Pages/Auth/StudentRoutes/Payment";
import Registration from "./Pages/Auth/StudentRoutes/Registration";
import Courses from "./Pages/Auth/StudentRoutes/Courses";
import Drop from "./Pages/Auth/StudentRoutes/Drop";
import Result from "./Pages/Auth/StudentRoutes/Result";
import Notice from "./Pages/Auth/StudentRoutes/Notice";
import Schedule from "./Pages/Auth/StudentRoutes/Schedule";

const Layout = () => {
  const location = useLocation();
  const studentRoutes = ["/student-login", "/student-register"];
  const isStudentPage = studentRoutes.includes(location.pathname);
  // Use this below if i am using more routes starting with /student, instead of typing all routes in the above one
  // const isStudentPage = location.pathname.startsWith("/student");

  const portalRoutes = ["/student-portal"];
  const isPortalPage = location.pathname.startsWith("/student-portal");
  return (
    <>
      {!isStudentPage && !isPortalPage && <MainTopBar />}
      {isStudentPage || (isPortalPage && <StudentTopBar />)}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/support" element={<Support />} />

        {/* Student Portal Pages */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student-portal" element={<StudentPortal />}>
          {/* child routes inside the portal page */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="payment" element={<Payment />} />
          <Route path="registration" element={<Registration />} />
          <Route path="courses" element={<Courses />} />
          <Route path="drop" element={<Drop />} />
          <Route path="result" element={<Result />} />
          <Route path="notice" element={<Notice />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
