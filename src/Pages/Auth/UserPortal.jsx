import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/SideBar";
import UserTopBar from "../../Components/UserTopBar";
import api from "../../api/axiosInstance";

export default function PortalLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // 1. If no token or userId, boot to login
    if (!token || !userId) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        // 2. Only fetch student profile if the role is STUDENT
        if (role === "STUDENT") {
          const res = await api.get(`/students/user/${userId}`);
          const data = res.data.data;

          // Save student details for use across components
          localStorage.setItem("studentId", data._id);
          localStorage.setItem("firstName", data.firstName);
          localStorage.setItem("lastName", data.lastName);
          localStorage.setItem("level", data.level);
          localStorage.setItem("department", data.department?.name || "");
          localStorage.setItem("faculty", data.faculty?.name || "");
        }

        // 3. For ADMIN and LECTURER, no profile fetch needed for now
        // Just let them through — their profile fetches will happen
        // inside their respective dashboard pages

        setLoading(false);
      } catch (err) {
        // Only clear and redirect if it's an auth error
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          navigate("/login", { replace: true });
        } else {
          // For other errors (500, network, etc.) still let them in
          // so a backend hiccup doesn't lock them out
          console.error("Profile fetch error:", err.message);
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [token, userId, role, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
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
