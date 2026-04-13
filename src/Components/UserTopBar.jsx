import { useState, useRef, useEffect } from "react";
import {
  FaSchool,
  FaBell,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function PortalTopBar() {
  const navigate = useNavigate();
  const firstName = localStorage.getItem("firstName") || "Student";
  const lastName = localStorage.getItem("lastName") || "";
  const level = localStorage.getItem("level") || "N/A";
  const role = localStorage.getItem("role") || "N/A";

  const STUDENT = {
    name: `${firstName} ${lastName}`,
    level: level,
    role: role,
    notifications: 0,
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 py-3 flex items-center justify-between gap-6">
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

        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-100 border border-gray-200 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-blue-900"
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button className="relative p-2 text-gray-500 hover:text-blue-900 transition-colors">
            <FaBell className="text-lg" />
            {STUDENT.notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                {STUDENT.notifications}
              </span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <span className="text-sm font-bold text-gray-700 hidden sm:block capitalize">
                {STUDENT.name}
              </span>
              <FaChevronDown
                className={`text-xs text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden capitalize">
                <div className="px-5 py-4 border-b border-gray-100 bg-blue-50">
                  <p className="text-sm font-black text-blue-900">
                    {STUDENT.name}
                  </p>
                  <p className="text-xs text-gray-500 py-1">{STUDENT.level}</p>
                  <p className="text-xs text-gray-500 font-extrabold pt-1">
                    {STUDENT.role}
                  </p>
                </div>
                <ul className="py-2">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt />
                      Logout
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
