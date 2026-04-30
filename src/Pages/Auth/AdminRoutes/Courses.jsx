import { useEffect, useState } from "react";
import {
  FaBook,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // EDIT MODE
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    creditUnits: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ FIXED ENDPOINT
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      title: "",
      code: "",
      creditUnits: "",
    });
    setIsEditing(false);
    setSelectedCourseId(null);
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      code: course.code,
      creditUnits: course.creditUnits,
    });
    setSelectedCourseId(course._id);
    setIsEditing(true);
    setShowModal(true);
  };

  // ADD COURSE
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/courses", {
        ...formData,
        creditUnits: Number(formData.creditUnits),
      });

      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add course");
    } finally {
      setSubmitting(false);
    }
  };

  // UPDATE COURSE
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.patch(`/courses/${selectedCourseId}`, {
        ...formData,
        creditUnits: Number(formData.creditUnits),
      });

      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update course");
    } finally {
      setSubmitting(false);
    }
  };

  // SAFE FILTER
  const filteredCourses = courses.filter(
    (c) =>
      (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.code || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-blue-900 uppercase">
          Course Catalog
        </h2>

        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search code/title..."
              className="pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-blue-900"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={openAddModal}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:bg-blue-800 transition-all"
          >
            <FaPlus /> ADD COURSE
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">
                Course Details
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase text-center">
                Credit Units
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase text-center">
                Semester
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-10 text-center">
                  <FaSpinner className="animate-spin inline text-blue-900" />
                </td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-sm text-gray-400"
                >
                  No courses found.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-700">
                      {course.title}
                    </p>
                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
                      {course.code}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500 text-center font-bold">
                    {course.creditUnits}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    {course.semester ?? "—"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-900 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <form
            onSubmit={isEditing ? handleUpdateCourse : handleAddCourse}
            className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-blue-900 uppercase">
                {isEditing ? "Update Course" : "Create Course"}
              </h3>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              <input
                required
                type="text"
                placeholder="Course Title"
                className="w-full border p-3 rounded-lg text-sm bg-gray-50"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Course Code"
                  className="w-full border p-3 rounded-lg text-sm bg-gray-50"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />

                <input
                  required
                  type="number"
                  placeholder="Credit Units"
                  className="w-full border p-3 rounded-lg text-sm bg-gray-50"
                  value={formData.creditUnits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      creditUnits: e.target.value,
                    })
                  }
                />
              </div>

              <p className="text-[10px] text-gray-400">
                Semester is automatically derived from course code.
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-900 text-white font-black text-xs py-4 rounded-lg mt-8 hover:bg-blue-800 uppercase"
            >
              {submitting
                ? "Processing..."
                : isEditing
                  ? "Update Course"
                  : "Create Course"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
