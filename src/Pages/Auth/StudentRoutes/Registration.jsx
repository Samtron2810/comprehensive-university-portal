import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaPlusCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaSpinner,
  FaSave,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

const MAX_UNITS = 24;

export default function RegistrationPage() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch all courses available in the system
        const coursesRes = await api.get("/courses");
        setAvailableCourses(coursesRes.data.data);

        // 2. Check for existing registration for this student
        const regRes = await api.get(`/registrations/student/${studentId}`);
        const registrations = regRes.data.data;

        // If there's an existing registration, pre-populate the selected courses
        if (registrations.length > 0) {
          const latestReg = registrations[registrations.length - 1];
          const existingIds = new Set(latestReg.courses.map((c) => c._id));
          setRegisteredIds(existingIds);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage({
          type: "error",
          text: "Failed to load courses. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchData();
  }, [studentId]);

  // Calculate stats based on the availableCourses data
  const selectedCourses = availableCourses.filter((c) =>
    registeredIds.has(c._id),
  );
  const totalUnits = selectedCourses.reduce(
    (sum, c) => sum + (c.units || 0),
    0,
  );
  const unitPercent = Math.min((totalUnits / MAX_UNITS) * 100, 100);

  const toggleCourse = (id, units) => {
    const newSet = new Set(registeredIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (totalUnits + units > MAX_UNITS) {
        setMessage({ type: "error", text: "Credit unit limit exceeded!" });
        return;
      }
      newSet.add(id);
    }
    setRegisteredIds(newSet);
    setMessage({ type: "", text: "" }); // Clear errors on change
  };

  const handleRegister = async () => {
    if (totalUnits < 12) {
      setMessage({
        type: "error",
        text: "Minimum 12 units required to register.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        studentId: studentId,
        courseIds: Array.from(registeredIds),
        semester: "1st",
        session: "2024/2025",
      };

      await api.post("/registrations", payload);
      setMessage({
        type: "success",
        text: "Registration submitted successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Submission failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-900">
        <FaSpinner className="animate-spin text-4xl mb-4" />
        <p className="font-bold tracking-wide text-sm uppercase">
          Preparing Course List...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Course Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select your courses for the current semester.
          </p>
        </div>
        <button
          onClick={handleRegister}
          disabled={submitting || registeredIds.size === 0}
          className="bg-blue-900 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 disabled:opacity-50 transition-all flex items-center gap-2 justify-center shadow-lg shadow-blue-900/20"
        >
          {submitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
          Submit Registration
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-bold border-l-4 ${
            message.type === "success"
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-red-50 border-red-500 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Credit Unit Indicator */}
      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-blue-900 text-sm" />
            <p className="text-sm font-black text-gray-800">Credit Unit Load</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-black ${totalUnits > MAX_UNITS ? "text-red-600" : "text-blue-900"}`}
            >
              {totalUnits}
            </span>
            <span className="text-sm text-gray-400 font-medium">
              / {MAX_UNITS} units
            </span>
          </div>
        </div>

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
            ? "⚠️ Maximum credit unit limit reached."
            : `Available capacity: ${MAX_UNITS - totalUnits} units.`}
        </p>
      </div>

      {/* Course Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            Available Courses
          </p>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            {registeredIds.size} Selected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-left">
                <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase">
                  Units
                </th>
                <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {availableCourses.map((course) => {
                const isRegistered = registeredIds.has(course._id);
                const isDisabled =
                  !isRegistered && totalUnits + course.units > MAX_UNITS;

                return (
                  <tr
                    key={course._id}
                    className={`group ${isRegistered ? "bg-blue-50" : "hover:bg-gray-50"}`}
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
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCourse(course._id, course.units)}
                        disabled={isDisabled}
                        className={`flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-lg transition-all ${
                          isRegistered
                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                            : isDisabled
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-blue-900 text-white hover:bg-blue-800"
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <FaTimesCircle /> Drop
                          </>
                        ) : (
                          <>
                            <FaPlusCircle /> Register
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
