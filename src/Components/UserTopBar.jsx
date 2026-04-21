import { useState, useRef, useEffect } from "react";
import {
  FaSchool,
  FaBell,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

export default function PortalTopBar() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // ── Get User Data from LocalStorage ───────────────────────────────────────
  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const level = localStorage.getItem("level");
  const role = localStorage.getItem("role") || "USER";

  // Format the name: if both are missing, fallback to a generic role title
  const displayName =
    firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : role.charAt(0) + role.slice(1).toLowerCase();

  const USER_INFO = {
    name: displayName,
    level: level || "N/A",
    role: role,
    notifications: 0, // Logic for notifications can be added here later
  };

  // ── Close dropdown when clicking outside ──────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 py-3 flex items-center justify-between gap-6">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-900 rounded text-white">
            <FaSchool />
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="text-xs font-black tracking-widest text-blue-900 uppercase">
              Comprehensive
            </p>
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">
              University
            </p>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-100 border border-gray-200 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-blue-900"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="relative p-2 text-gray-500 hover:text-blue-900 transition-colors">
            <FaBell className="text-lg" />
            {USER_INFO.notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                {USER_INFO.notifications}
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <span className="text-sm font-bold text-gray-700 hidden sm:block capitalize">
                {USER_INFO.name}
              </span>
              <FaChevronDown
                className={`text-xs text-gray-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-blue-50">
                  <p className="text-md font-black text-blue-900 capitalize">
                    {USER_INFO.name}
                  </p>

                  {/* Show level only for Students */}
                  {role === "STUDENT" && level && (
                    <p className="text-sm text-gray-500 py-1">
                      {USER_INFO.level} Level
                    </p>
                  )}

                  <p className="text-xs text-blue-700 font-extrabold uppercase tracking-widest pt-1">
                    {USER_INFO.role}
                  </p>
                </div>

                <ul className="py-1">
                  <li>
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <FaSignOutAlt />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
