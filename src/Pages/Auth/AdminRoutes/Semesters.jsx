import { useEffect, useState } from "react";
import {
  FaGraduationCap,
  FaPlus,
  FaToggleOn,
  FaLock,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function Semester() {
  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locking, setLocking] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchActiveSemester();
  }, []);

  // GET ACTIVE SEMESTER
  const fetchActiveSemester = async () => {
    try {
      setLoading(true);
      const res = await api.get("/semesters/active");
      setSemester(res.data.data || null);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setSemester(null);
    } finally {
      setLoading(false);
    }
  };

  // CREATE SEMESTER
  const handleCreateSemester = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/semesters", {
        name: formData.name.trim(),
      });

      setShowModal(false);
      setFormData({ name: "" });
      fetchActiveSemester();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create semester");
    } finally {
      setSubmitting(false);
    }
  };

  // ACTIVATE SEMESTER
  const activateSemester = async (id) => {
    try {
      await api.patch(`/semesters/${id}/activate`);
      fetchActiveSemester();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to activate semester");
    }
  };

  // LOCK REGISTRATION
  const lockSemester = async () => {
    try {
      setLocking(true);
      await api.patch("/semesters/lock");
      fetchActiveSemester();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to lock semester");
    } finally {
      setLocking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-blue-900 uppercase">
          Semester Management
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:bg-blue-800"
        >
          <FaPlus /> NEW SEMESTER
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-10">
          <FaSpinner className="animate-spin text-blue-900" />
        </div>
      ) : (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaGraduationCap className="text-blue-900 text-2xl" />

              <div>
                <p className="text-lg font-black text-gray-800">
                  {semester?.name || "No Active Semester"}
                </p>

                <p className="text-xs text-gray-400 uppercase font-bold">
                  {semester?.isActive ? "Currently Active" : "Inactive"}
                </p>
              </div>
            </div>

            {semester && (
              <div className="flex items-center gap-3">
                {/* ACTIVATE */}
                <button
                  onClick={() => activateSemester(semester._id)}
                  className="text-blue-900 hover:bg-blue-50 p-2 rounded-lg"
                  title="Activate Semester"
                >
                  <FaToggleOn className="text-2xl" />
                </button>

                {/* LOCK */}
                <button
                  onClick={lockSemester}
                  disabled={locking}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                  title="Lock Registration"
                >
                  <FaLock className="text-xl" />
                </button>
              </div>
            )}
          </div>
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
            onSubmit={handleCreateSemester}
            className="relative bg-white p-6 rounded-2xl w-full max-w-md"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <h3 className="font-black text-blue-900 uppercase">
                Create Semester
              </h3>

              <FaTimes
                className="cursor-pointer"
                onClick={() => setShowModal(false)}
              />
            </div>

            {/* INPUT */}
            <input
              type="text"
              placeholder="e.g. First Semester 2024/2025"
              className="w-full border p-3 rounded-lg text-sm mb-4"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            {/* BUTTON */}
            <button
              disabled={submitting}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-black text-xs"
            >
              {submitting ? "Creating..." : "Create Semester"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
