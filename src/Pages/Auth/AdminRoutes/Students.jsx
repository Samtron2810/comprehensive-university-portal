import { useEffect, useState } from "react";
import {
  FaSearch,
  FaUserShield,
  FaSpinner,
  FaUserGraduate,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/students");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    if (!window.confirm("Reset this student's password to default?")) return;
    try {
      await api.patch(`/admin/reset-password/${userId}`);
      alert("Password reset successfully!");
    } catch (err) {
      alert("Failed to reset password.");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      s.jambRegNo?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">
          Student Directory
        </h2>
        <div className="relative w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search Name or Reg No..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:border-blue-900 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">
                Student
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">
                Reg No
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">
                Level
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase text-right">
                Actions
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
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 text-center text-sm text-gray-400"
                >
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                      <FaUserGraduate />
                    </div>
                    <span className="text-sm font-bold text-gray-700 capitalize">
                      {student.firstName} {student.lastName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {student.jambRegNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {student.level}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleResetPassword(student._id)}
                      className="text-orange-600 hover:text-orange-700 text-xs font-black flex items-center gap-1 ml-auto"
                    >
                      <FaUserShield /> RESET PASS
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
