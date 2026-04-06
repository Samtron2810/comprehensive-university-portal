import { FaArrowRight, FaCircle } from "react-icons/fa";

const NEWS_FEEDS = [
  { title: "Semester Registration Deadline Extended", date: "Oct 20" },
  { title: "New Engineering Research Lab Opens", date: "Oct 18" },
  { title: "Welcome Week Events Schedule", date: "Oct 15" },
  { title: "Library Extended Hours During Exams", date: "Oct 12" },
];

const CAMPUS_NEWS = [
  { title: "Semester Registration Deadline Extended", date: "Oct 20" },
  { title: "New Engineering Research Lab Opens", date: "Oct 18" },
  { title: "Welcome Week Events Schedule", date: "Oct 15" },
  { title: "Library Extended Hours During Exams", date: "Oct 12" },
];

export default function NewsSection() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-6">
          News & Campus Updates
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* News Feeds */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-blue-900">
              <p className="text-xs font-black uppercase tracking-widest text-white">
                News Feeds
              </p>
            </div>
            <ul className="divide-y divide-gray-100">
              {NEWS_FEEDS.map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 group transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FaCircle
                        className="text-blue-900 mt-2 shrink-0"
                        style={{ fontSize: "5px" }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-900 leading-snug transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.date}
                        </p>
                      </div>
                    </div>
                    <FaArrowRight className="text-xs text-gray-300 group-hover:text-blue-900 shrink-0 ml-3 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest Campus News */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-blue-900 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-white">
                Latest Campus News
              </p>
              <a
                href="#"
                className="flex items-center gap-1 text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                More <FaArrowRight className="text-xs" />
              </a>
            </div>
            <ul className="divide-y divide-gray-100">
              {CAMPUS_NEWS.map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 group transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-900 leading-snug transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.date}
                        </p>
                      </div>
                    </div>
                    <FaArrowRight className="text-xs text-gray-300 group-hover:text-blue-900 shrink-0 ml-3 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
