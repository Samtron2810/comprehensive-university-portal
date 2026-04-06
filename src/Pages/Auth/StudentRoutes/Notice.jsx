import { useState } from "react";
import { FaBell, FaCheckCircle, FaRegCircle } from "react-icons/fa";

//  Mock Data

const INITIAL_NOTICES = [
  {
    id: 1,
    title: "Semester Registration Deadline Extended",
    date: "Oct 20, 2024",
    read: false,
    content:
      "The Academic Registrar wishes to inform all students that the deadline for course registration for the 2024/2025 First Semester has been extended to November 1, 2024. Students are advised to complete their registration before the new deadline to avoid any academic penalties.",
  },
  {
    id: 2,
    title: "Prelim Payment Due — Action Required",
    date: "Oct 18, 2024",
    read: false,
    content:
      "All students are reminded that the preliminary school fees payment deadline is October 31, 2024. Failure to make payment before this date may result in your portal being restricted. Please visit the Bursary or use the online payment portal to complete your payment.",
  },
  {
    id: 3,
    title: "New Engineering Research Lab Opens",
    date: "Oct 15, 2024",
    read: false,
    content:
      "The Faculty of Engineering is pleased to announce the opening of the new Advanced Research Laboratory. The lab is equipped with state-of-the-art equipment and is available to all undergraduate and postgraduate students. Access requests can be submitted via the Faculty Office.",
  },
  {
    id: 4,
    title: "Welcome Week Events Schedule",
    date: "Oct 10, 2024",
    read: true,
    content:
      "The Students' Affairs Division has released the full schedule for Welcome Week activities. Events include orientation tours, meet-and-greet sessions, and cultural nights. All freshers are expected to attend the mandatory orientation on October 14, 2024 by 9:00am at the Main Auditorium.",
  },
  {
    id: 5,
    title: "Library Extended Hours During Exams",
    date: "Oct 5, 2024",
    read: true,
    content:
      "The University Library will be extending its operating hours during the examination period. The library will be open from 7:00am to 11:00pm Monday through Saturday. Students are encouraged to make use of the reading halls and digital resources available.",
  },
];

//  Notice Item

function NoticeItem({ notice, onMarkRead, isOpen, onToggle }) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
        notice.read ? "border-gray-200 bg-white" : "border-blue-200 bg-blue-50"
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between px-6 py-5 text-left"
      >
        <div className="flex items-start gap-3 flex-1 pr-4">
          <FaBell
            className={`text-sm mt-0.5 shrink-0 ${
              notice.read ? "text-gray-300" : "text-blue-900"
            }`}
          />
          <div>
            <p
              className={`text-sm font-black leading-snug ${notice.read ? "text-gray-600" : "text-gray-900"}`}
            >
              {notice.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{notice.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!notice.read && (
            <span className="w-2 h-2 rounded-full bg-blue-900 shrink-0" />
          )}
          <span className="text-xs text-gray-400 font-medium">
            {isOpen ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="px-6 pb-5 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed pt-4">
            {notice.content}
          </p>
          {!notice.read ? (
            <button
              onClick={() => onMarkRead(notice.id)}
              className="mt-4 flex items-center gap-2 text-xs font-black text-blue-900 hover:underline"
            >
              <FaCheckCircle className="text-blue-900" />
              Mark as Read
            </button>
          ) : (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <FaRegCircle className="text-xs" /> Already read
            </p>
          )}
        </div>
      )}
    </div>
  );
}

//  Page

export default function NoticePage() {
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [openId, setOpenId] = useState(null);

  const unreadCount = notices.filter((n) => !n.read).length;

  const markRead = (id) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex flex-col gap-6">
      {/*  Page Header  */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notices</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with the latest announcements from the university.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 text-xs font-black text-blue-900 border border-blue-900 px-4 py-2.5 rounded-lg hover:bg-blue-900 hover:text-white transition-all duration-200"
          >
            <FaCheckCircle /> Mark All as Read
          </button>
        )}
      </div>

      {/*  Unread Badge  */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-2 bg-blue-900 text-white px-5 py-3 rounded-xl text-sm font-semibold w-fit">
          <FaBell className="text-yellow-400" />
          You have {unreadCount} unread notice{unreadCount > 1 ? "s" : ""}
        </div>
      )}

      {/*  Notice List  */}
      <div className="flex flex-col gap-3">
        {notices.map((notice) => (
          <NoticeItem
            key={notice.id}
            notice={notice}
            onMarkRead={markRead}
            isOpen={openId === notice.id}
            onToggle={() => setOpenId(openId === notice.id ? null : notice.id)}
          />
        ))}
      </div>
    </div>
  );
}
