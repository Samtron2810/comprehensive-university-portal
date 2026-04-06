import { useState } from "react";
import {
  FaCheckCircle,
  FaPlusCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

//  Mock Data

const MAX_UNITS = 24;

const AVAILABLE_COURSES = [
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
  {
    code: "CSC 309",
    title: "Artificial Intelligence",
    units: 3,
    lecturer: "Dr. G. Yusuf",
    type: "Elective",
  },
  {
    code: "CSC 311",
    title: "Human Computer Interaction",
    units: 2,
    lecturer: "Mrs. H. Lawal",
    type: "Elective",
  },
  {
    code: "STA 301",
    title: "Probability & Statistics",
    units: 3,
    lecturer: "Dr. I. Nwosu",
    type: "Elective",
  },
  {
    code: "PHY 301",
    title: "Modern Physics",
    units: 3,
    lecturer: "Prof. J. Ogundele",
    type: "Elective",
  },
];

//  Page

export default function RegistrationPage() {
  const [registered, setRegistered] = useState(
    // Pre-register first 6 courses by default
    new Set(AVAILABLE_COURSES.slice(0, 6).map((c) => c.code)),
  );

  const totalUnits = AVAILABLE_COURSES.filter((c) =>
    registered.has(c.code),
  ).reduce((sum, c) => sum + c.units, 0);

  const unitPercent = Math.min((totalUnits / MAX_UNITS) * 100, 100);

  const toggleCourse = (code, units) => {
    const newSet = new Set(registered);
    if (newSet.has(code)) {
      newSet.delete(code);
    } else {
      if (totalUnits + units > MAX_UNITS) return; // block if over limit
      newSet.add(code);
    }
    setRegistered(newSet);
  };

  return (
    <div className="flex flex-col gap-6">
      {/*  Page Header  */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          Course Registration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Register for available courses for the 2024/2025 First Semester.
        </p>
      </div>

      {/*  Credit Unit Indicator  */}
      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-blue-900 text-sm" />
            <p className="text-sm font-black text-gray-800">Credit Unit Load</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-black ${
                totalUnits > MAX_UNITS ? "text-red-600" : "text-blue-900"
              }`}
            >
              {totalUnits}
            </span>
            <span className="text-sm text-gray-400 font-medium">
              / {MAX_UNITS} units
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              totalUnits >= MAX_UNITS
                ? "bg-red-500"
                : totalUnits >= 18
                  ? "bg-yellow-400"
                  : "bg-blue-900"
            }`}
            style={{ width: `${unitPercent}%` }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-2">
          {totalUnits >= MAX_UNITS
            ? "⚠️ You have reached the maximum credit unit limit."
            : `You can still register up to ${MAX_UNITS - totalUnits} more credit unit(s).`}
        </p>
      </div>

      {/*  Course Table  */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            Available Courses
          </p>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            {registered.size} Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Code
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Course Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Units
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Lecturer
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {AVAILABLE_COURSES.map((course) => {
                const isRegistered = registered.has(course.code);
                const isDisabled =
                  !isRegistered && totalUnits + course.units > MAX_UNITS;

                return (
                  <tr
                    key={course.code}
                    className={`group transition-colors duration-200 ${
                      isRegistered ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-xs font-black text-gray-500">
                      {course.code}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-blue-900">
                      {course.units}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {course.lecturer}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          course.type === "Compulsory"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {course.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isRegistered ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600">
                          <FaCheckCircle className="text-green-500" />{" "}
                          Registered
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-400">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCourse(course.code, course.units)}
                        disabled={isDisabled}
                        className={`flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-lg transition-all duration-200 ${
                          isRegistered
                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                            : isDisabled
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-blue-900 text-white hover:bg-blue-800"
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <FaTimesCircle className="text-xs" /> Drop
                          </>
                        ) : (
                          <>
                            <FaPlusCircle className="text-xs" /> Register
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
