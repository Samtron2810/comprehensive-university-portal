import { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaPlus,
  FaSpinner,
  FaEnvelope,
  FaIdBadge,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

export default function AdminLecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await api.get("/admin/lecturers");
        setLecturers(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLecturers();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-blue-900 uppercase">
          Faculty Management
        </h2>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2">
          <FaPlus /> ADD LECTURER
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20">
            <FaSpinner className="animate-spin inline text-3xl text-blue-900" />
          </div>
        ) : (
          lecturers.map((lec) => (
            <div
              key={lec._id}
              className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                  <FaChalkboardTeacher size={20} />
                </div>
                <div>
                  <h3 className="font-black text-gray-800 capitalize">
                    {lec.firstName} {lec.lastName}
                  </h3>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">
                    Full-Time Faculty
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <FaEnvelope className="text-blue-900" />
                  <span>{lec.email}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <FaIdBadge className="text-blue-900" />
                  <span className="uppercase font-medium">
                    ID: {lec._id.slice(-8)}
                  </span>
                </div>
              </div>

              <button className="w-full mt-6 py-2 border-2 border-blue-900 text-blue-900 rounded-lg text-xs font-black hover:bg-blue-900 hover:text-white transition-all">
                VIEW ASSIGNED COURSES
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
