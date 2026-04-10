import { useState, useEffect } from "react";
import {
  FaDownload,
  FaChevronDown,
  FaSpinner,
  FaGraduationCap,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

const GRADE_COLOR = {
  A: "text-green-600 bg-green-100",
  B: "text-blue-700 bg-blue-100",
  C: "text-yellow-700 bg-yellow-100",
  D: "text-orange-600 bg-orange-100",
  F: "text-red-600 bg-red-100",
};

export default function ResultPage() {
  const [resultsData, setResultsData] = useState({});
  const [semesters, setSemesters] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/results/student/${studentId}`);

        // Assuming backend returns an object keyed by "Session - Semester"
        // e.g., { "2024/2025 - First Semester": { gpa: 4.2, courses: [...] } }
        const data = response.data.data;
        setResultsData(data);

        const keys = Object.keys(data);
        setSemesters(keys);
        if (keys.length > 0) setSelected(keys[0]);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchResults();
  }, [studentId]);

  const handleDownload = () => {
    alert(`Generating Official Transcript for ${selected}...`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-900">
        <FaSpinner className="animate-spin text-3xl mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-gray-500">
          Compiling Academic Record...
        </p>
      </div>
    );
  }

  // Fallback if no results exist yet
  if (semesters.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
        <FaGraduationCap className="mx-auto text-5xl text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">No Results Found</h2>
        <p className="text-sm text-gray-500">
          Your academic records will appear here once uploaded by the
          department.
        </p>
      </div>
    );
  }

  const result = resultsData[selected];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Academic Results
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your semester-by-semester performance and CGPA.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/10"
        >
          <FaDownload className="text-xs" /> Download PDF
        </button>
      </div>

      {/* Semester Filter */}
      <div className="relative w-full sm:w-80">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-900 transition-colors cursor-pointer shadow-sm"
        >
          {semesters.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
      </div>

      {/* GPA Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Semester GPA", value: result?.gpa?.toFixed(2) || "0.00" },
          { label: "Current CGPA", value: result?.cgpa?.toFixed(2) || "0.00" },
          { label: "Courses Done", value: result?.courses?.length || 0 },
          {
            label: "Total Units",
            value:
              result?.courses?.reduce((s, c) => s + (c.units || 0), 0) || 0,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-xl px-5 py-5 hover:border-blue-900 hover:shadow-md transition-all duration-200"
          >
            <p className="text-2xl font-black text-blue-900">{value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Result Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-xs font-black text-blue-900 uppercase tracking-widest">
            {selected} Detailed Breakdown
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                {["Code", "Course Title", "Units", "Score", "Grade", "GP"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result?.courses?.map((course) => (
                <tr
                  key={course.code}
                  className="hover:bg-blue-50/50 group transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-black text-gray-500">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700 group-hover:text-blue-900">
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
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full ${GRADE_COLOR[course.grade] || "bg-gray-100 text-gray-600"}`}
                    >
                      {course.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-blue-900">
                    {course.points?.toFixed(1)}
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
