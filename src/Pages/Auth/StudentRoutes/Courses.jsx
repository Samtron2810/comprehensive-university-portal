import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FaBookOpen,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaInbox,
} from "react-icons/fa";

const STATUS_META = {
  APPROVED: {
    label: "Approved",
    icon: <FaCheckCircle className="text-green-500" />,
    badge: "bg-green-100 text-green-700",
  },
  SUBMITTED: {
    label: "Submitted",
    icon: <FaHourglassHalf className="text-blue-500" />,
    badge: "bg-blue-100 text-blue-700",
  },
  DRAFT: {
    label: "Draft",
    icon: <FaHourglassHalf className="text-yellow-500" />,
    badge: "bg-yellow-100 text-yellow-700",
  },
  REJECTED: {
    label: "Rejected",
    icon: <FaTimesCircle className="text-red-500" />,
    badge: "bg-red-100 text-red-700",
  },
};

function SummaryCard({ label, value, color, extra }) {
  const colors = {
    blue: "bg-blue-50   text-blue-700   border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    teal: "bg-teal-50   text-teal-700   border-teal-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className={`rounded-xl border p-4 flex flex-col ${colors[color]}`}>
      <span className="text-xs font-medium uppercase tracking-wide opacity-70">
        {label}
      </span>
      <span className="text-2xl font-bold mt-1">{value}</span>
      {extra}
    </div>
  );
}

export default function Courses() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRegId, setActiveRegId] = useState(null);

  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const level = localStorage.getItem("level") || "";

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/registrations/my-registrations");

        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setRegistrations(list);

        const best =
          list.find(
            (r) => r.status === "APPROVED" || r.status === "SUBMITTED",
          ) ?? list[0];

        if (best) setActiveRegId(best._id);
      } catch (err) {
        console.error(
          "Courses fetch error:",
          err.response?.status,
          err.message,
        );
        setError("Failed to load your registered courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const activeReg = registrations.find((r) => r._id === activeRegId) ?? null;
  const courses = activeReg?.courses ?? [];
  const statusMeta = activeReg
    ? (STATUS_META[activeReg.status] ?? STATUS_META.DRAFT)
    : null;

  const totalUnits = courses.reduce(
    (sum, item) => sum + (item.creditUnits ?? 0),
    0,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-blue-900 gap-3">
        <FaSpinner className="animate-spin text-2xl" />
        <span className="font-medium text-base">Loading your courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
        <FaExclamationTriangle className="text-4xl" />
        <p className="font-medium text-center px-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-5 py-2 bg-blue-900 text-white rounded-lg text-sm hover:bg-blue-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
        <FaInbox className="text-5xl" />
        <p className="text-lg font-medium">No registrations found</p>
        <p className="text-sm text-center px-8">
          You have not registered for any semester yet. Head over to{" "}
          <a
            href="/user-portal/student-registration"
            className="text-blue-900 underline hover:text-blue-700"
          >
            Course Registration
          </a>{" "}
          to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 text-blue-900 p-3 rounded-xl">
          <FaBookOpen className="text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Courses</h1>
          <p className="text-sm text-gray-500">
            {firstName} {lastName}
            {level ? ` — ${level} Level` : ""}
          </p>
        </div>
      </div>

      {registrations.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {registrations.map((reg) => {
            const meta = STATUS_META[reg.status] ?? STATUS_META.DRAFT;
            const isActive = reg._id === activeRegId;
            return (
              <button
                key={reg._id}
                onClick={() => setActiveRegId(reg._id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  isActive
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-900"
                }`}
              >
                {reg.session ?? reg.semester ?? reg._id.slice(-6)}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    isActive ? "bg-blue-700 text-white" : meta.badge
                  }`}
                >
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {activeReg && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            label="Semester"
            value={activeReg.semester ?? "—"}
            color="blue"
          />
          <SummaryCard
            label="Session"
            value={activeReg.session ?? "—"}
            color="indigo"
          />
          <SummaryCard label="Courses" value={courses.length} color="teal" />
          <SummaryCard
            label="Total Units"
            value={totalUnits}
            color="purple"
            extra={
              statusMeta && (
                <span
                  className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusMeta.badge}`}
                >
                  {statusMeta.icon}
                  {statusMeta.label}
                </span>
              )
            }
          />
        </div>
      )}

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
          <FaInbox className="text-4xl mx-auto mb-3" />
          <p>No courses in this registration.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    "#",
                    "Code",
                    "Course Title",
                    "Credit Units",
                    "Type",
                    "Level",
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
                {courses.map((item, idx) => {
                  const courseData = item.course ?? item;

                  return (
                    <tr
                      key={courseData._id ?? idx}
                      className="hover:bg-blue-50 group transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 font-black text-blue-900 text-xs">
                        {courseData.code ?? "—"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800 group-hover:text-blue-900 transition-colors">
                        {courseData.title ?? "—"}
                      </td>
                      <td className="px-6 py-4 font-black text-blue-900 text-center">
                        {item.creditUnits ?? courseData.creditUnits ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            courseData.type === "CORE"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {courseData.type ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs font-semibold">
                        {courseData.level ?? level ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-3 font-black text-gray-700 text-right text-sm"
                  >
                    Total Credit Units:
                  </td>
                  <td className="px-6 py-3 font-black text-blue-900 text-base">
                    {totalUnits}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
