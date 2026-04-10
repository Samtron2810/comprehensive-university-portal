import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaBookOpen,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Get Student Info from localStorage (Saved by PortalLayout)
  const firstName = localStorage.getItem("firstName") || "Admin";
  const lastName = localStorage.getItem("lastName") || "";
  const level = localStorage.getItem("level") || "N/A";
  const role = localStorage.getItem("role") || "N/A";
  const studentId = localStorage.getItem("studentId");

  const STUDENT = {
    name: `${firstName} ${lastName}`,
    role: role,
    avatar: null,
  };

  // 2. Fetch Real Registration Stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/registrations/student/${studentId}`);
        const registrations = response.data.data;

        // Find the submitted registration for the current semester
        const activeReg =
          registrations.find((reg) => reg.isSubmitted) || registrations[0];

        if (activeReg && activeReg.courses) {
          setCourses(activeReg.courses);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchDashboardData();
  }, [studentId]);

  const totalUnits = courses.reduce((sum, c) => sum + (c.units || 0), 0);

  const STATS = [
    { label: "Registered Courses", value: courses.length },
    { label: "Credit Units", value: totalUnits },
    { label: "Current GPA", value: "0.00" }, // Link this to Results API later
    { label: "Semester", value: "1st" },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-blue-900 text-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="bg-blue-900 rounded-2xl px-8 py-7 flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {STUDENT.avatar ? (
            <img
              src={STUDENT.avatar}
              alt={STUDENT.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0 border-4 border-blue-700">
              <FaUserCircle className="text-blue-900 text-4xl" />
            </div>
          )}

          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
              {today}
            </p>
            <h1 className="text-white text-2xl font-black leading-snug">
              Welcome back, {firstName}!
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              {STUDENT.department} &mdash; {STUDENT.level} &mdash;{" "}
              {STUDENT.session}
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
          <span className="bg-yellow-400 text-blue-900 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            {STUDENT.semester}
          </span>
          <span className="text-blue-300 text-xs">
            {STUDENT.session} Session
          </span>
        </div>
      </div>

      {/* Stats Row */}
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

      {/* Enrolled Courses */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FaBookOpen className="text-blue-900 text-base" />
            <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
              Enrolled Courses
            </p>
          </div>
          <Link
            to="/student-portal/courses"
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

                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-right">
                  <span className="flex items-center gap-1 text-xs uppercase font-bold text-blue-900">
                    Active
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <FaCalendarAlt className="text-gray-300 text-xs" />
                    {STUDENT.session}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center text-gray-500 text-sm">
              No courses registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
