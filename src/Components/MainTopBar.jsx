import { useState } from "react";
import { FaSchool, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

function MainTopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/*  school Logo  */}
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <div className="flex items-center justify-center w-10 h-10 bg-[#1a3a6b] rounded text-white">
            <FaSchool className="text-base" />
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-black tracking-[0.15em] text-[#1a3a6b] uppercase">
              Comprehensive
            </p>
            <p className="text-[10px] font-medium tracking-[0.12em] text-gray-400 uppercase">
              University
            </p>
          </div>
        </Link>

        {/*  Desktop Nav Links  */}
        <ul className="hidden md:flex items-center gap-8">
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            { label: "News & Events", to: "/news" },
            { label: "Admissions", to: "/admission" },
            { label: "Support", to: "/support" },
          ].map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="inline-block text-[13px] font-medium text-gray-600 hover:text-[#1a3a6b] tracking-wide transition-colors duration-150 relative group pb-1"
              >
                {label}
                {/* Underline hover effect */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.75 bg-[#1a3a6b] group-hover:w-full transition-all duration-200"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Login Button  */}
        <Link
          to="/login"
          className="hidden md:flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#0f2548] text-white text-[12px] font-bold tracking-widest uppercase px-5 py-2.5 rounded transition-colors duration-200"
        >
          Portal Login
          <FaUser className="text-[11px]" />
        </Link>

        {/*  Toggle for smaller screen  */}
        <button
          className="md:hidden text-gray-600 hover:text-[#1a3a6b] transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/*  Mobile Dropdown menu  */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <ul className="flex flex-col py-2">
            {[
              { label: "Home", to: "/" },
              { label: "About CU", to: "/about" },
              { label: "News & Events", to: "/news" },
              { label: "Admissions", to: "/admission" },
              { label: "Support", to: "/support" },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-8 py-3 text-[13px] font-medium text-gray-700 hover:text-[#1a3a6b] hover:bg-blue-50 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="px-6 py-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#1a3a6b] text-white text-[12px] font-bold tracking-widest uppercase px-4 py-2.5 rounded w-full"
              >
                Portal Login <FaUser className="text-[11px]" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default MainTopBar;
