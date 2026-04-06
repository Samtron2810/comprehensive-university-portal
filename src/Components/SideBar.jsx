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

//  Nav Items

const NAV_ITEMS = [
  {
    icon: FaTachometerAlt,
    label: "Dashboard",
    to: "/student-portal/dashboard",
  },
  { icon: FaCreditCard, label: "Payment Info", to: "/student-portal/payment" },
  {
    icon: FaClipboardList,
    label: "Registration",
    to: "/student-portal/registration",
  },
  { icon: FaBookOpen, label: "Courses", to: "/student-portal/courses" },
  {
    icon: FaCalendarMinus,
    label: "Drop Semester",
    to: "/student-portal/drop",
  },
  { icon: FaPollH, label: "Result", to: "/student-portal/result" },
  { icon: FaBell, label: "Notice", to: "/student-portal/notice" },
  { icon: FaCalendarAlt, label: "Schedule", to: "/student-portal/schedule" },
];

//  Component

export default function Sidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={`flex flex-col bg-blue-900 shrink-0 h-[calc(100vh-70px)] transition-all duration-300 ${
        expanded ? "w-56" : "w-16"
      }`}
    >
      {/*  Toggle Button  */}
      <div
        className={`flex items-center py-5 px-3 border-b border-blue-800 ${
          expanded ? "justify-end" : "justify-center"
        }`}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-300 hover:text-white transition-colors duration-200 p-1"
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? (
            <FaTimes className="text-base" />
          ) : (
            <FaBars className="text-base" />
          )}
        </button>
      </div>

      {/*  Nav Links  */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            title={!expanded ? label : ""}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                expanded ? "" : "justify-center"
              } ${
                isActive
                  ? "bg-white text-blue-900"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`text-base shrink-0 transition-colors duration-200 ${
                    isActive
                      ? "text-blue-900"
                      : "text-blue-300 group-hover:text-white"
                  }`}
                />
                {/* Label — only visible when expanded */}
                {expanded && (
                  <span className="whitespace-nowrap overflow-hidden">
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/*  Logout  */}
      <div className="px-2 py-1 border-t border-blue-800">
        <button
          onClick={() => {
            // hook up logout logic here
            localStorage.setItem("username", "");
            navigate("/student-login", { replace: true });
          }}
          title={!expanded ? "Logout" : ""}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-blue-200 hover:bg-red-500 hover:text-white transition-all duration-200 group ${
            expanded ? "" : "justify-center"
          }`}
        >
          <FaSignOutAlt className="text-base shrink-0 text-blue-300 group-hover:text-white transition-colors duration-200" />
          {expanded && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
