import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaBook,
  FaArrowRight,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeStudentsCount: 0,
    lecturerCount: 0,
    courseCount: 0,
    pendingRegistrationsCount: 0,
  });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = localStorage.getItem("firstName") || "Admin";
  const role = localStorage.getItem("role") || "ADMIN";

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Admin Statistics
        const statsRes = await api.get("/admin/stats");
        if (statsRes.data.data) {
          setStats(statsRes.data.data);
        }

        // 2. Fetch Pending Registrations (Limited to 5 for dashboard preview)
        const pendingRes = await api.get("/registrations?status=SUBMITTED");
        if (pendingRes.data.data) {
          setPendingApprovals(pendingRes.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Admin Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const STATS_CARDS = [
    {
      label: "Total Students",
      value: stats.activeStudentsCount,
      icon: FaUsers,
      color: "text-blue-600",
    },
    {
      label: "Total Lecturers",
      value: stats.lecturerCount,
      icon: FaChalkboardTeacher,
      color: "text-purple-600",
    },
    {
      label: "Total Courses",
      value: stats.courseCount,
      icon: FaBook,
      color: "text-green-600",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingRegistrationsCount,
      icon: FaClipboardCheck,
      color: "text-orange-600",
    },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-blue-900 text-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="bg-blue-600 rounded-2xl px-8 py-7 flex items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0 border-4 border-blue-700">
            <FaUserCircle className="text-blue-900 text-4xl" />
          </div>

          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
              {today}
            </p>
            <h1 className="text-white text-2xl font-black leading-snug">
              {firstName} Overview
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              {role} Account &mdash;{">"} University Management Portal
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
          <span className="bg-green-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            Active
          </span>
          <span className="text-blue-300 text-xs">Admin</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-xl px-5 py-5 flex flex-col gap-1 hover:border-blue-900 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <p className="text-2xl font-black text-blue-900">{value}</p>
              <Icon className={`${color} text-lg opacity-80`} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-snug">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Pending Approvals Section */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FaClipboardCheck className="text-blue-900 text-base" />
            <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
              Recent Course Registrations
            </p>
          </div>
          <Link
            to="/user-portal/admin-registrations"
            className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline"
          >
            Manage All <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {pendingApprovals.length > 0 ? (
            pendingApprovals.map((reg) => (
              <div
                key={reg._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 group transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-900 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <FaUserCircle className="text-blue-900 group-hover:text-white text-xs transition-colors duration-200" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800 group-hover:text-blue-900 transition-colors capitalize">
                      {reg.student?.firstName} {reg.student?.lastName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Level: {reg.level} &bull; {reg.courses?.length} Courses
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-right">
                  <span className="flex items-center gap-1 text-xs uppercase font-bold text-orange-600">
                    Pending Review
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    ID: {reg._id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center flex flex-col items-center gap-3">
              <FaCheckCircle className="text-gray-200 text-4xl" />
              <p className="text-gray-500 text-sm">
                All course registrations have been processed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
