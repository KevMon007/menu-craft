import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-[#F7F8FA] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;