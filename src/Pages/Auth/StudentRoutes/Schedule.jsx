const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TIME_SLOTS = [
  "8:00am",
  "9:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "1:00pm",
  "2:00pm",
  "3:00pm",
  "4:00pm",
];

// Each entry: { day, time, code, title, venue }
const TIMETABLE = [
  {
    day: "Monday",
    time: "8:00am",
    code: "GST 301",
    title: "Entrepreneurship Studies",
    venue: "Hall A",
  },
  {
    day: "Monday",
    time: "10:00am",
    code: "CSC 301",
    title: "Object Oriented Programming",
    venue: "Lab 2",
  },
  {
    day: "Monday",
    time: "2:00pm",
    code: "MTH 301",
    title: "Numerical Methods",
    venue: "Hall B",
  },
  {
    day: "Tuesday",
    time: "8:00am",
    code: "CSC 303",
    title: "Fundamentals of Database Systems",
    venue: "Lab 1",
  },
  {
    day: "Tuesday",
    time: "10:00am",
    code: "CSC 307",
    title: "Software Engineering",
    venue: "Hall C",
  },
  {
    day: "Wednesday",
    time: "10:00am",
    code: "CSC 301",
    title: "Object Oriented Programming",
    venue: "Lab 2",
  },
  {
    day: "Wednesday",
    time: "12:00pm",
    code: "CSC 305",
    title: "Computer Networks",
    venue: "Hall A",
  },
  {
    day: "Thursday",
    time: "8:00am",
    code: "MTH 301",
    title: "Numerical Methods",
    venue: "Hall B",
  },
  {
    day: "Thursday",
    time: "2:00pm",
    code: "CSC 303",
    title: "Fundamentals of Database Systems",
    venue: "Lab 1",
  },
  {
    day: "Friday",
    time: "8:00am",
    code: "GST 301",
    title: "Entrepreneurship Studies",
    venue: "Hall A",
  },
  {
    day: "Friday",
    time: "10:00am",
    code: "CSC 307",
    title: "Software Engineering",
    venue: "Hall C",
  },
  {
    day: "Friday",
    time: "12:00pm",
    code: "CSC 305",
    title: "Computer Networks",
    venue: "Hall A",
  },
];

// Assign a consistent color per course code
const COURSE_COLORS = {
  "CSC 301": "bg-blue-100 text-blue-900 border-blue-200",
  "CSC 303": "bg-purple-100 text-purple-900 border-purple-200",
  "CSC 305": "bg-green-100 text-green-900 border-green-200",
  "CSC 307": "bg-yellow-100 text-yellow-900 border-yellow-200",
  "MTH 301": "bg-red-100 text-red-900 border-red-200",
  "GST 301": "bg-orange-100 text-orange-900 border-orange-200",
};

function getSlot(day, time) {
  return TIMETABLE.find((s) => s.day === day && s.time === time) || null;
}

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6">
      {/*  Page Header  */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your weekly class timetable for the 2024/2025 First Semester.
        </p>
      </div>

      {/*  Legend  */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(COURSE_COLORS).map(([code, color]) => (
          <span
            key={code}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border ${color}`}
          >
            {code}
          </span>
        ))}
      </div>

      {/*  Timetable Grid  */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-blue-900">
                {/* Time column header */}
                <th className="px-4 py-4 text-left text-xs font-black text-blue-300 uppercase tracking-widest w-24">
                  Time
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="px-4 py-4 text-left text-xs font-black text-white uppercase tracking-widest"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TIME_SLOTS.map((time) => (
                <tr key={time} className="hover:bg-gray-50 transition-colors">
                  {/* Time Label */}
                  <td className="px-4 py-3 text-xs font-black text-gray-400 whitespace-nowrap border-r border-gray-100">
                    {time}
                  </td>
                  {DAYS.map((day) => {
                    const slot = getSlot(day, time);
                    return (
                      <td key={day} className="px-3 py-2 align-top">
                        {slot ? (
                          <div
                            className={`border rounded-xl px-3 py-2.5 ${
                              COURSE_COLORS[slot.code] ||
                              "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            <p className="text-xs font-black leading-snug">
                              {slot.code}
                            </p>
                            <p className="text-xs font-medium leading-snug mt-0.5 opacity-80">
                              {slot.title}
                            </p>
                            <p className="text-xs opacity-60 mt-1">
                              {slot.venue}
                            </p>
                          </div>
                        ) : (
                          <div className="h-8" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
