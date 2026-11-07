import React, { useState } from "react";
import UserPaymentFlow from "./pages/user/UserPaymentFlow";
import KioskDisplays from "./pages/kiosk/KioskDisplays";
import AdminPortal from "./pages/admin/AdminPortal"; // เปลี่ยนมาเรียกผ่าน Portal ที่มีระบบ Login
import { Smartphone, MonitorPlay, ShieldCheck } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState("user"); // 'user' | 'kiosk' | 'admin'

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D] flex flex-col font-sans">
      {/* Top Demo Bar */}
      <header className="bg-white border-b border-[#E3E8EF] px-6 py-3 flex items-center justify-center sticky top-0 z-40">
        {/* แถบสลับมุมมอง */}
        <nav className="flex gap-2">
          <button
            onClick={() => setCurrentView("user")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === "user"
                ? "bg-[#1685F8] text-white"
                : "bg-[#F5F7FA] text-[#5E6C84] hover:text-[#172B4D]"
            }`}
          >
            <Smartphone size={15} />
            หน้าผู้ใช้ (มือถือ)
          </button>

          <button
            onClick={() => setCurrentView("kiosk")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === "kiosk"
                ? "bg-[#1685F8] text-white"
                : "bg-[#F5F7FA] text-[#5E6C84] hover:text-[#172B4D]"
            }`}
          >
            <MonitorPlay size={15} />
            จอคีออสก์และไม้กั้น
          </button>

          <button
            onClick={() => setCurrentView("admin")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === "admin"
                ? "bg-[#1685F8] text-white"
                : "bg-[#F5F7FA] text-[#5E6C84] hover:text-[#172B4D]"
            }`}
          >
            <ShieldCheck size={15} />
            หน้าผู้ดูแลระบบ
          </button>
        </nav>
      </header>

      {/* Content Rendering */}
      <main className="flex-1">
        {currentView === "user" && <UserPaymentFlow />}
        {currentView === "kiosk" && <KioskDisplays />}
        {currentView === "admin" && <AdminPortal />}
      </main>
    </div>
  );
}
