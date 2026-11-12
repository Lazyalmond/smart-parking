import React, { useState } from "react";
import UserPaymentFlow from "./pages/user/UserPaymentFlow";
import KioskDisplays from "./pages/kiosk/KioskDisplays";
import AdminPortal from "./pages/admin/AdminPortal";
import { Smartphone, MonitorPlay, ShieldCheck } from "lucide-react";
import { mockCars, mockSlots } from "./data/mockData";

function loadSavedSlots() {
  try {
    const saved = JSON.parse(localStorage.getItem("smart_parking_slots") || "null");
    return Array.isArray(saved) ? saved : mockSlots;
  } catch {
    return mockSlots;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState("user");
  const [slots, setSlots] = useState(loadSavedSlots);

  const handleSlotsChange = (nextSlots) => {
    setSlots(nextSlots);
    localStorage.setItem("smart_parking_slots", JSON.stringify(nextSlots));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D] flex flex-col font-sans">
      {/* แถบสลับหน้าสำหรับทดสอบระหว่างพัฒนา */}
      <header className="sticky top-0 z-40 flex justify-center border-b border-[#E3E8EF] bg-white px-3 py-3">
        <nav className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCurrentView("user")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${currentView === "user" ? "bg-[#1685F8] text-white" : "bg-[#F5F7FA] text-[#5E6C84] hover:text-[#172B4D]"}`}
          >
            <Smartphone size={15} /> หน้าผู้ใช้ (User)
          </button>
          <button
            onClick={() => setCurrentView("kiosk")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${currentView === "kiosk" ? "bg-[#1685F8] text-white" : "bg-[#F5F7FA] text-[#5E6C84] hover:text-[#172B4D]"}`}
          >
            <MonitorPlay size={15} /> ตู้จอดรถ (Kiosk)
          </button>
          <button
            onClick={() => setCurrentView("admin")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${currentView === "admin" ? "bg-[#1685F8] text-white" : "bg-[#F5F7FA] text-[#5E6C84] hover:text-[#172B4D]"}`}
          >
            <ShieldCheck size={15} /> ผู้ดูแลระบบ (Admin)
          </button>
        </nav>
      </header>

      <main className="flex-1">
        {currentView === "user" && <UserPaymentFlow />}
        {currentView === "kiosk" && <KioskDisplays />}
        {currentView === "admin" && (
          <AdminPortal vehicles={mockCars} slots={slots} setSlots={handleSlotsChange} />
        )}
      </main>
    </div>
  );
}
