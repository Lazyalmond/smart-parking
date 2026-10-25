import React, { useState } from "react";
import UserPaymentFlow from "./pages/user/UserPaymentFlow";
import KioskDisplays from "./pages/kiosk/KioskDisplays";
import { Smartphone, MonitorPlay, ShieldCheck } from "lucide-react";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState("user"); // 'user' | 'kiosk' | 'admin'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Demo Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-sm tracking-wide text-emerald-400">
            SMART PARKING PROTOTYPE
          </span>
        </div>

        {/* แถบสลับมุมมอง */}
        <nav className="flex gap-2">
          <button
            onClick={() => setCurrentView("user")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === "user"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone size={15} />
            ฝั่ง User (Mobile Web)
          </button>

          <button
            onClick={() => setCurrentView("kiosk")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === "kiosk"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <MonitorPlay size={15} />
            ฝั่ง Kiosk & ไม้กั้น
          </button>

          <button
            onClick={() => setCurrentView("admin")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === "admin"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck size={15} />
            ฝั่ง Admin Dashboard
          </button>
        </nav>
      </header>

      {/* Content Rendering */}
      <main className="flex-1">
        {currentView === "user" && <UserPaymentFlow />}
        {currentView === "kiosk" && <KioskDisplays />}
        {currentView === "admin" && (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
            <ShieldCheck size={64} className="text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-300">
              หน้า Admin Backoffice กำลังรอสร้าง
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              ส่วนถัดไป: ผังเซนเซอร์ช่องจอดสด (Live Map), รายงานการเงิน, และ
              Heatmap
            </p>
            <main className="flex-1">
              {currentView === "user" && <UserPaymentFlow />}
              {currentView === "kiosk" && <KioskDisplays />}
              {currentView === "admin" && <AdminDashboard />}
            </main>
          </div>
        )}
      </main>
    </div>
  );
}
