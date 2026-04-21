import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaBookOpen,
  FaArrowRight,
  FaCalendarAlt,
  FaSpinner,
  FaUniversity,
  FaIdCard,
  FaLayerGroup,
  FaFlask,
  FaUserTag,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [cgpa, setCgpa] = useState("0.00");
  const [activeSemester, setActiveSemester] = useState("N/A");
  const [loading, setLoading] = useState(true);

  //  Get Student Info from localStorage (saved by UserPortal)
  const firstName = localStorage.getItem("firstName") || "Student";
  const lastName = localStorage.getItem("lastName") || "";
  const level = localStorage.getItem("level") || "N/A";
  const department = localStorage.getItem("department") || "N/A";
  const faculty = localStorage.getItem("faculty") || "N/A";
  const matricNumber = localStorage.getItem("matricNumber") || "N/A";
  const admissionType = localStorage.getItem("admissionType") || "N/A";
  const status = localStorage.getItem("status") || "ACTIVE";
  const session = "2024/2025";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //  Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [regRes, cgpaRes, semRes] = await Promise.allSettled([
          api.get("/registrations/my-registrations"),
          api.get("/cgpa/my-cgpa"),
          api.get("/semesters/active"),
        ]);

        // 1. Registered courses
        if (regRes.status === "fulfilled") {
          const registrations = regRes.value.data.data;
          if (registrations && registrations.length > 0) {
            const latest = registrations[0];
            const coursesRaw = latest.courses || [];
            const mapped = coursesRaw.map((item) => ({
              _id: item.course?._id,
              title: item.course?.title || "N/A",
              code: item.course?.code || "N/A",
              units: item.creditUnits || item.course?.creditUnits || 0,
            }));
            setCourses(mapped);
          }
        }

        // 2. CGPA
        if (cgpaRes.status === "fulfilled") {
          const cgpaData = cgpaRes.value.data.data;
          setCgpa(cgpaData?.cgpa?.toFixed(2) || "0.00");
        }

        // 3. Active semester
        if (semRes.status === "fulfilled") {
          const semData = semRes.value.data.data;
          setActiveSemester(semData?.name || "N/A");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalUnits = courses.reduce((sum, c) => sum + (c.units || 0), 0);

  //  Stats
  const STATS = [
    { label: "Registered Courses", value: courses.length },
    { label: "Credit Units", value: totalUnits },
    { label: "CGPA", value: cgpa },
    { label: "Semester", value: activeSemester },
  ];

  //  Student Detail Cards
  const DETAILS = [
    { icon: FaIdCard, label: "Matric Number", value: matricNumber },
    { icon: FaUniversity, label: "Faculty", value: faculty },
    { icon: FaFlask, label: "Department", value: department },
    { icon: FaLayerGroup, label: "Level", value: `${level} Level` },
    { icon: FaUserTag, label: "Admission Type", value: admissionType },
    { icon: FaCalendarAlt, label: "Session", value: session },
  ];

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-blue-900 text-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/*  Welcome Banner  */}
      <div className="bg-blue-900 rounded-2xl px-6 py-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0 border-4 border-blue-700">
            <FaUserCircle className="text-blue-900 text-4xl" />
          </div>
          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
              {today}
            </p>
            <h1 className="text-white text-2xl font-black leading-snug capitalize">
              Welcome , {firstName} {lastName}!
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Here's your academic overview for the {session} session.
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
          <span
            className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
              status === "ACTIVE"
                ? "bg-green-400 text-green-900"
                : "bg-red-400 text-red-900"
            }`}
          >
            {status}
          </span>
          <span className="text-blue-300 text-xs mt-1">
            {activeSemester} Semester
          </span>
          <span className="text-blue-300 text-xs">{session} Session</span>
        </div>
      </div>

      {/*  Student Details Row  */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-b-blue-300 ">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
            Student Information
          </p>
        </div>
        {/* <div className="grid grid-flow-col auto-cols-max gap-2"> */}
        <div className="flex flex-wrap">
          {DETAILS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col  flex-[1_0_250px] gap-2 px-5 py-4 border-r-2 border-r-white  hover:bg-blue-50 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-2">
                <Icon className="text-blue-900 text-xs group-hover:text-blue-700" />
                <p className="w-full break-all text-xs font-bold text-gray-400 uppercase tracking-wide">
                  {label}
                </p>
              </div>
              <p className="w-full break-all text-sm font-black text-gray-800 leading-snug">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/*  Stats Row  */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-xl px-5 py-5 flex flex-col gap-1 hover:border-blue-900 hover:shadow-md transition-all duration-200"
          >
            <p className="text-2xl font-black text-blue-900">{value}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-snug">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/*  Enrolled Courses  */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FaBookOpen className="text-blue-900 text-base" />
            <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
              Enrolled Courses
            </p>
          </div>
          <Link
            to="/user-portal/student-courses"
            className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline"
          >
            See all <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id || course.code}
                className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 group transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-900 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <FaBookOpen className="text-blue-900 group-hover:text-white text-xs transition-colors duration-200" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800 group-hover:text-blue-900 transition-colors">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {course.code} &bull; {course.units} Units
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-bold text-blue-900 uppercase">
                    Active
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <FaCalendarAlt className="text-gray-300 text-xs" />
                    {session}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center text-gray-500 text-sm">
              No courses registered yet.{" "}
              <Link
                to="/user-portal/student-registration"
                className="text-blue-900 font-bold hover:underline"
              >
                Register now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
