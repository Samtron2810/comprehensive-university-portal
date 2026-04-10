import { useState, useEffect } from "react";
import {
  FaPrint,
  FaRegCalendarAlt,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "8:00am",
  "9:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "1:00pm",
  "2:00pm",
  "3:00pm",
  "4:00pm",
];

// Color mapping logic - can be moved to a utility file
const COURSE_COLORS = {
  CSC: "bg-blue-50 text-blue-900 border-blue-200",
  MTH: "bg-red-50 text-red-900 border-red-200",
  GST: "bg-orange-50 text-orange-900 border-orange-200",
  DEFAULT: "bg-gray-50 text-gray-700 border-gray-200",
};

const getColorClass = (code) => {
  const prefix = code?.split(" ")[0];
  return COURSE_COLORS[prefix] || COURSE_COLORS.DEFAULT;
};

export default function SchedulePage() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        // We fetch the schedule based on the student's level and department
        const response = await api.get(`/timetable/student/${studentId}`);
        setTimetable(response.data.data || []);
      } catch (err) {
        console.error("Error fetching timetable:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchSchedule();
  }, [studentId]);

  const getSlot = (day, time) => {
    return timetable.find((s) => s.day === day && s.time === time) || null;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-blue-900">
        <FaSpinner className="animate-spin text-3xl mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Loading Timetable...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Lecture Schedule
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your personalized weekly timetable for the current semester.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all shadow-sm no-print"
        >
          <FaPrint /> Print Schedule
        </button>
      </div>

      {/* Info Alert */}
      <div className="flex items-center gap-3 bg-blue-900 text-white px-5 py-3 rounded-2xl text-xs font-medium">
        <FaInfoCircle className="text-blue-300" />
        <p>
          This schedule is automatically updated based on your course
          registrations.
        </p>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm printable-area">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 table-fixed">
            <thead>
              <tr className="bg-blue-900">
                <th className="px-4 py-4 text-left text-[10px] font-black text-blue-300 uppercase tracking-widest w-24">
                  Time
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="px-4 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TIME_SLOTS.map((time) => (
                <tr
                  key={time}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-4 py-5 text-[10px] font-black text-gray-400 border-r border-gray-100 bg-gray-50/30">
                    {time}
                  </td>
                  {DAYS.map((day) => {
                    const slot = getSlot(day, time);
                    return (
                      <td key={day} className="px-2 py-2 align-top">
                        {slot ? (
                          <div
                            className={`border rounded-xl px-3 py-3 h-full min-h-20 transition-all hover:shadow-md ${getColorClass(slot.code)}`}
                          >
                            <p className="text-[11px] font-black leading-tight">
                              {slot.code}
                            </p>
                            <p className="text-[10px] font-bold mt-1 leading-snug opacity-80 line-clamp-2">
                              {slot.title}
                            </p>
                            <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between opacity-60">
                              <span className="text-[9px] font-black uppercase">
                                {slot.venue}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full min-h-20 group-hover:bg-gray-50/50 rounded-lg transition-colors" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-400 no-print">
        <FaRegCalendarAlt className="text-sm" />
        <p className="text-[10px] font-bold uppercase tracking-widest italic">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
