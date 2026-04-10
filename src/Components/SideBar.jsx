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
} from "react-icons/fa";

const NAV_ITEMS = [
  {
    icon: FaTachometerAlt,
    label: "Dashboard",
    to: "/user-portal/student-dashboard",
  },
  {
    icon: FaCreditCard,
    label: "Payment Info",
    to: "/user-portal/student-payment",
  },
  {
    icon: FaClipboardList,
    label: "Registration",
    to: "/user-portal/student-registration",
  },
  { icon: FaBookOpen, label: "Courses", to: "/user-portal/student-courses" },
  {
    icon: FaCalendarMinus,
    label: "Drop Semester",
    to: "/user-portal/student-drop",
  },
  { icon: FaPollH, label: "Result", to: "/user-portal/student-result" },
  { icon: FaBell, label: "Notice", to: "/user-portal/student-notice" },
  {
    icon: FaCalendarAlt,
    label: "Schedule",
    to: "/user-portal/student-schedule",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`flex flex-col bg-blue-900 shrink-0 h-full transition-all duration-300 ${
        expanded ? "w-56" : "w-16"
      }`}
    >
      <div
        className={`flex items-center py-5 px-3 border-b border-blue-800 ${expanded ? "justify-end" : "justify-center"}`}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-300 hover:text-white p-1"
        >
          {expanded ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                expanded ? "" : "justify-center"
              } ${isActive ? "bg-white text-blue-900" : "text-blue-200 hover:bg-blue-800 hover:text-white"}`
            }
          >
            <Icon className="text-base shrink-0" />
            {expanded && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-1 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-blue-200 hover:bg-red-500 hover:text-white transition-all duration-200 group ${expanded ? "" : "justify-center"}`}
        >
          <FaSignOutAlt className="text-base shrink-0" />
          {expanded && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
