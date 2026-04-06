import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaBookOpen,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

//  Mock Data (replace with real data later)

const STATS = [
  { label: "Registered Courses", value: "8" },
  { label: "Credit Units", value: "24" },
  { label: "Current GPA", value: "4.2" },
  { label: "Semester", value: "1st" },
];

const ENROLLED_COURSES = [
  {
    code: "CSC 301",
    title: "Object Oriented Programming",
    units: 3,
    lecturer: "Dr. A. Ibrahim",
    schedule: "Mon / Wed — 10:00am",
  },
  {
    code: "CSC 303",
    title: "Fundamentals of Database Systems",
    units: 3,
    lecturer: "Prof. B. Okafor",
    schedule: "Tue / Thu — 8:00am",
  },
  {
    code: "CSC 305",
    title: "Computer Networks",
    units: 3,
    lecturer: "Dr. C. Eze",
    schedule: "Wed / Fri — 12:00pm",
  },
  {
    code: "MTH 301",
    title: "Numerical Methods",
    units: 3,
    lecturer: "Dr. D. Musa",
    schedule: "Mon / Thu — 2:00pm",
  },
  {
    code: "CSC 307",
    title: "Software Engineering",
    units: 3,
    lecturer: "Prof. E. Adeyemi",
    schedule: "Tue / Fri — 10:00am",
  },
  {
    code: "GST 301",
    title: "Entrepreneurship Studies",
    units: 2,
    lecturer: "Mr. F. Bello",
    schedule: "Fri — 8:00am",
  },
];

//  Component

export default function Dashboard() {
  //  Mock Data (replace with real auth context later)
  let usernameInputted = localStorage.getItem("username");
  const STUDENT = {
    name: usernameInputted,
    level: "300 Level",
    department: "Computer Science",
    semester: "First Semester",
    session: "2024/2025",
    avatar: null, // replace with actual image path
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      {/*  Welcome Banner  */}
      <div className="bg-blue-900 rounded-2xl px-8 py-7 flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
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

          {/* Greeting */}
          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
              {today}
            </p>
            <h1 className="text-white text-2xl font-black leading-snug">
              Welcome back, {STUDENT.name.split(" ")[0]}!
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              {STUDENT.department} &mdash; {STUDENT.level} &mdash;{" "}
              {STUDENT.session}
            </p>
          </div>
        </div>

        {/* Semester Badge */}
        <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
          <span className="bg-yellow-400 text-blue-900 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            {STUDENT.semester}
          </span>
          <span className="text-blue-300 text-xs">
            {STUDENT.session} Session
          </span>
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FaBookOpen className="text-blue-900 text-base" />
            <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
              Enrolled Courses
            </p>
          </div>
          <Link
            to="/portal/courses"
            className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline"
          >
            See all <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Course List */}
        <div className="divide-y divide-gray-100">
          {ENROLLED_COURSES.map((course) => (
            <div
              key={course.code}
              className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 group transition-colors duration-200"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-900 flex items-center justify-center shrink-0 transition-colors duration-200">
                  <FaBookOpen className="text-blue-900 group-hover:text-white text-xs transition-colors duration-200" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800 group-hover:text-blue-900 transition-colors">
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {course.code} &bull; {course.lecturer}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <FaClock className="text-gray-300 text-xs" />
                  {course.schedule}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <FaCalendarAlt className="text-gray-300 text-xs" />
                  {course.units} Credit Units
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
