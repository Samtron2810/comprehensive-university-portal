import { useState } from "react";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaSearch,
  FaFileAlt,
  FaGraduationCap,
  FaClipboardList,
} from "react-icons/fa";

// data displayed

const REQUIREMENTS = [
  {
    icon: FaGraduationCap,
    title: "O'Level / WAEC Results",
    description:
      "Minimum of 5 credits including English Language and Mathematics obtained in not more than two sittings.",
  },
  {
    icon: FaFileAlt,
    title: "UTME / Direct Entry Score",
    description:
      "A valid JAMB UTME score of at least 180, or Direct Entry qualifications for eligible candidates.",
  },
  {
    icon: FaClipboardList,
    title: "Post-UTME Screening",
    description:
      "All candidates must participate in the CU Post-UTME screening exercise to be considered for admission.",
  },
  {
    icon: FaCheckCircle,
    title: "Medical Fitness",
    description:
      "Candidates must pass a medical fitness test conducted by the university's health centre before registration.",
  },
];

const DATES = [
  { event: "UTME Registration Opens", date: "January 15, 2025" },
  { event: "Post-UTME Screening", date: "July 10 – July 25, 2025" },
  { event: "Admission List - 1st Batch", date: "August 5, 2025" },
  { event: "Admission List - 2nd Batch", date: "September 1, 2025" },
  { event: "Acceptance Fee Deadline", date: "September 30, 2025" },
  { event: "Resumption & Registration", date: "October 15, 2025" },
];

// admision status form check

function CheckStatusForm() {
  const [matricNo, setMatricNo] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleCheck = () => {
    if (matricNo.trim()) setSubmitted(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-1">
        Check Admission Status
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Enter your JAMB Registration Number or Application ID to check your
        status.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="e.g. 12345678AB"
          value={matricNo}
          onChange={(e) => {
            setMatricNo(e.target.value);
            setSubmitted(false);
          }}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-900 transition-colors"
        />
        <button
          onClick={handleCheck}
          className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-black uppercase tracking-widest px-7 py-3 rounded-lg transition-colors duration-200"
        >
          <FaSearch className="text-xs" /> Check Status
        </button>
      </div>

      {submitted && (
        <div className="mt-5 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800">
            No record found for <span className="font-black">"{matricNo}"</span>
            . Please confirm your details and try again, or visit the admissions
            office.
          </p>
        </div>
      )}
    </div>
  );
}

// PAGE displaying

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/*  Page Hero  */}
        <section className="bg-blue-900 py-16 px-8 md:px-20">
          <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-3">
            Admissions
          </p>
          <h1 className="text-white font-black text-4xl md:text-5xl leading-tight max-w-2xl">
            Your Journey <br /> Starts Here.
          </h1>
          <p className="mt-4 text-blue-200 text-base leading-relaxed max-w-xl">
            Everything you need to know about gaining admission into
            Comprehensive University - requirements, dates, and status checks.
          </p>
        </section>

        {/* Admission Requirements */}
        <section className="py-16 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-2">
              Admission Requirements
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-10">
              What You Need to Apply
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {REQUIREMENTS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-5 p-6 border border-gray-200 rounded-xl hover:border-blue-900 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-900 transition-colors duration-200">
                    <Icon className="text-blue-900 group-hover:text-white text-base transition-colors duration-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-800 mb-1 group-hover:text-blue-900 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/*  Check Admission Status  */}
        <section className="bg-gray-50 py-16 px-8 md:px-20">
          <div className="max-w-3xl mx-auto">
            <CheckStatusForm />
          </div>
        </section>
        {/*  Important Dates  */}
        <section className="py-16 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-2">
              Important Dates
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-10">
              Key Deadlines & Timelines
            </h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest">
                      Event
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DATES.map(({ event, date }, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50 transition-colors group"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700 group-hover:text-blue-900 transition-colors">
                        {event}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-900 text-xs" />
                          {date}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
