import {
  FaLeaf,
  FaFlask,
  FaUsers,
  FaGlobe,
  FaBookOpen,
  FaUniversity,
} from "react-icons/fa";

// DATA DISPLAYED
const VALUES = [
  {
    icon: FaBookOpen,
    title: "Academic Excellence",
    description:
      "We uphold the highest standards of learning, research, and intellectual curiosity across all disciplines.",
  },
  {
    icon: FaUsers,
    title: "Inclusive Community",
    description:
      "We foster a diverse and welcoming environment where every student, staff, and faculty member belongs.",
  },
  {
    icon: FaFlask,
    title: "Innovation & Research",
    description:
      "We drive discovery and real-world impact through cutting-edge research and collaborative problem solving.",
  },
  {
    icon: FaGlobe,
    title: "Global Perspective",
    description:
      "We prepare students to think, lead, and contribute beyond borders in an ever-changing world.",
  },
  {
    icon: FaLeaf,
    title: "Sustainability",
    description:
      "We are committed to building a sustainable campus and instilling environmental responsibility in our community.",
  },
  {
    icon: FaUniversity,
    title: "Integrity",
    description:
      "We operate with transparency, honesty, and accountability in everything we do - academically and institutionally.",
  },
];

const CAMPUS_FACILITIES = [
  {
    title: "Library & Research Centre",
    description:
      "A vast collection of physical and digital resources supporting academic research across all faculties.",
  },
  {
    title: "Engineering & Science Labs",
    description:
      "State-of-the-art laboratories equipped for practical learning, experiments, and innovation projects.",
  },
  {
    title: "Student Recreation Centre",
    description:
      "A modern sports complex with courts, a gym, swimming pool, and recreational spaces for student wellness.",
  },
  {
    title: "On-Campus Hostels",
    description:
      "Safe, comfortable, and affordable on-campus accommodation for both undergraduate and postgraduate students.",
  },
];

// PAGE displaying
export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/*  Page Hero  */}
        <section className="bg-blue-900 py-16 px-8 md:px-20">
          <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-3">
            About Us
          </p>
          <h1 className="text-white font-black text-4xl md:text-5xl leading-tight max-w-2xl">
            Shaping Minds. <br /> Building Futures.
          </h1>
          <p className="mt-4 text-blue-200 text-base leading-relaxed max-w-xl">
            Comprehensive University has stood as a beacon of academic
            excellence, innovation, and character for over 150 years.
          </p>
        </section>

        {/*  History & Mission  */}
        <section className="py-16 px-8 md:px-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-3">
                Our History
              </p>
              <h2 className="text-3xl font-black text-gray-900 leading-snug mb-5">
                Over 150 Years of Academic Heritage
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Founded in 1869, Comprehensive University began as a small
                college committed to providing quality education to the local
                community. Over the decades, it has grown into one of the most
                respected institutions in the region, with a reputation for
                producing graduates who lead in every sector of society.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Today, CU comprises over 20 faculties, 80+ academic programmes,
                and a vibrant campus community of more than 30,000 students from
                across the country and beyond.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "1869", label: "Year Founded" },
                { value: "30K+", label: "Students Enrolled" },
                { value: "80+", label: "Academic Programmes" },
                { value: "20+", label: "Faculties & Schools" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center"
                >
                  <p className="text-3xl font-black text-blue-900">{value}</p>
                  <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wide">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission */}
          <div className="mt-16 bg-blue-900 rounded-2xl px-10 py-10 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-3">
              Our Mission
            </p>
            <p className="text-xl font-bold leading-relaxed max-w-3xl">
              "To provide transformative education that empowers individuals,
              advances knowledge, and serves society through excellence in
              teaching, research, and community engagement."
            </p>
          </div>
        </section>

        {/*  Vision & Core Values  */}
        <section className="bg-gray-50 py-16 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-2">
              Vision & Core Values
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-10">
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-900 transition-all duration-200 group"
                >
                  <div className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-900 transition-colors duration-200 mb-4">
                    <Icon className="text-blue-900 group-hover:text-white text-base transition-colors duration-200" />
                  </div>
                  <h3 className="text-sm font-black text-gray-800 mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  Campus Life & Facilities  */}
        <section className="py-16 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-2">
              Campus Life
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-10">
              Life at Comprehensive University
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {CAMPUS_FACILITIES.map(({ title, description }) => (
                <div
                  key={title}
                  className="flex gap-5 p-6 border border-gray-200 rounded-xl hover:border-blue-900 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="w-2 shrink-0 bg-blue-900 rounded-full" />
                  <div>
                    <h3 className="text-sm font-black text-gray-800 mb-1 group-hover:text-blue-900 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
