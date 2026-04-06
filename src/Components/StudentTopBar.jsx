import { useState, useRef, useEffect } from "react";
import {
  FaSchool,
  FaBell,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

//  Component

export default function PortalTopBar() {
  //  Mock Data (replace with real auth context later)
  let usernameInputted = localStorage.getItem("username");
  const STUDENT = {
    name: usernameInputted || "Student",
    level: "300 Level",
    avatar: null, // replace with actual image path e.g. "/assets/images/avatar.jpg"
    notifications: 15,
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="w-full px-6 py-3 flex items-center justify-between gap-6">
        {/*  Logo  */}
        <Link to="/" className="flex items-center gap-2.5 select-none shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-900 rounded text-white">
            <FaSchool className="text-base" />
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

        {/*  Search Bar  */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-full px-5 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-900 focus:bg-white transition-all duration-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/*  Right Side  */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-500 hover:text-blue-900 transition-colors duration-200 cursor-pointer">
            <FaBell className="text-lg" />
            {STUDENT.notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center leading-none">
                {STUDENT.notifications}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {/* Avatar */}
              {STUDENT.avatar ? (
                <img
                  src={STUDENT.avatar}
                  alt={STUDENT.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-900"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center shrink-0">
                  <FaUserCircle className="text-white text-lg" />
                </div>
              )}

              {/* Name */}
              <span className="text-sm font-bold text-gray-700 hidden sm:block">
                {STUDENT.name}
              </span>
              <FaChevronDown
                className={`text-xs text-gray-400 transition-transform duration-200 hidden sm:block ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                {/* Student Info */}
                <div className="px-5 py-4 border-b border-gray-100 bg-blue-50">
                  <p className="text-sm font-black text-blue-900">
                    {STUDENT.name}
                  </p>
                  {/* <p className="text-xs text-gray-500 mt-0.5">
                    {STUDENT.level}
                  </p> */}
                </div>

                {/* Dropdown Items */}
                <ul className="py-2">
                  <li>
                    <Link
                      to="/portal/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                    >
                      <FaUserCircle className="text-gray-400 text-base" />
                      View Profile
                    </Link>
                  </li>
                  <li className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        // hook up logout logic here
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="text-base" />
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
