import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaPlusCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaSpinner,
  FaPaperPlane,
  FaExclamationTriangle,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

const MAX_UNITS = 24;

export default function RegistrationPage() {
  const [eligibleCourses, setEligibleCourses] = useState([]);
  const [registrationId, setRegistrationId] = useState(null);
  const [registeredCourses, setRegisteredCourses] = useState([]); // [{course: {...}, creditUnits, isCarryOver}]
  const [regStatus, setRegStatus] = useState(null); // DRAFT, SUBMITTED, APPROVED, REJECTED
  const [feesPaid, setFeesPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // courseId being actioned
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const studentId =
    localStorage.getItem("studentId") || localStorage.getItem("userId");

  // ── Step 1: On mount — check current registration + fetch eligible courses ──
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // Run both requests in parallel
        const [currentRegRes, eligibleRes] = await Promise.allSettled([
          api.get("/registrations/current"),
          api.get(`/courses/eligible/${studentId}`),
        ]);

        // Handle eligible courses
        if (eligibleRes.status === "fulfilled") {
          setEligibleCourses(eligibleRes.value.data.data || []);
        }

        // Handle current registration
        if (currentRegRes.status === "fulfilled") {
          const reg = currentRegRes.value.data.data;
          if (reg) {
            setRegistrationId(reg._id);
            setRegisteredCourses(reg.courses || []);
            setRegStatus(reg.status);
            setFeesPaid(reg.feesPaid || false);
          }
        } else {
          // No current registration — we'll create a draft when needed
          setRegistrationId(null);
        }
      } catch (err) {
        console.error("Init error:", err.message);
        setMessage({
          type: "error",
          text: "Failed to load registration data. Please refresh.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (studentId) init();
  }, [studentId]);

  // ── Helper: get or create a draft registration ────────────────────────────
  const getOrCreateDraft = async () => {
    if (registrationId) return registrationId;

    const res = await api.post("/registrations/draft");
    const newRegId = res.data.data._id;
    setRegistrationId(newRegId);
    setRegStatus("DRAFT");
    localStorage.setItem("registrationId", newRegId);
    return newRegId;
  };

  // ── Step 4: Add a course ──────────────────────────────────────────────────
  const handleAdd = async (course) => {
    if (totalUnits + course.creditUnits > MAX_UNITS) {
      setMessage({
        type: "error",
        text: "Adding this course exceeds the maximum credit unit limit.",
      });
      return;
    }

    try {
      setActionLoading(course._id);
      setMessage({ type: "", text: "" });

      const regId = await getOrCreateDraft();
      await api.post(`/registrations/${regId}/courses`, {
        courseId: course._id,
      });

      // Update local state immediately
      setRegisteredCourses((prev) => [
        ...prev,
        { course, creditUnits: course.creditUnits, isCarryOver: false },
      ]);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add course.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Step 5: Remove a course ───────────────────────────────────────────────
  const handleRemove = async (courseId) => {
    try {
      setActionLoading(courseId);
      setMessage({ type: "", text: "" });

      await api.delete(`/registrations/${registrationId}/courses/${courseId}`);

      // Update local state immediately
      setRegisteredCourses((prev) =>
        prev.filter((item) => item.course._id !== courseId),
      );
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to remove course.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Step 6: Submit registration ───────────────────────────────────────────
  const handleSubmit = async () => {
    if (!feesPaid) {
      setMessage({
        type: "error",
        text: "You must pay your fees before submitting your registration.",
      });
      return;
    }

    if (totalUnits < 12) {
      setMessage({
        type: "error",
        text: "Minimum of 12 credit units required to submit.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });

      await api.patch(`/registrations/${registrationId}/submit`);
      setRegStatus("SUBMITTED");
      setMessage({
        type: "success",
        text: "Registration submitted successfully! Awaiting approval.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message || "Submission failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Computed values ───────────────────────────────────────────────────────
  const registeredCourseIds = new Set(
    registeredCourses.map((item) => item.course._id),
  );
  const totalUnits = registeredCourses.reduce(
    (sum, item) => sum + (item.creditUnits || 0),
    0,
  );
  const unitPercent = Math.min((totalUnits / MAX_UNITS) * 100, 100);
  const isLocked = regStatus === "SUBMITTED" || regStatus === "APPROVED";

  // ── Status badge ──────────────────────────────────────────────────────────
  const STATUS_STYLES = {
    DRAFT: "bg-yellow-100 text-yellow-800",
    SUBMITTED: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-900">
        <FaSpinner className="animate-spin text-4xl mb-4" />
        <p className="font-bold tracking-wide text-sm uppercase">
          Loading Registration...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Course Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Add or remove courses for the current semester.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Registration Status Badge */}
          {regStatus && (
            <span
              className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full ${STATUS_STYLES[regStatus] || "bg-gray-100 text-gray-600"}`}
            >
              {regStatus}
            </span>
          )}

          {/* Submit Button */}
          {!isLocked && (
            <button
              onClick={handleSubmit}
              disabled={
                submitting || registeredCourses.length === 0 || !feesPaid
              }
              className="bg-blue-900 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
            >
              {submitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
              Submit Registration
            </button>
          )}
        </div>
      </div>

      {/* ── Message Banner ── */}
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

      {/* ── Fees Warning ── */}
      {!feesPaid && (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-300 rounded-xl px-5 py-4">
          <FaExclamationTriangle className="text-yellow-500 text-lg shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800 font-semibold">
            Your fees have not been paid. You can add courses to your draft, but
            you won't be able to submit until payment is confirmed.
          </p>
        </div>
      )}

      {/* ── Submitted/Approved Notice ── */}
      {isLocked && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
          <FaCheckCircle className="text-blue-900 text-lg shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 font-semibold">
            Your registration has been <strong>{regStatus}</strong>. No further
            changes can be made.
          </p>
        </div>
      )}

      {/* ── Credit Unit Indicator ── */}
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

      {/* ── Course Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            Eligible Courses
          </p>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            {registeredCourses.length} Added
          </span>
        </div>

        {eligibleCourses.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No eligible courses found for this semester.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Code
                  </th>
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Units
                  </th>
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eligibleCourses.map((course) => {
                  const isAdded = registeredCourseIds.has(course._id);
                  const isDisabled =
                    !isAdded && totalUnits + course.creditUnits > MAX_UNITS;
                  const isActioning = actionLoading === course._id;

                  return (
                    <tr
                      key={course._id}
                      className={`transition-colors duration-200 ${isAdded ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    >
                      <td className="px-6 py-4 text-xs font-black text-gray-500">
                        {course.code}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {course.title}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-blue-900">
                        {course.creditUnits}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            course.type === "CORE"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {course.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isAdded ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600">
                            <FaCheckCircle /> Added
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 flex gap-1">
                            <FaTimesCircle /> None
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isLocked ? (
                          <span className="text-xs text-gray-300 font-medium">
                            Locked
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              isAdded
                                ? handleRemove(course._id)
                                : handleAdd(course)
                            }
                            disabled={isDisabled || isActioning}
                            className={`flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-lg transition-all duration-200 ${
                              isAdded
                                ? "bg-red-50 text-red-500 hover:bg-red-100"
                                : isDisabled
                                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                  : "bg-blue-900 text-white hover:bg-blue-800"
                            }`}
                          >
                            {isActioning ? (
                              <FaSpinner className="animate-spin" />
                            ) : isAdded ? (
                              <>
                                <FaTimesCircle /> Remove
                              </>
                            ) : (
                              <>
                                <FaPlusCircle /> Add
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
