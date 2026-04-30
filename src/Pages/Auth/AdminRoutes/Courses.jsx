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

  // Form State — semester removed (backend auto-derives from course code)
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    creditUnits: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/courses");
      setCourses(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/courses", formData);
      setShowModal(false);
      setFormData({ title: "", code: "", creditUnits: "" });
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add course");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
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
            onClick={() => setShowModal(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 hover:bg-blue-800 transition-all"
          >
            <FaPlus /> ADD COURSE
          </button>
        </div>
      </div>

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
                    <button className="text-blue-900 hover:bg-blue-100 p-2 rounded-lg transition-colors">
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD COURSE MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <form
            onSubmit={handleAddCourse}
            className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-blue-900 uppercase">
                Create New Course
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                  Course Title
                </label>
                <input
                  required
                  type="text"
                  className="w-full border p-3 rounded-lg text-sm outline-none focus:border-blue-900 bg-gray-50"
                  placeholder="e.g. Introduction to Programming"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                    Course Code
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border p-3 rounded-lg text-sm outline-none focus:border-blue-900 bg-gray-50"
                    placeholder="CSC 101"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                    Credit Units
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full border p-3 rounded-lg text-sm outline-none focus:border-blue-900 bg-gray-50"
                    placeholder="3"
                    value={formData.creditUnits}
                    onChange={(e) =>
                      setFormData({ ...formData, creditUnits: e.target.value })
                    }
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                ℹ️ Semester and level are automatically derived by the backend
                from the course code.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-900 text-white font-black text-xs py-4 rounded-lg mt-8 hover:bg-blue-800 transition-colors uppercase tracking-widest disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Create Course"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
