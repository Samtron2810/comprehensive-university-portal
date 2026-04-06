import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const SOCIALS = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Logo & Tagline */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded flex items-center justify-center">
              <span className="text-blue-950 text-xs font-black tracking-tight">
                CU
              </span>
            </div>
            <div className="leading-tight">
              <p className="text-xs font-black uppercase tracking-widest text-white">
                Comprehensive
              </p>
              <p className="text-xs font-medium uppercase tracking-widest text-blue-300">
                University
              </p>
            </div>
          </div>
          <p className="text-blue-300 text-xs mt-1 max-w-xs leading-relaxed">
            Academic excellence, built for the future.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black uppercase tracking-widest text-blue-300 mb-1">
            Contact
          </p>
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Phone: </span>(303)
            631-9860
          </p>
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Email: </span>
            info@comprehensive.edu
          </p>
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Address: </span>
            Comprehensive University, Since 1869
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-black uppercase tracking-widest text-blue-300">
            Follow Us
          </p>
          <div className="flex gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full border border-blue-700 flex items-center justify-center text-blue-300 hover:bg-white hover:text-blue-950 hover:border-white transition-all duration-200"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-blue-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-xs text-blue-400 uppercase tracking-widest text-center">
            © {new Date().getFullYear()} Comprehensive University. Academic
            Excellence Since 1999.
          </p>
        </div>
      </div>
    </footer>
  );
}
