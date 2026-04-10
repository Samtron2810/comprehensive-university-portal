import { useEffect, useState } from "react";
import { FaBookOpen, FaChevronRight, FaSpinner } from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [semesterInfo, setSemesterInfo] = useState({
    semester: "N/A",
    session: "N/A",
  });

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      try {
        setLoading(true);
        // 1. Fetch registrations for this student
        const response = await api.get(`/registrations/student/${studentId}`);

        // 2. The backend returns an array. We look for the most recent submitted one.
        const registrations = response.data.data;
        const activeReg =
          registrations.find((reg) => reg.isSubmitted === true) ||
          registrations[0];

        if (activeReg && activeReg.courses) {
          setCourses(activeReg.courses);
          setSemesterInfo({
            semester: activeReg.semester || "1st",
            session: activeReg.session || "2024/2025",
          });
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(
          "Failed to load registered courses. Ensure you have completed registration.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchRegisteredCourses();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-blue-900">
        <FaSpinner className="animate-spin text-3xl mb-4" />
        <p className="text-sm font-bold">Fetching your registered courses...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Courses</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your registered courses for the {semesterInfo.session}{" "}
          {semesterInfo.semester} Semester.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 text-sm font-medium rounded">
          {error}
        </div>
      )}

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Courses", value: courses.length },
          {
            label: "Credit Units",
            value: courses.reduce((s, c) => s + (c.units || 0), 0),
          },
          { label: "Semester", value: semesterInfo.semester },
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

      {/* Course List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            Registered Courses
          </p>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full uppercase">
            Confirmed
          </span>
        </div>

        {courses.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {courses.map((course, i) => (
              <li
                key={course._id || course.code}
                className="flex items-center justify-between px-6 py-5 hover:bg-blue-50 group transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-blue-100 group-hover:bg-blue-900 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <span className="text-xs font-black text-blue-900 group-hover:text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-black text-gray-800 group-hover:text-blue-900 transition-colors">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {course.code} &bull; {course.units} Units{" "}
                      {course.lecturer ? `&bull; ${course.lecturer}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                    Compulsory
                  </span>
                  <FaChevronRight className="text-gray-300 group-hover:text-blue-900 text-xs transition-colors duration-200" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-10 text-center">
            <FaBookOpen className="mx-auto text-gray-200 text-4xl mb-3" />
            <p className="text-gray-500 text-sm">
              No courses found for this semester.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
