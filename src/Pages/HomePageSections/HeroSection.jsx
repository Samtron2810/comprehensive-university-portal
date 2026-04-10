import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HeroBg from "../../assets/Images/HomeBg.jpg";

export default function Hero() {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden"
      style={{
        backgroundImage: `url(${HeroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-blue-950 opacity-75" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-20 pt-16 pb-10 max-w-3xl">
        {/* Accent line */}
        <div className="w-12 h-1 bg-yellow-400 mb-6 rounded-full" />

        <h1 className="text-white font-black uppercase leading-tight tracking-tight text-4xl md:text-5xl">
          Welcome to the Future <br />
          <span className="text-yellow-400">of Your Education.</span>
        </h1>

        <p className="mt-5 text-gray-300 text-base leading-relaxed max-w-lg">
          Access your courses, grades, schedule, and resources with ease - all
          in one place.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 text-xs font-black uppercase tracking-widest px-7 py-3 rounded transition-colors duration-200"
          >
            Portal Login <FaArrowRight className="text-xs" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 border-2 border-white text-white text-xs font-bold uppercase tracking-widest px-7 py-3 rounded hover:bg-white hover:text-blue-950 transition-colors duration-200"
          >
            Fresher Registeration
          </Link>
        </div>
      </div>

      {/* Fresher Banner */}
      <div className="relative z-10 bg-blue-900 border-t border-white px-8 md:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white text-sm font-semibold tracking-wide">
          <span className="font-black uppercase tracking-widest">
            Fresher?{" "}
          </span>
          Begin your academic journey today.
        </p>
        <Link
          to="/register"
          className="shrink-0 border-2 border-white text-white text-xs font-black uppercase tracking-widest px-6 py-2 hover:bg-white hover:text-blue-900 transition-all duration-200 rounded"
        >
          New Student Registration
        </Link>
      </div>
    </section>
  );
}
