import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaPlus,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  // ✅ FIXED: align with API
  const fetchSessions = async () => {
    try {
      setLoading(true);

      // If backend only supports active session:
      const res = await api.get("/session/active");

      // normalize to array for UI compatibility
      setSessions(res.data.data ? [res.data.data] : []);
    } catch (err) {
      console.error(err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // CREATE SESSION
  const handleCreateSession = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/session", formData);
      setShowModal(false);
      setFormData({ name: "" });
      fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating session");
    } finally {
      setSubmitting(false);
    }
  };

  // ACTIVATE SESSION
  const toggleActive = async (id) => {
    try {
      await api.patch(`/session/${id}/activate`);
      fetchSessions();
    } catch (err) {
      alert("Error updating session.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-blue-900 uppercase">
          Academic Sessions
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:bg-blue-800"
        >
          <FaPlus /> NEW SESSION
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-blue-900" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          No session available
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sessions.map((s) => (
            <div
              key={s._id}
              className={`p-6 rounded-2xl border-2 transition-all ${
                s.isActive
                  ? "border-blue-900 bg-blue-50"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <FaCalendarAlt
                  className={s.isActive ? "text-blue-900" : "text-gray-300"}
                  size={24}
                />

                <button onClick={() => toggleActive(s._id)}>
                  {s.isActive ? (
                    <FaToggleOn className="text-blue-900 text-2xl" />
                  ) : (
                    <FaToggleOff className="text-gray-300 text-2xl" />
                  )}
                </button>
              </div>

              <p className="text-lg font-black text-gray-800">{s.name}</p>

              <p
                className={`text-xs font-bold uppercase ${
                  s.isActive ? "text-blue-900" : "text-gray-400"
                }`}
              >
                {s.isActive ? "Current Active Session" : "Inactive"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          <form
            onSubmit={handleCreateSession}
            className="relative bg-white p-6 rounded-2xl w-full max-w-md"
          >
            <div className="flex justify-between mb-4">
              <h3 className="font-black text-blue-900">Create Session</h3>
              <FaTimes
                className="cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>

            <input
              type="text"
              placeholder="e.g. 2024/2025"
              className="w-full border p-3 rounded-lg text-sm mb-4"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <button
              disabled={submitting}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-black text-xs"
            >
              {submitting ? "Creating..." : "Create Session"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
