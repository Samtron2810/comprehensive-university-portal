import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCreditCard,
  FaClipboardList,
  FaBookOpen,
  FaCalendarMinus,
  FaPollH,
  FaBell,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSpinner,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaHistory,
} from "react-icons/fa";
import api from "../api/axiosInstance";

// ─── Nav Configuration by Role ────────────────────────────────────────────────

const NAV_CONFIG = {
  STUDENT: [
    {
      icon: FaTachometerAlt,
      label: "Dashboard",
      to: "/user-portal/student-dashboard",
    },
    {
      icon: FaCreditCard,
      label: "Payments",
      to: "/user-portal/student-payment",
    },
    {
      icon: FaClipboardList,
      label: "Registration",
      to: "/user-portal/student-registration",
    },
    { icon: FaBookOpen, label: "Courses", to: "/user-portal/student-courses" },

    { icon: FaPollH, label: "Result", to: "/user-portal/student-result" },
    {
      icon: FaCalendarMinus,
      label: "Drop Semester",
      to: "/user-portal/student-drop",
      disabled: true,
    },

    {
      icon: FaBell,
      label: "Notice",
      to: "/user-portal/student-notice",
      disabled: true,
    },
    {
      icon: FaCalendarAlt,
      label: "Schedule",
      to: "/user-portal/student-schedule",
      disabled: true,
    },
  ],
  ADMIN: [
    {
      icon: FaTachometerAlt,
      label: "Dashboard",
      to: "/user-portal/admin-dashboard",
    },
    { icon: FaUsers, label: "Students", to: "/user-portal/admin-students" },
    {
      icon: FaChalkboardTeacher,
      label: "Lecturers",
      to: "/user-portal/admin-lecturers",
    },
    { icon: FaBookOpen, label: "Courses", to: "/user-portal/admin-courses" },
    {
      icon: FaClipboardCheck,
      label: "Approvals",
      to: "/user-portal/admin-approvals",
    },
    { icon: FaHistory, label: "Sessions", to: "/user-portal/admin-sessions" },
    { icon: FaHistory, label: "Semesters", to: "/user-portal/admin-semesters" },
  ],
  LECTURER: [
    {
      icon: FaTachometerAlt,
      label: "Dashboard",
      to: "/user-portal/lecturer-dashboard",
    },
    // Future lecturer links can be added here
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(window.innerWidth > 600);
  const [loggingOut, setLoggingOut] = useState(false);

  // Get current role from localStorage
  const userRole = localStorage.getItem("role") || "STUDENT";
  const navItems = NAV_CONFIG[userRole] || NAV_CONFIG.STUDENT;

  // ── Logout — calls API then clears localStorage ───────────────────────────
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside
      className={`flex flex-col bg-blue-900 shrink-0 h-full transition-all duration-300 ${
        expanded ? "w-56" : "w-16"
      }`}
    >
      {/* ── Toggle Button ── */}
      <div
        className={`flex items-center py-5 px-3 border-b border-blue-800 ${
          expanded ? "justify-end" : "justify-center"
        }`}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-300 hover:text-white transition-colors duration-200 p-1"
          title={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <FaTimes className="text-base" />
          ) : (
            <FaBars className="text-base" />
          )}
        </button>
      </div>

      {/* ── Nav Links ── */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, to, disabled }) => (
          <NavLink
            key={to}
            to={disabled ? "#" : to}
            onClick={(e) => {
              if (disabled) e.preventDefault();
            }}
            title={!expanded ? label : ""}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                expanded ? "" : "justify-center"
              } ${
                disabled
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : isActive
                    ? "bg-white text-blue-900"
                    : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`text-base shrink-0 ${
                    disabled
                      ? "text-blue-400"
                      : isActive
                        ? "text-blue-900"
                        : "text-blue-300 group-hover:text-white"
                  }`}
                />
                {expanded && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="px-2 py-1 mb-5 border-t border-b border-blue-800">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title={!expanded ? "Logout" : ""}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-blue-200 hover:bg-red-500 hover:text-white transition-all duration-200 group disabled:opacity-60 ${
            expanded ? "" : "justify-center"
          }`}
        >
          {loggingOut ? (
            <FaSpinner className="text-base shrink-0 animate-spin" />
          ) : (
            <FaSignOutAlt className="text-base shrink-0 text-red-500 group-hover:text-white transition-colors duration-200" />
          )}
          {expanded && (
            <span className="whitespace-nowrap">
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
