import { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaSpinner,
  FaTrashAlt,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function DropSemesterPage() {
  const [reason, setReason] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmDrop, setConfirmDrop] = useState(false);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      try {
        setLoading(true);
        // Reuse the endpoint from your registration logic
        const response = await api.get(`/registrations/student/${studentId}`);
        setCourses(response.data.data?.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchRegisteredCourses();
  }, [studentId]);

  const handleSubmit = async () => {
    if (reason.trim().length < 20) {
      alert("Please provide a more detailed reason (at least 20 characters).");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/requests/drop-semester", {
        studentId,
        reason,
        courses: courses.map((c) => c.code),
        type: "SEMESTER_DROP",
      });
      setSubmitted(true);
    } catch (err) {
      alert("Failed to submit request. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-900">
        <FaSpinner className="animate-spin text-3xl mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-gray-500">
          Loading Academic Data...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Drop Semester</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your current courses and submit an official drop request.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl px-6 py-5">
        <FaExclamationTriangle className="text-red-500 text-xl shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-red-800 uppercase tracking-tight">
            Immediate Academic Impact
          </p>
          <p className="text-xs text-red-700 mt-1 leading-relaxed">
            Submitting this request will flag your account for "Inactive" status
            pending approval. Ensure you have spoken with your HOD or Academic
            Advisor before proceeding.
          </p>
        </div>
      </div>

      {/* Current Courses Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Registered Courses to be Dropped
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.code}>
                    <td className="px-6 py-4 text-xs font-black text-gray-500 uppercase">
                      {course.code}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-blue-900 text-right">
                      {course.units} Units
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-sm text-gray-400"
                  >
                    No active course registrations found for this semester.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drop Request Form */}
      {!submitted ? (
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-7 shadow-sm flex flex-col gap-5">
          <div>
            <p className="text-sm font-black text-gray-800 mb-1 uppercase tracking-tight">
              Statement of Reason
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Why are you requesting to drop this semester? This information is
              required for the Senate's review.
            </p>
          </div>

          <textarea
            rows={5}
            placeholder="Please detail the circumstances (medical, personal, or financial)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-red-500 bg-gray-50 focus:bg-white transition-all duration-200 resize-none"
          />

          {!confirmDrop ? (
            <button
              onClick={() => setConfirmDrop(true)}
              disabled={reason.trim().length < 10 || courses.length === 0}
              className="w-fit flex items-center gap-2 bg-gray-900 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-lg transition-all duration-300"
            >
              <FaTrashAlt /> Prepare Drop Request
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-lg transition-all"
              >
                {submitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTimesCircle />
                )}
                Confirm and Submit Request
              </button>
              <button
                onClick={() => setConfirmDrop(false)}
                className="text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 tracking-widest"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-12 flex flex-col items-center text-center gap-4 shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <div>
            <p className="text-lg font-black text-green-800">
              Request Logged Successfully
            </p>
            <p className="text-sm text-green-700 max-w-md mt-1 leading-relaxed">
              Your application has been forwarded to the Registrar. You will
              receive an email notification once it has been processed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
