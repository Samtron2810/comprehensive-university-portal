import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/SideBar";
import UserTopBar from "../../Components/UserTopBar";
import api from "../../api/axiosInstance";

export default function PortalLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    // 1. No token or userId — boot to login
    if (!token || !userId) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        // 2. Only fetch student profile if role is STUDENT
        if (role === "STUDENT") {
          const res = await api.get(`/students/user/${userId}`);
          const data = res.data.data;

          // Save all student details for use across portal pages
          localStorage.setItem("studentId", data._id);
          localStorage.setItem("firstName", data.firstName);
          localStorage.setItem("lastName", data.lastName);
          localStorage.setItem("level", data.level);
          localStorage.setItem("department", data.department?.name || "");
          localStorage.setItem("faculty", data.faculty?.name || "");
          // localStorage.setItem("faculty", data.faculty || "");
          localStorage.setItem("matricNumber", data.matricNumber || "");
          localStorage.setItem("admissionType", data.admissionType || "");
          localStorage.setItem("status", data.status || "ACTIVE");
        }

        // 3. ADMIN and LECTURER — no profile fetch needed here
        // their dashboard pages handle their own data fetching

        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Auth error — clear everything and boot to login
          localStorage.clear();
          navigate("/login", { replace: true });
        } else {
          // Network/server error — let them through, don't lock out
          console.error("Profile fetch error:", err.message);
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <UserTopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
