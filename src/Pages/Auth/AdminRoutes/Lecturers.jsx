import { useState } from "react";
import { FaPlus, FaSpinner, FaTimes, FaLink, FaUnlink } from "react-icons/fa";
import api from "../../../api/axiosInstance";

const EMPTY_LECTURER_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  departmentId: "",
};

export default function AdminLecturers() {
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState(EMPTY_LECTURER_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Assign/Remove state
  const [lecturerId, setLecturerId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  // ── Open Modal ─────────────────────────
  const handleOpenModal = async () => {
    setForm(EMPTY_LECTURER_FORM);
    setFormError("");
    setSuccessData(null);
    setShowModal(true);

    try {
      const res = await api.get("/departments");
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error("Departments error:", err.message);
      setFormError("Failed to load departments");
    }
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setShowModal(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ── CREATE LECTURER ─────────────────────
  const handleCreate = async () => {
    const { firstName, lastName, email, departmentId } = form;

    if (!firstName || !lastName || !email || !departmentId) {
      setFormError("All fields are required");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const res = await api.post("/lecturers", form);

      const data = res.data.data;

      setSuccessData({
        id: data._id,
        email: data.email,
        password: data.password ?? data.defaultPassword ?? "Not provided",
      });

      // Auto-fill lecturerId for actions
      setLecturerId(data._id);
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to create lecturer");
    } finally {
      setSubmitting(false);
    }
  };

  // ── ASSIGN COURSE ───────────────────────
  const handleAssign = async () => {
    if (!lecturerId || !courseId) {
      setActionMessage("Lecturer ID and Course ID required");
      return;
    }

    setActionLoading(true);
    setActionMessage("");

    try {
      await api.post(`/lecturers/${lecturerId}/courses/${courseId}`);
      setActionMessage("✅ Course assigned successfully");
    } catch (err) {
      setActionMessage(
        err?.response?.data?.message || "Failed to assign course",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ── REMOVE COURSE ───────────────────────
  const handleRemove = async () => {
    if (!lecturerId || !courseId) {
      setActionMessage("Lecturer ID and Course ID required");
      return;
    }

    setActionLoading(true);
    setActionMessage("");

    try {
      await api.delete(`/lecturers/${lecturerId}/courses/${courseId}`);
      setActionMessage("❌ Course removed successfully");
    } catch (err) {
      setActionMessage(
        err?.response?.data?.message || "Failed to remove course",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-blue-900 uppercase">
          Lecturer Management
        </h2>

        <button
          onClick={handleOpenModal}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2"
        >
          <FaPlus /> CREATE LECTURER
        </button>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
            <div className="flex justify-between p-4 border-b">
              <h3 className="font-black text-sm uppercase text-blue-900">
                Create Lecturer
              </h3>
              <button onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* SUCCESS VIEW */}
              {successData ? (
                <div className="text-xs space-y-3">
                  <p className="text-green-700 font-bold">
                    Lecturer created successfully 🎉
                  </p>

                  <div className="bg-gray-100 p-3 rounded">
                    <p>
                      <b>ID:</b> {successData.id}
                    </p>
                    <p>
                      <b>Email:</b> {successData.email}
                    </p>
                    <p>
                      <b>Password:</b> {successData.password}
                    </p>
                  </div>

                  {/* ASSIGN / REMOVE UI */}
                  <div className="flex flex-col gap-2 mt-4">
                    <input
                      placeholder="Lecturer ID"
                      value={lecturerId}
                      onChange={(e) => setLecturerId(e.target.value)}
                      className="border px-3 py-2 rounded text-sm"
                    />

                    <input
                      placeholder="Course ID"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="border px-3 py-2 rounded text-sm"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleAssign}
                        disabled={actionLoading}
                        className="flex-1 bg-green-600 text-white py-2 rounded text-xs flex items-center justify-center gap-1"
                      >
                        {actionLoading ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaLink />
                        )}
                        Assign
                      </button>

                      <button
                        onClick={handleRemove}
                        disabled={actionLoading}
                        className="flex-1 bg-red-600 text-white py-2 rounded text-xs flex items-center justify-center gap-1"
                      >
                        {actionLoading ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaUnlink />
                        )}
                        Remove
                      </button>
                    </div>

                    {actionMessage && (
                      <p className="text-xs mt-2">{actionMessage}</p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* FORM */}
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded text-sm"
                  />

                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded text-sm"
                  />

                  <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded text-sm"
                  />

                  <select
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded text-sm"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  {formError && (
                    <p className="text-red-600 text-xs">{formError}</p>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t flex justify-end">
              {!successData && (
                <button
                  onClick={handleCreate}
                  disabled={submitting}
                  className="bg-blue-900 text-white px-6 py-2 rounded text-xs flex items-center gap-2"
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPlus />
                  )}
                  Create
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
