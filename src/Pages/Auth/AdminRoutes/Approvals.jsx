import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaSpinner, FaEye } from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function AdminApprovals() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/registrations?status=SUBMITTED");
      setRegistrations(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.patch(`/registrations/${id}/${action}`);
      setRegistrations((prev) => prev.filter((r) => r._id !== id));
      alert(`Registration ${action}d!`);
    } catch (err) {
      alert("Action failed.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-black text-blue-900 uppercase">
        Course Approvals
      </h2>
      <div className="grid gap-4">
        {loading ? (
          <FaSpinner className="animate-spin mx-auto text-2xl text-blue-900" />
        ) : (
          registrations.map((reg) => (
            <div
              key={reg._id}
              className="bg-white p-5 rounded-2xl border flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-black text-gray-800 capitalize">
                  {reg.student?.firstName} {reg.student?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {reg.level} Level &bull; {reg.courses?.length} Courses
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(reg._id, "approve")}
                  className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-700 hover:text-white transition-all"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => handleAction(reg._id, "reject")}
                  className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-700 hover:text-white transition-all"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        )}
        {!loading && registrations.length === 0 && (
          <p className="text-center py-10 text-gray-400">
            No pending registrations found.
          </p>
        )}
      </div>
    </div>
  );
}
