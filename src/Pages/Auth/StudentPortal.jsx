import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/SideBar";

export default function PortalLayout() {
  const navigate = useNavigate();

  let usernameInputted = localStorage.getItem("username");
  if (!usernameInputted || usernameInputted == "") {
    navigate("/student-login", { replace: true });
  } else {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/*  Sidebar  */}
          <Sidebar />

          {/*  Page Content  */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
}
