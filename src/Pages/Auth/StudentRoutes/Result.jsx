import { useState } from "react";
import { FaDownload, FaChevronDown } from "react-icons/fa";

//  Mock Data

const RESULTS = {
  "2024/2025 - First Semester": {
    gpa: 4.2,
    cgpa: 4.05,
    courses: [
      {
        code: "CSC 301",
        title: "Object Oriented Programming",
        units: 3,
        score: 78,
        grade: "B",
        points: 4.0,
      },
      {
        code: "CSC 303",
        title: "Fundamentals of Database Systems",
        units: 3,
        score: 85,
        grade: "A",
        points: 5.0,
      },
      {
        code: "CSC 305",
        title: "Computer Networks",
        units: 3,
        score: 72,
        grade: "B",
        points: 4.0,
      },
      {
        code: "CSC 307",
        title: "Software Engineering",
        units: 3,
        score: 90,
        grade: "A",
        points: 5.0,
      },
      {
        code: "MTH 301",
        title: "Numerical Methods",
        units: 3,
        score: 65,
        grade: "C",
        points: 3.0,
      },
      {
        code: "GST 301",
        title: "Entrepreneurship Studies",
        units: 2,
        score: 80,
        grade: "A",
        points: 5.0,
      },
    ],
  },
  "2023/2024 - Second Semester": {
    gpa: 3.9,
    cgpa: 3.95,
    courses: [
      {
        code: "CSC 201",
        title: "Data Structures & Algorithms",
        units: 3,
        score: 75,
        grade: "B",
        points: 4.0,
      },
      {
        code: "CSC 203",
        title: "Operating Systems",
        units: 3,
        score: 82,
        grade: "A",
        points: 5.0,
      },
      {
        code: "MTH 201",
        title: "Linear Algebra",
        units: 3,
        score: 60,
        grade: "C",
        points: 3.0,
      },
      {
        code: "CSC 205",
        title: "Web Technologies",
        units: 3,
        score: 88,
        grade: "A",
        points: 5.0,
      },
      {
        code: "GST 201",
        title: "Communication Skills",
        units: 2,
        score: 74,
        grade: "B",
        points: 4.0,
      },
    ],
  },
  "2023/2024 - First Semester": {
    gpa: 3.75,
    cgpa: 3.8,
    courses: [
      {
        code: "CSC 101",
        title: "Introduction to Computing",
        units: 3,
        score: 70,
        grade: "B",
        points: 4.0,
      },
      {
        code: "MTH 101",
        title: "Calculus I",
        units: 3,
        score: 58,
        grade: "C",
        points: 3.0,
      },
      {
        code: "PHY 101",
        title: "General Physics",
        units: 3,
        score: 65,
        grade: "C",
        points: 3.0,
      },
      {
        code: "CSC 103",
        title: "Programming Fundamentals",
        units: 3,
        score: 88,
        grade: "A",
        points: 5.0,
      },
      {
        code: "GST 101",
        title: "Use of English",
        units: 2,
        score: 76,
        grade: "B",
        points: 4.0,
      },
    ],
  },
};

const SEMESTERS = Object.keys(RESULTS);

const GRADE_COLOR = {
  A: "text-green-600 bg-green-100",
  B: "text-blue-700 bg-blue-100",
  C: "text-yellow-700 bg-yellow-100",
  D: "text-orange-600 bg-orange-100",
  F: "text-red-600 bg-red-100",
};

//  Page

export default function ResultPage() {
  const [selected, setSelected] = useState(SEMESTERS[0]);
  const result = RESULTS[selected];

  const handleDownload = () => {
    alert(`Downloading result for ${selected}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/*  Page Header  */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Results</h1>
          <p className="text-sm text-gray-500 mt-1">
            View your semester results and academic performance.
          </p>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-colors duration-200"
        >
          <FaDownload className="text-xs" /> Download Result
        </button>
      </div>

      {/*  Semester Filter  */}
      <div className="relative w-full sm:w-72">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-900 transition-colors cursor-pointer"
        >
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
      </div>

      {/*  GPA Summary  */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Semester GPA", value: result.gpa.toFixed(2) },
          { label: "CGPA", value: result.cgpa.toFixed(2) },
          { label: "Total Courses", value: result.courses.length },
          {
            label: "Credit Units",
            value: result.courses.reduce((s, c) => s + c.units, 0),
          },
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

      {/*  Result Table  */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            {selected}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "Code",
                  "Course Title",
                  "Units",
                  "Score",
                  "Grade",
                  "Points",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.courses.map((course) => (
                <tr
                  key={course.code}
                  className="hover:bg-blue-50 group transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-xs font-black text-gray-500">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800 group-hover:text-blue-900 transition-colors">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                    {course.units}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-800">
                    {course.score}%
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full ${GRADE_COLOR[course.grade] || "bg-gray-100 text-gray-600"}`}
                    >
                      {course.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-blue-900">
                    {course.points.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
