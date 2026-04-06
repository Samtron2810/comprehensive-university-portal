import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaArrowRight,
} from "react-icons/fa";

const QUICK_LINKS = [
  {
    icon: FaClipboardList,
    label: "Check Admission Status",
    to: "/admissions/status",
  },
  {
    icon: FaCalendarAlt,
    label: "View Academic Calendar",
    to: "/calendar",
  },
  {
    icon: FaMapMarkedAlt,
    label: "Campus Map & Facilities",
    to: "/campus-map",
  },
];

export default function QuickLinks() {
  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-5">
          Quick Links
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_LINKS.map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className="group flex items-center gap-4 p-5 rounded-lg border border-gray-200 hover:border-blue-900 hover:shadow-md hover:bg-blue-50 bg-white transition-all duration-200"
            >
              <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-900 transition-colors duration-200">
                <Icon className="text-blue-900 group-hover:text-white text-base transition-colors duration-200" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-900 leading-snug transition-colors duration-200">
                {label}
              </span>
              <FaArrowRight className="ml-auto text-xs text-gray-300 group-hover:text-blue-900 transition-colors duration-200" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
