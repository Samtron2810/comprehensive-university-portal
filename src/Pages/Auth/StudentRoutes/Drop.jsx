import { useState } from "react";
import {
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";

//  Mock Data

const COURSES = [
  { code: "CSC 301", title: "Object Oriented Programming", units: 3 },
  { code: "CSC 303", title: "Fundamentals of Database Systems", units: 3 },
  { code: "CSC 305", title: "Computer Networks", units: 3 },
  { code: "CSC 307", title: "Software Engineering", units: 3 },
  { code: "MTH 301", title: "Numerical Methods", units: 3 },
  { code: "GST 301", title: "Entrepreneurship Studies", units: 2 },
];

//  Page

export default function DropSemesterPage() {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (reason.trim().length > 0) setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/*  Page Header  */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Drop Semester</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your current semester courses and submit a drop request if
          necessary.
        </p>
      </div>

      {/*  Warning Banner  */}
      <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-300 rounded-2xl px-6 py-5">
        <FaExclamationTriangle className="text-yellow-500 text-xl shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-yellow-800">Important Notice</p>
          <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
            Dropping a semester is a serious academic decision. It will affect
            your academic record and may impact your funding or scholarship
            status. Please consult your academic advisor before proceeding.
          </p>
        </div>
      </div>

      {/*  Current Semester Courses  */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            Current Semester Courses
          </p>
          <span className="text-xs text-gray-400 font-medium">
            2024/2025 — First Semester
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {COURSES.map((course) => (
                <tr
                  key={course.code}
                  className="hover:bg-gray-50 transition-colors"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*  Drop Request Form  */}
      {!submitted ? (
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-7 shadow-sm flex flex-col gap-5">
          <div>
            <p className="text-sm font-black text-gray-800 mb-1">
              Reason for Dropping Semester
            </p>
            <p className="text-xs text-gray-400">
              Please provide a detailed reason for your drop request. This will
              be reviewed by the academic office.
            </p>
          </div>

          <textarea
            rows={5}
            placeholder="e.g. Medical emergency, financial difficulties, personal reasons..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-900 bg-gray-50 focus:bg-white transition-all duration-200 resize-none placeholder-gray-300"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={reason.trim().length === 0}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest px-7 py-3 rounded-lg transition-colors duration-200"
            >
              <FaTimesCircle className="text-sm" />
              Submit Drop Request
            </button>
            <p className="text-xs text-gray-400">
              This action cannot be undone without visiting the registrar's
              office.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-8 flex flex-col items-center text-center gap-3 shadow-sm">
          <FaCheckCircle className="text-green-500 text-4xl" />
          <p className="text-base font-black text-green-800">
            Drop Request Submitted
          </p>
          <p className="text-sm text-green-700 max-w-md leading-relaxed">
            Your semester drop request has been submitted successfully. The
            academic office will review your request and contact you within 5
            working days.
          </p>
        </div>
      )}
    </div>
  );
}
