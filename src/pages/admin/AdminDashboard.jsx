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
  Clock,
  LogOut // 👈 1. เพิ่ม import ตัวนี้
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

const DEFAULT_ROLE_PERMISSIONS = {
  admin: ['live_map', 'activity'],
  staff: ['live_map'],
};

const PERMISSION_OPTIONS = [
  { key: 'live_map', label: 'ผังแสดงสถานะช่องจอด' },
  { key: 'finance', label: 'รายงานการเงิน' },
  { key: 'activity', label: 'รายงานการใช้งานและความหนาแน่น' },
];

// 👈 2. รับ props { currentUser, onLogout } เข้ามาตรงนี้
export default function AdminDashboard({ currentUser, onLogout }) {
  const [rolePermissions, setRolePermissions] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('smart_parking_role_permissions') || '{}');
      return {
        admin: Array.isArray(saved.admin) ? saved.admin : DEFAULT_ROLE_PERMISSIONS.admin,
        staff: Array.isArray(saved.staff) ? saved.staff : DEFAULT_ROLE_PERMISSIONS.staff,
      };
    } catch {
      return DEFAULT_ROLE_PERMISSIONS;
    }
  });
  const [selectedRole, setSelectedRole] = useState('admin');
  const userRole = currentUser?.role || 'superadmin';
  const canAccessRoles = userRole === 'superadmin';
  const effectivePermissions = canAccessRoles
    ? PERMISSION_OPTIONS.map(({ key }) => key)
    : rolePermissions[userRole] || currentUser?.permissions || [];
  const firstAllowedMenu = effectivePermissions.includes('live_map')
    ? 'map'
    : effectivePermissions.includes('finance')
      ? 'finance'
      : effectivePermissions.includes('activity')
        ? 'activity'
        : canAccessRoles ? 'roles' : 'none';
  const [activeMenu, setActiveMenu] = useState(firstAllowedMenu);
  const [selectedFloor, setSelectedFloor] = useState('FL1');

  // ตรวจสอบสิทธิ์จากคนที่ล็อกอินเข้ามาจริง (ถ้าไม่มี mock ค่าเริ่มต้นไว้)
  const roleLabel = userRole === 'superadmin'
    ? 'ผู้ดูแลระบบสูงสุด'
    : userRole === 'staff' ? 'เจ้าหน้าที่' : 'ผู้ดูแลระบบ';
  const canAccessMenu = (permission) => canAccessRoles || effectivePermissions.includes(permission);

  const toggleRolePermission = (role, permission) => {
    const currentPermissions = rolePermissions[role] || [];
    const nextPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((item) => item !== permission)
      : [...currentPermissions, permission];
    const updated = { ...rolePermissions, [role]: nextPermissions };
    localStorage.setItem('smart_parking_role_permissions', JSON.stringify(updated));
    setRolePermissions(updated);
  };

  const exportData = (type) => {
    alert(`กำลังดาวน์โหลดรายงาน ${type} ในรูปแบบ CSV/Excel...`);
  };

  return (
    <div className="flex min-h-[90vh] bg-[#F5F7FA] text-[#172B4D]">
      {/* Sidebar เมนูหลัก */}
      <aside className="w-64 bg-white border-r border-[#E3E8EF] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E3E8EF] pb-3">
            <span className="text-xs uppercase tracking-wider text-[#5E6C84] font-bold">ระบบผู้ดูแล</span>
            <span className="text-[10px] bg-[#1685F8]/10 text-[#1685F8] px-2 py-0.5 rounded-full border border-[#1685F8]/20 font-semibold uppercase">
              {roleLabel}
            </span>
          </div>

          <nav className="space-y-1.5 text-sm">
            {canAccessMenu('live_map') && (
            <button
              onClick={() => setActiveMenu('map')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                activeMenu === 'map' ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84] hover:bg-[#F5F7FA]'
              }`}
            >
              <LayoutDashboard size={18} />
              ผังแสดงสถานะช่องจอด
            </button>
            )}

            {canAccessMenu('finance') && (
            <button
              onClick={() => setActiveMenu('finance')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                activeMenu === 'finance' ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84] hover:bg-[#F5F7FA]'
              }`}
            >
              <DollarSign size={18} />
              รายงานการเงิน
            </button>
            )}

            {canAccessMenu('activity') && (
            <button
              onClick={() => setActiveMenu('activity')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                activeMenu === 'activity' ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84] hover:bg-[#F5F7FA]'
              }`}
            >
              <Activity size={18} />
              รายงานการใช้งานและความหนาแน่น
            </button>
            )}

            {canAccessRoles && (
              <button
                onClick={() => setActiveMenu('roles')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                  activeMenu === 'roles' ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84] hover:bg-[#F5F7FA]'
                }`}
              >
                <Users size={18} />
                จัดการสิทธิ์ผู้ใช้งาน
              </button>
            )}
          </nav>
        </div>

        {/* ส่วนท้ายของ Sidebar: ข้อมูล User + ปุ่ม Logout */}
        <div className="border-t border-[#E3E8EF] pt-4 space-y-3">
          <div className="text-[11px] text-[#5E6C84]">
            <p className="font-semibold text-[#172B4D] truncate">
              {currentUser?.name || 'ผู้ดูแลระบบ'}
            </p>
            <p className="text-[10px] text-[#7A869A]">
              สถานะ: <span className="text-[#1685F8] font-semibold">{roleLabel}</span>
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition"
          >
            <LogOut size={14} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* ================= 1. ผังเซนเซอร์ช่องจอดสด ================= */}
        {activeMenu === 'map' && canAccessMenu('live_map') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">ผังสถานะช่องจอดแบบเรียลไทม์</h2>
                <p className="text-xs text-[#5E6C84]">สถานะจากเซนเซอร์ประจำช่องจอดแบบสด (ลูกค้าจะไม่เห็นหน้านี้)</p>
              </div>

              {/* Floor Switcher */}
              <div className="flex gap-2 bg-white p-1 rounded-xl border border-[#E3E8EF]">
                <button
                  onClick={() => setSelectedFloor('FL1')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedFloor === 'FL1' ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84]'
                  }`}
                >
                  ชั้น 1 (FL1)
                </button>
                <button
                  onClick={() => setSelectedFloor('FL2')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedFloor === 'FL2' ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84]'
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
                        : 'bg-emerald-950/20 border-emerald-800/40 text-[#1685F8]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-lg">{slot.id}</span>
                      {slot.isEV && (
                        <span className="bg-sky-500/20 text-sky-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                          <Zap size={12} /> รถไฟฟ้า
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
        {activeMenu === 'finance' && canAccessMenu('finance') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">รายงานการเงินและรายรับ</h2>
                <p className="text-xs text-[#5E6C84]">ภาพรวมรายรับทั้งหมด และช่วงเวลาที่มีรายได้สูงสุด</p>
              </div>
              <button
                onClick={() => exportData('การเงิน')}
                className="flex items-center gap-2 bg-[#F5F7FA] hover:bg-[#E3E8EF] px-4 py-2 rounded-xl text-xs font-semibold border border-[#E3E8EF]"
              >
                <Download size={14} /> ดาวน์โหลดรายงาน
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-[#E3E8EF] p-5 rounded-2xl">
                <span className="text-xs text-[#5E6C84] font-medium">รายรับรวมวันนี้</span>
                <p className="text-2xl font-bold text-[#1685F8] mt-1 font-mono">24,400 บาท</p>
              </div>
              <div className="bg-white border border-[#E3E8EF] p-5 rounded-2xl">
                <span className="text-xs text-[#5E6C84] font-medium flex items-center gap-1">
                  <TrendingUp size={14} className="text-[#1685F8]" /> ช่วงเวลาที่มีรายรับสูงสุด
                </span>
                <p className="text-2xl font-bold text-[#172B4D] mt-1 font-mono">12:00 - 14:00 น.</p>
              </div>
              <div className="bg-white border border-[#E3E8EF] p-5 rounded-2xl">
                <span className="text-xs text-[#5E6C84] font-medium">จำนวนคันที่ชำระแล้ว</span>
                <p className="text-2xl font-bold text-sky-400 mt-1 font-mono">125 คัน</p>
              </div>
            </div>

            {/* กราฟ Recharts */}
            <div className="bg-white border border-[#E3E8EF] p-6 rounded-2xl">
              <h3 className="text-sm font-semibold mb-4">กราฟรายรับตามช่วงเวลา</h3>
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
        {activeMenu === 'activity' && canAccessMenu('activity') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">รายงานการใช้งานและความหนาแน่น</h2>
                <p className="text-xs text-[#5E6C84]">สถิติความหนาแน่นรายช่องจอด และรุ่นรถยนต์ยอดนิยม</p>
              </div>
              <button
                onClick={() => exportData('กิจกรรม')}
                className="flex items-center gap-2 bg-[#F5F7FA] hover:bg-[#E3E8EF] px-4 py-2 rounded-xl text-xs font-semibold border border-[#E3E8EF]"
              >
                <Download size={14} /> ดาวน์โหลดข้อมูล
              </button>
            </div>

            {/* Heatmap ช่องจอด */}
            <div className="bg-white border border-[#E3E8EF] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold">แผนผังความหนาแน่นของช่องจอด</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mockSlotHeatmap.map((item) => {
                  let bgColor = 'bg-emerald-950/40 border-emerald-800 text-[#1685F8]';
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
            <div className="bg-white border border-[#E3E8EF] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CarFront size={16} /> สถิติรุ่นรถและระยะเวลาจอดเฉลี่ย
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[#5E6C84] border-b border-[#E3E8EF] pb-2">
                    <tr>
                      <th className="py-2">รุ่นรถยนต์</th>
                      <th>จำนวนรถที่เข้ามา</th>
                      <th>จอดเฉลี่ย (ชม.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E8EF]">
                    {mockCarBrands.map((car, idx) => (
                      <tr key={idx} className="hover:bg-[#F5F7FA]/40">
                        <td className="py-3 font-semibold text-[#172B4D]">{car.brand}</td>
                        <td className="font-mono text-[#1685F8]">{car.count} คัน</td>
                        <td className="font-mono text-[#5E6C84]">{car.avgHours} ชั่วโมง</td>
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
            <div className="bg-white border border-[#E3E8EF] p-6 rounded-2xl space-y-4 max-w-2xl">
            <h2 className="text-xl font-bold">จัดการบทบาทและสิทธิ์ผู้ใช้งาน</h2>
              <p className="text-xs text-[#5E6C84]">กำหนดเมนูที่ผู้ดูแลระบบและเจ้าหน้าที่สามารถใช้งานได้</p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  { key: 'admin', label: 'ผู้ดูแลระบบ' },
                  { key: 'staff', label: 'เจ้าหน้าที่' },
                ].map((role) => (
                  <button
                    key={role.key}
                    onClick={() => setSelectedRole(role.key)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      selectedRole === role.key
                        ? 'border-[#1685F8] bg-[#1685F8]/10 text-[#1685F8]'
                        : 'border-[#E3E8EF] text-[#5E6C84] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
              <div className="space-y-3 pt-2">
                {PERMISSION_OPTIONS.map((permission) => (
                  <label key={permission.key} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-xl border border-[#E3E8EF] text-sm cursor-pointer">
                    <span>{permission.label}</span>
                    <input
                      type="checkbox"
                      checked={(rolePermissions[selectedRole] || []).includes(permission.key)}
                      onChange={() => toggleRolePermission(selectedRole, permission.key)}
                      className="accent-[#1685F8] w-4 h-4"
                    />
                  </label>
                ))}
              </div>
              <p className="text-xs text-[#5E6C84]">บันทึกสิทธิ์โดยอัตโนมัติเมื่อเปลี่ยนตัวเลือก</p>
          </div>
        )}
        {activeMenu === 'none' && (
          <div className="bg-white border border-[#E3E8EF] p-6 rounded-2xl">
            <h2 className="text-lg font-semibold">ยังไม่ได้รับสิทธิ์เข้าใช้งานเมนู</h2>
            <p className="text-sm text-[#5E6C84] mt-1">กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์เพิ่มเติม</p>
          </div>
        )}
      </main>
    </div>
  );
}
