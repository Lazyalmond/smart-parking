import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  Activity, 
  Users, 
  Download, 
  Zap, 
  CarFront, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  mockSlots, 
  mockHourlyRevenue, 
  mockCarBrands, 
  mockSlotHeatmap 
} from '../../data/mockData';

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('map'); // 'map' | 'finance' | 'activity' | 'roles'
  const [role, setRole] = useState('superadmin'); // 'superadmin' | 'admin'
  const [selectedFloor, setSelectedFloor] = useState('FL1');

  // สิทธิ์เมนู (Super Admin เข้าได้หมด / Admin ทั่วไปเข้า Roles ไม่ได้)
  const canAccessRoles = role === 'superadmin';

  const exportData = (type) => {
    alert(`กำลังดาวน์โหลดรายงาน ${type} ในรูปแบบ CSV/Excel...`);
  };

  return (
    <div className="flex min-h-[90vh] bg-slate-950 text-slate-100">
      {/* Sidebar เมนูหลัก */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Admin Portal</span>
            {/* ตัวสลับสิทธิ์ Super Admin / Admin */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-800 text-[11px] px-2 py-1 rounded border border-slate-700 text-emerald-400"
            >
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin ทั่วไป</option>
            </select>
          </div>

          <nav className="space-y-1.5 text-sm">
            <button
              onClick={() => setActiveMenu('map')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                activeMenu === 'map' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard size={18} />
              ผังเซนเซอร์ช่องจอด (Live Map)
            </button>

            <button
              onClick={() => setActiveMenu('finance')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                activeMenu === 'finance' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <DollarSign size={18} />
              รายงานการเงิน (Finance)
            </button>

            <button
              onClick={() => setActiveMenu('activity')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                activeMenu === 'activity' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Activity size={18} />
              รายงานการใช้ & Heatmap
            </button>

            {canAccessRoles && (
              <button
                onClick={() => setActiveMenu('roles')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                  activeMenu === 'roles' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Users size={18} />
                จัดการสิทธิ์ (RBAC)
              </button>
            )}
          </nav>
        </div>

        <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3">
          สิทธิ์ปัจจุบัน: <span className="text-emerald-400 font-semibold">{role.toUpperCase()}</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* ================= 1. ผังเซนเซอร์ช่องจอดสด ================= */}
        {activeMenu === 'map' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Live Sensor Floor Map</h2>
                <p className="text-xs text-slate-400">สถานะจากเซนเซอร์ประจำช่องจอดแบบสด (ลูกค้าจะไม่เห็นหน้านี้)</p>
              </div>

              {/* Floor Switcher */}
              <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setSelectedFloor('FL1')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedFloor === 'FL1' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  ชั้น 1 (FL1)
                </button>
                <button
                  onClick={() => setSelectedFloor('FL2')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedFloor === 'FL2' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  ชั้น 2 (FL2)
                </button>
              </div>
            </div>

            {/* Grid แสดงสถานะแต่ละช่อง */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockSlots
                .filter((s) => s.floor === selectedFloor)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between h-36 transition ${
                      slot.occupied
                        ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                        : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-lg">{slot.id}</span>
                      {slot.isEV && (
                        <span className="bg-sky-500/20 text-sky-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                          <Zap size={12} /> EV
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          slot.occupied ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                        }`}
                      />
                      <span className="text-xs font-semibold">
                        {slot.occupied ? 'มีรถจอดอยู่' : 'ว่าง (พร้อมจอด)'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= 2. รายงานการเงิน ================= */}
        {activeMenu === 'finance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Finance & Revenue Report</h2>
                <p className="text-xs text-slate-400">ภาพรวมรายรับทั้งหมด และช่วงเวลาที่มีรายได้สูงสุด</p>
              </div>
              <button
                onClick={() => exportData('การเงิน')}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700"
              >
                <Download size={14} /> Export รายงาน
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">รายรับรวมวันนี้</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">฿24,400</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <TrendingUp size={14} className="text-emerald-400" /> ช่วงเวลาเงินเข้าสูงสุด (Peak)
                </span>
                <p className="text-2xl font-bold text-white mt-1 font-mono">12:00 - 14:00 น.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">จำนวนคันที่ชำระแล้ว</span>
                <p className="text-2xl font-bold text-sky-400 mt-1 font-mono">125 คัน</p>
              </div>
            </div>

            {/* กราฟ Recharts */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-semibold mb-4">กราฟแสดงรายรับตามช่วงเวลา (Peak Hours)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockHourlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. รายงานกิจกรรม & Heatmap ================= */}
        {activeMenu === 'activity' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Activity & Slot Heatmap</h2>
                <p className="text-xs text-slate-400">สถิติความหนาแน่นรายช่องจอด และรุ่นรถยนต์ยอดนิยม</p>
              </div>
              <button
                onClick={() => exportData('กิจกรรม')}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700"
              >
                <Download size={14} /> Export ข้อมูล
              </button>
            </div>

            {/* Heatmap ช่องจอด */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold">Heatmap: ช่องจอดที่มีการใช้งานหนาแน่นที่สุด</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mockSlotHeatmap.map((item) => {
                  let bgColor = 'bg-emerald-950/40 border-emerald-800 text-emerald-300';
                  if (item.density > 80) bgColor = 'bg-rose-950/60 border-rose-700 text-rose-300';
                  else if (item.density > 50) bgColor = 'bg-amber-950/40 border-amber-800 text-amber-300';

                  return (
                    <div key={item.slot} className={`p-4 rounded-xl border ${bgColor}`}>
                      <div className="flex justify-between font-mono font-bold">
                        <span>{item.slot}</span>
                        <span>{item.density}%</span>
                      </div>
                      <span className="text-[11px] opacity-80 block mt-1">ความหนาแน่น: {item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* สถิติรุ่นรถ */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CarFront size={16} /> สถิติรุ่นรถและระยะเวลาจอดเฉลี่ย
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 pb-2">
                    <tr>
                      <th className="py-2">รุ่นรถยนต์</th>
                      <th>จำนวนรถที่เข้ามา</th>
                      <th>จอดเฉลี่ย (ชม.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {mockCarBrands.map((car, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-3 font-semibold text-slate-200">{car.brand}</td>
                        <td className="font-mono text-emerald-400">{car.count} คัน</td>
                        <td className="font-mono text-slate-400">{car.avgHours} ชั่วโมง</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. จัดการสิทธิ์ (RBAC) ================= */}
        {activeMenu === 'roles' && canAccessRoles && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-xl">
            <h2 className="text-xl font-bold">Role & Permission Management</h2>
            <p className="text-xs text-slate-400">เฉพาะ Super Admin เท่านั้นที่สามารถกำหนดสิทธิ์เข้าถึงเมนูได้</p>
            <div className="space-y-3 pt-3">
              {['ผังเซนเซอร์ช่องจอด (Live Map)', 'รายงานการเงิน (Finance)', 'รายงานกิจกรรม (Activity & Heatmap)'].map((perm, idx) => (
                <label key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span>{perm}</span>
                  <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4" />
                </label>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}