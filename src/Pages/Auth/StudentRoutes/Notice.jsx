import { useState, useEffect } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaRegCircle,
  FaSpinner,
  FaInbox,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

// Sub-component for individual notices
function NoticeItem({ notice, onMarkRead, isOpen, onToggle }) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        notice.read
          ? "border-gray-200 bg-white"
          : "border-blue-200 bg-blue-50/50 shadow-sm shadow-blue-900/5"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between px-6 py-5 text-left group"
      >
        <div className="flex items-start gap-4 flex-1 pr-4">
          <div
            className={`p-2 rounded-lg shrink-0 mt-0.5 ${notice.read ? "bg-gray-100" : "bg-blue-100"}`}
          >
            <FaBell
              className={`text-xs ${notice.read ? "text-gray-400" : "text-blue-900"}`}
            />
          </div>
          <div>
            <p
              className={`text-sm font-black leading-tight ${notice.read ? "text-gray-500" : "text-gray-900"}`}
            >
              {notice.title}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
              {notice.date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 mt-1">
          {!notice.read && (
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          )}
          <span
            className={`text-[10px] font-black transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100 bg-white/50 animate-in slide-in-from-top-2 duration-300">
          <div className="pt-5">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {notice.content}
            </p>
            {!notice.read ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notice._id || notice.id);
                }}
                className="mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-900 hover:text-blue-700 transition-colors"
              >
                <FaCheckCircle /> Mark as Read
              </button>
            ) : (
              <div className="mt-5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-300">
                <FaRegCircle /> Read
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/notices/student/${studentId}`);
      setNotices(response.data.data || []);
    } catch (err) {
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notices.filter((n) => !n.read).length;

  const markRead = async (id) => {
    try {
      // Update locally first for instant feedback
      setNotices((prev) =>
        prev.map((n) =>
          n._id === id || n.id === id ? { ...n, read: true } : n,
        ),
      );
      // Sync with backend
      await api.patch(`/notices/${id}/read`, { studentId });
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
      await api.post(`/notices/mark-all-read`, { studentId });
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-blue-900">
        <FaSpinner className="animate-spin text-3xl mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Fetching Announcements
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notice Board</h1>
          <p className="text-sm text-gray-500 mt-1">
            Important updates and announcements from the University management.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-900 bg-blue-50 px-5 py-3 rounded-xl hover:bg-blue-900 hover:text-white transition-all duration-300"
          >
            <FaCheckCircle /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notice List Container */}
      {notices.length > 0 ? (
        <div className="flex flex-col gap-3">
          {notices.map((notice) => (
            <NoticeItem
              key={notice._id || notice.id}
              notice={notice}
              onMarkRead={markRead}
              isOpen={openId === (notice._id || notice.id)}
              onToggle={() =>
                setOpenId(
                  openId === (notice._id || notice.id)
                    ? null
                    : notice._id || notice.id,
                )
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <FaInbox className="text-gray-200 text-2xl" />
          </div>
          <p className="text-sm font-bold text-gray-400">
            Your notice board is empty
          </p>
        </div>
      )}
    </div>
  );
}
