import { FaBookOpen, FaChevronRight } from "react-icons/fa";

//  Mock Data

const COURSES = [
  {
    code: "CSC 301",
    title: "Object Oriented Programming",
    units: 3,
    lecturer: "Dr. A. Ibrahim",
    type: "Compulsory",
  },
  {
    code: "CSC 303",
    title: "Fundamentals of Database Systems",
    units: 3,
    lecturer: "Prof. B. Okafor",
    type: "Compulsory",
  },
  {
    code: "CSC 305",
    title: "Computer Networks",
    units: 3,
    lecturer: "Dr. C. Eze",
    type: "Compulsory",
  },
  {
    code: "CSC 307",
    title: "Software Engineering",
    units: 3,
    lecturer: "Prof. E. Adeyemi",
    type: "Compulsory",
  },
  {
    code: "MTH 301",
    title: "Numerical Methods",
    units: 3,
    lecturer: "Dr. D. Musa",
    type: "Compulsory",
  },
  {
    code: "GST 301",
    title: "Entrepreneurship Studies",
    units: 2,
    lecturer: "Mr. F. Bello",
    type: "Compulsory",
  },
];

//  Page

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/*  Page Header  */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Courses</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your registered courses for the 2024/2025 First Semester.
        </p>
      </div>

      {/*  Summary Strip  */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Courses", value: COURSES.length },
          {
            label: "Credit Units",
            value: COURSES.reduce((s, c) => s + c.units, 0),
          },
          { label: "Semester", value: "1st" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-xl px-5 py-5 hover:border-blue-900 hover:shadow-md transition-all duration-200"
          >
            <p className="text-2xl font-black text-blue-900">{value}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/*  Course List  */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            Registered Courses
          </p>
        </div>

        <ul className="divide-y divide-gray-100">
          {COURSES.map((course, i) => (
            <li
              key={course.code}
              className="flex items-center justify-between px-6 py-5 hover:bg-blue-50 group transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                {/* Index circle */}
                <div className="w-9 h-9 rounded-full bg-blue-100 group-hover:bg-blue-900 flex items-center justify-center shrink-0 transition-colors duration-200">
                  <span className="text-xs font-black text-blue-900 group-hover:text-white transition-colors duration-200">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-black text-gray-800 group-hover:text-blue-900 transition-colors">
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {course.code} &bull; {course.units} Units &bull;{" "}
                    {course.lecturer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`hidden sm:inline text-xs font-bold px-2.5 py-1 rounded-full ${
                    course.type === "Compulsory"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {course.type}
                </span>
                <FaChevronRight className="text-gray-300 group-hover:text-blue-900 text-xs transition-colors duration-200" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
