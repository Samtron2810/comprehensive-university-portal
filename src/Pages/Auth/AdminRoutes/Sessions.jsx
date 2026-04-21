import { useEffect, useState } from "react";
import { FaCalendarAlt, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get("/session");
      setSessions(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      await api.patch(`/session/${id}/activate`);
      fetchSessions(); // Refresh list to update toggle states
    } catch (err) {
      alert("Error updating session.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-blue-900 uppercase">
          Academic Sessions
        </h2>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:bg-blue-800">
          <FaPlus /> NEW SESSION
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <div
            key={s._id}
            className={`p-6 rounded-2xl border-2 transition-all ${s.isActive ? "border-blue-900 bg-blue-50" : "bg-white border-gray-100"}`}
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
              className={`text-xs font-bold uppercase ${s.isActive ? "text-blue-900" : "text-gray-400"}`}
            >
              {s.isActive ? "Current Active Session" : "Inactive"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
