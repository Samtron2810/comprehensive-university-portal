import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../api/axiosInstance";
import {
  FaChartBar,
  FaSpinner,
  FaExclamationTriangle,
  FaInbox,
  FaDownload,
  FaFilter,
} from "react-icons/fa";

/* ── Grade → colour mapping ── */
const GRADE_BADGE = {
  A: "bg-green-100  text-green-700",
  B: "bg-blue-100   text-blue-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-orange-100 text-orange-700",
  E: "bg-red-100    text-red-600",
  F: "bg-red-200    text-red-700",
};

function gradeBadge(grade) {
  return GRADE_BADGE[grade?.toUpperCase()] ?? "bg-gray-100 text-gray-600";
}

/* ── GPA colour ── */
function gpaColor(gpa) {
  if (!gpa && gpa !== 0) return "text-gray-500";
  if (gpa >= 4.5) return "text-green-600";
  if (gpa >= 3.5) return "text-blue-600";
  if (gpa >= 2.4) return "text-yellow-600";
  return "text-red-600";
}

export default function Result() {
  /* ─────── state ─────── */
  const [results, setResults] = useState([]);
  const [gpaData, setGpaData] = useState(null); // { gpa, cgpa, ... }
  const [sessions, setSessions] = useState([]); // derived from results
  const [activeSession, setActiveSession] = useState("all");

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const matric = localStorage.getItem("matricNumber") || "";

  /* ─────── fetch results + GPA in parallel ─────── */
  const fetchAll = useCallback(async (session) => {
    try {
      setLoading(true);
      setError(null);

      const params = session && session !== "all" ? { session } : {};

      const [resultsRes, gpaRes] = await Promise.allSettled([
        axiosInstance.get("/results/my-results", { params }),
        axiosInstance.get("/gpa/my-gpa"),
      ]);

      if (resultsRes.status === "fulfilled") {
        const raw = resultsRes.value.data;
        // Backend always returns response.data.data
        const list = Array.isArray(raw.data) ? raw.data : [];
        setResults(list);

        // Derive unique sessions for the filter dropdown
        const uniqueSessions = [
          ...new Set(list.map((r) => r.session).filter(Boolean)),
        ]
          .sort()
          .reverse();
        setSessions(uniqueSessions);
      } else {
        console.error("Results fetch failed:", resultsRes.reason);
        setError("Could not load your results. Please try again.");
      }

      if (gpaRes.status === "fulfilled") {
        const raw = gpaRes.value.data;
        // Backend always returns response.data.data
        setGpaData(raw.data ?? raw);
      } else {
        console.error("GPA fetch failed:", gpaRes.reason);
        // Don't block the page — GPA cards just show "—"
      }
    } catch (err) {
      console.error("Result page error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(activeSession === "all" ? null : activeSession);
  }, [fetchAll, activeSession]);

  /* ─────── download transcript ─────── */
  const handleDownloadTranscript = async () => {
    try {
      setDownloading(true);
      const response = await axiosInstance.get("/results/transcript", {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"] ?? "application/pdf";
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transcript_${matric || "student"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Transcript download error:", err);
      alert("Failed to download transcript. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  /* ─────── derived values ─────── */
  const cgpa = gpaData?.cgpa ?? gpaData?.CGPA ?? null;
  const currentGpa = gpaData?.gpa ?? gpaData?.GPA ?? null;
  const totalUnits = gpaData?.totalCreditUnits ?? gpaData?.totalUnits ?? null;

  // Group results by semester for sectioned display
  const grouped = results.reduce((acc, r) => {
    const key = r.semester
      ? `${r.session ?? ""} — ${r.semester}`
      : (r.session ?? "General");
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
  const groupKeys = Object.keys(grouped);

  /* ─────── loading ─────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-blue-600 gap-3">
        <FaSpinner className="animate-spin text-2xl" />
        <span className="font-medium text-lg">Loading your results…</span>
      </div>
    );
  }

  /* ─────── error ─────── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-600">
        <FaExclamationTriangle className="text-4xl" />
        <p className="font-medium text-center px-6">{error}</p>
        <button
          onClick={() =>
            fetchAll(activeSession === "all" ? null : activeSession)
          }
          className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
            <FaChartBar className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">My Results</h1>
            <p className="text-sm text-gray-500 capitalize">
              {firstName} {lastName}
              {matric ? ` - ${matric}` : ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadTranscript}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm self-start sm:self-auto"
        >
          {downloading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaDownload />
          )}
          {downloading ? "Downloading…" : "Download Transcript"}
        </button>
      </div>

      {/* ── GPA summary cards  */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GpaCard label="CGPA" value={cgpa} color="blue" />
        <GpaCard label="Current GPA" value={currentGpa} color="indigo" />
        <GpaCard
          label="Total Units"
          value={totalUnits}
          color="teal"
          isGpa={false}
        />
        <GpaCard
          label="Courses Sat"
          value={results.length}
          color="purple"
          isGpa={false}
        />
      </div>

      {/* ── Session filter ── */}
      {sessions.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <FaFilter className="text-gray-400 text-sm" />
          <span className="text-sm font-medium text-gray-600">
            Filter by session:
          </span>
          <div className="flex flex-wrap gap-2">
            <FilterBtn
              label="All Sessions"
              active={activeSession === "all"}
              onClick={() => setActiveSession("all")}
            />
            {sessions.map((s) => (
              <FilterBtn
                key={s}
                label={s}
                active={activeSession === s}
                onClick={() => setActiveSession(s)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {results.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 shadow-sm">
          <FaInbox className="text-5xl mx-auto mb-3" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm mt-1">
            {activeSession !== "all"
              ? "No results for the selected session. Try a different filter."
              : "Results will appear here once they are published by your lecturers."}
          </p>
        </div>
      )}

      {/* ── Results grouped by semester ── */}
      {groupKeys.map((group) => {
        const groupResults = grouped[group];
        const groupUnits = groupResults.reduce(
          (s, r) => s + (r.creditUnit ?? r.unit ?? 0),
          0,
        );
        const groupPoints = groupResults.reduce(
          (s, r) =>
            s +
            (r.gradePoint ?? r.qualityPoint ?? 0) *
              (r.creditUnit ?? r.unit ?? 0),
          0,
        );
        const groupGpa =
          groupUnits > 0 ? (groupPoints / groupUnits).toFixed(2) : null;

        return (
          <div
            key={group}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
          >
            {/* Group header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-semibold text-gray-700">{group}</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">
                  {groupResults.length} course
                  {groupResults.length !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-500">{groupUnits} units</span>
                {groupGpa && (
                  <span
                    className={`font-bold ${gpaColor(parseFloat(groupGpa))}`}
                  >
                    GPA: {groupGpa}
                  </span>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr className="text-gray-500 uppercase text-xs tracking-wide">
                    <th className="text-left px-4 py-3">#</th>
                    <th className="text-left px-4 py-3">Course Code</th>
                    <th className="text-left px-4 py-3">Course Title</th>
                    <th className="text-center px-4 py-3">Units</th>
                    <th className="text-center px-4 py-3">Score</th>
                    <th className="text-center px-4 py-3">Grade</th>
                    <th className="text-center px-4 py-3">Grade Points</th>
                    <th className="text-center px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {groupResults.map((result, idx) => {
                    const grade = result.grade?.toUpperCase();
                    const passed = grade && grade !== "F" && grade !== "E";
                    return (
                      <tr
                        key={result._id ?? idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-blue-700">
                          {result.courseCode ??
                            result.course?.courseCode ??
                            "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-800 max-w-xs">
                          {result.courseTitle ??
                            result.course?.courseTitle ??
                            result.course?.title ??
                            "—"}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {result.creditUnit ?? result.unit ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-gray-800">
                          {result.score ?? result.totalScore ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {grade ? (
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeBadge(grade)}`}
                            >
                              {grade}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {result.gradePoint ?? result.qualityPoint ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {grade ? (
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                passed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {passed ? "Passed" : "Failed"}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Helper: GPA summary card ── */
function GpaCard({ label, value, color, isGpa = true }) {
  const colors = {
    blue: "bg-blue-50   text-blue-700   border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    teal: "bg-teal-50   text-teal-700   border-teal-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const displayValue =
    value !== null && value !== undefined
      ? isGpa
        ? parseFloat(value).toFixed(2)
        : value
      : "—";

  return (
    <div className={`rounded-xl border p-4 flex flex-col ${colors[color]}`}>
      <span className="text-xs font-medium uppercase tracking-wide opacity-70">
        {label}
      </span>
      <span className="text-2xl font-bold mt-1">{displayValue}</span>
    </div>
  );
}

/* ── Helper: filter button ── */
function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
      }`}
    >
      {label}
    </button>
  );
}
