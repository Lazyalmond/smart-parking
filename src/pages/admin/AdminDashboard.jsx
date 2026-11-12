import React, { useMemo, useState } from 'react';
import {
  Activity,
  Building2,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  mockSlots,
  mockHourlyRevenue,
  mockCarBrands,
  mockSlotHeatmap,
  mockCars,
  mockCompanies,
} from '../../data/mockData';

const COLORS = {
  blue: '#1685F8',
  blueDark: '#0866C6',
  ink: '#172B4D',
  muted: '#5E6C84',
  subtle: '#7A869A',
  border: '#E3E8EF',
  canvas: '#F5F7FA',
};

const DEFAULT_ROLE_PERMISSIONS = {
  admin: ['live_map', 'activity'],
  staff: ['live_map'],
};

const PERMISSION_OPTIONS = [
  { key: 'live_map', label: 'ผังแสดงสถานะช่องจอด' },
  { key: 'finance', label: 'รายงานรายรับค่าจอด' },
  { key: 'activity', label: 'รายงานการใช้งานและความหนาแน่น' },
];

const formatNumber = (value) => new Intl.NumberFormat('th-TH').format(value);

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#1685F8]">{eyebrow}</p>}
        <h1 className="text-xl font-bold text-[#172B4D] sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-[#5E6C84]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ label, value, hint, icon: Icon, tone = 'blue' }) {
  const iconClass = tone === 'green'
    ? 'bg-emerald-50 text-emerald-600'
    : tone === 'amber'
      ? 'bg-amber-50 text-amber-600'
      : 'bg-[#1685F8]/10 text-[#1685F8]';

  return (
    <div className="rounded-xl border border-[#E3E8EF] bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[#5E6C84]">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#172B4D]">{value}</p>
          {hint && <p className="mt-1 text-xs text-[#7A869A]">{hint}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${iconClass}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, description, action, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-[#E3E8EF] bg-white ${className}`}>
      {(title || action) && (
        <div className="flex flex-col gap-2 border-b border-[#E3E8EF] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            {title && <h2 className="text-sm font-semibold text-[#172B4D]">{title}</h2>}
            {description && <p className="mt-1 text-xs text-[#7A869A]">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export default function AdminDashboard({ currentUser, onLogout, vehicles: vehiclesProp, slots: slotsProp, setSlots: setSlotsProp }) {
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
  const [activeMenu, setActiveMenu] = useState(currentUser?.role === 'staff' ? 'map' : 'overview');
  const [selectedFloor, setSelectedFloor] = useState('FL1');
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [companies, setCompanies] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('smart_parking_companies') || 'null');
      return Array.isArray(saved) ? saved : mockCompanies;
    } catch {
      return mockCompanies;
    }
  });
  const [localSlots, setLocalSlots] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('smart_parking_slots') || 'null');
      return Array.isArray(saved) ? saved : mockSlots;
    } catch {
      return mockSlots;
    }
  });
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [companyForm, setCompanyForm] = useState({ name: '', code: '', plan: 'Standard', branchCount: 1, parkingLotCount: 1 });
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [slotForm, setSlotForm] = useState({ floor: 'FL1', count: 4, isEV: false });
  const [slotFilter, setSlotFilter] = useState('all');

  const userRole = currentUser?.role || 'superadmin';
  const isSuperAdmin = userRole === 'superadmin';
  const isCompanyAdmin = userRole === 'admin';
  const canAccessRoles = isSuperAdmin;
  const roleLabel = isSuperAdmin
    ? 'Super Admin'
    : isCompanyAdmin ? 'Company Admin' : 'Staff';
  const company = companies.find((item) => item.id === currentUser?.companyId) || companies[0] || { name: 'ไม่พบข้อมูลบริษัท', plan: '-', status: 'inactive', branchCount: 0, parkingLotCount: 0 };
  const slots = Array.isArray(slotsProp) ? slotsProp : localSlots;
  const vehicles = Array.isArray(vehiclesProp) ? vehiclesProp : mockCars;

  const effectivePermissions = isSuperAdmin
    ? ['live_map', 'finance', 'activity', 'manage_roles']
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
  const [slotFilter, setSlotFilter] = useState('all');


  const canAccessMenu = (menu) => {
    if (menu === 'overview') return isSuperAdmin || isCompanyAdmin;
    if (menu === 'companies' || menu === 'roles') return isSuperAdmin;
    if (menu === 'vehicles') return isSuperAdmin || effectivePermissions.includes('live_map');
    const permission = menu === 'map' ? 'live_map' : menu;
    return isSuperAdmin || effectivePermissions.includes(permission);
  };

  const navItems = [
    ...(isSuperAdmin || isCompanyAdmin ? [{ id: 'overview', label: 'ภาพรวม', icon: LayoutDashboard, section: 'หน้าหลัก' }] : []),
    ...(isSuperAdmin ? [{ id: 'companies', label: 'จัดการบริษัท', icon: Building2, section: 'แพลตฟอร์ม' }] : []),
    ...(canAccessMenu('map') ? [{ id: 'map', label: 'ผังช่องจอด', icon: MapPin, section: 'การจัดการลานจอด' }] : []),
    ...(canAccessMenu('vehicles') ? [{ id: 'vehicles', label: 'ค้นหาทะเบียนรถ', icon: CarFront, section: 'การจัดการลานจอด' }] : []),
    ...(canAccessMenu('finance') ? [{ id: 'finance', label: 'รายงานรายรับค่าจอด', icon: CreditCard, section: 'รายงาน' }] : []),
    ...(canAccessMenu('activity') ? [{ id: 'activity', label: 'การใช้งานและ Heatmap', icon: Activity, section: 'รายงาน' }] : []),
    ...(canAccessRoles ? [{ id: 'roles', label: 'ผู้ใช้งานและสิทธิ์', icon: Users, section: 'ตั้งค่าระบบ' }] : []),
  ];

  const companyStats = useMemo(() => ({
    totalCompanies: companies.length,
    activeCompanies: companies.filter((item) => item.status === 'active').length,
    totalBranches: companies.reduce((sum, item) => sum + (item.branchCount || 0), 0),
    totalLots: companies.reduce((sum, item) => sum + (item.parkingLotCount || 0), 0),
  }), [companies]);

  const totalRevenue = mockHourlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const occupiedSlots = slots.filter((slot) => slot.occupied).length;
  const freeSlots = slots.length - occupiedSlots;
  const filteredCompanies = companies.filter((item) => {
    const search = companySearch.trim().toLowerCase();
    return !search || item.name.toLowerCase().includes(search) || item.code.toLowerCase().includes(search);
  });
  const selectedCompany = companies.find((item) => item.id === selectedCompanyId);
  const normalizedVehicleSearch = vehicleSearch.trim().toLowerCase().replace(/[\s-]/g, '');
  const filteredVehicles = vehicles.filter((car) => {
    if (!normalizedVehicleSearch) return true;
    return [car.plate, car.brand, car.slotId, car.floor].some((value) => String(value || '').toLowerCase().replace(/[\s-]/g, '').includes(normalizedVehicleSearch));
  });

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
    let rows = [];
    if (type === 'บริษัท') {
      rows = [
        ['บริษัท', 'รหัสบริษัท', 'แพ็กเกจ', 'สถานะ', 'จำนวนสาขา', 'จำนวนลานจอด'],
        ...companies.map((item) => [item.name, item.code, item.plan, item.status, item.branchCount, item.parkingLotCount]),
      ];
    } else if (type === 'การเงิน') {
      rows = [['เวลา', 'รายรับค่าจอด (บาท)'], ...mockHourlyRevenue.map((item) => [item.time, item.revenue])];
    } else {
      rows = [['รุ่นรถ', 'จำนวนรถ', 'เวลาจอดเฉลี่ย (ชั่วโมง)'], ...mockCarBrands.map((item) => [item.brand, item.count, item.avgHours])];
    }
    const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-parking-${type}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectMenu = (menu) => {
    setActiveMenu(menu);
    setSelectedCompanyId(null);
    setMobileNavOpen(false);
  };

  const persistCompanies = (nextCompanies) => {
    setCompanies(nextCompanies);
    localStorage.setItem('smart_parking_companies', JSON.stringify(nextCompanies));
  };

  const openCreateCompany = () => {
    setEditingCompanyId(null);
    setCompanyForm({ name: '', code: '', plan: 'Standard', branchCount: 1, parkingLotCount: 1 });
    setCompanyModalOpen(true);
  };

  const openEditCompany = (item) => {
    setEditingCompanyId(item.id);
    setCompanyForm({
      name: item.name || '',
      code: item.code || '',
      plan: item.plan || 'Standard',
      branchCount: item.branchCount || 1,
      parkingLotCount: item.parkingLotCount || 1,
    });
    setCompanyModalOpen(true);
  };

  const handleCompanySubmit = (event) => {
    event.preventDefault();
    const name = companyForm.name.trim();
    const code = companyForm.code.trim().toUpperCase();
    if (!name || !code) return;
    const duplicateCode = companies.some((item) => item.code?.toUpperCase() === code && item.id !== editingCompanyId);
    if (duplicateCode) {
      alert('รหัสบริษัทนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น');
      return;
    }

    const companyData = {
      id: editingCompanyId || `company-${Date.now()}`,
      name,
      code,
      plan: companyForm.plan,
      status: editingCompanyId ? (companies.find((item) => item.id === editingCompanyId)?.status || 'active') : 'active',
      branchCount: Math.max(0, Number(companyForm.branchCount) || 0),
      parkingLotCount: Math.max(0, Number(companyForm.parkingLotCount) || 0),
    };
    const nextCompanies = editingCompanyId
      ? companies.map((item) => item.id === editingCompanyId ? { ...item, ...companyData } : item)
      : [...companies, companyData];
    persistCompanies(nextCompanies);
    setSelectedCompanyId(companyData.id);
    setCompanyModalOpen(false);
  };


  const handleAddParkingSlots = (event) => {
    event.preventDefault();
    const count = Math.min(100, Math.max(1, Number(slotForm.count) || 1));
    const floor = slotForm.floor;
    const prefix = floor === 'FL1' ? 'A' : floor === 'FL2' ? 'B' : `F${floor.replace(/\D/g, '') || 'X'}`;
    const nextSlots = [...slots];
    let serial = 1;
    let added = 0;

            {(() => {
              const floorSlots = mockSlots.filter((slot) => slot.floor === selectedFloor);
              const occupiedCount = floorSlots.filter((slot) => slot.occupied).length;
              const availableCount = floorSlots.length - occupiedCount;
              const visibleSlots = floorSlots.filter((slot) =>
                slotFilter === 'all' || (slotFilter === 'occupied' ? slot.occupied : !slot.occupied)
              );

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-[#E3E8EF] bg-white p-4 sm:p-5">
                      <p className="text-xs font-medium text-[#5E6C84]">ช่องจอดทั้งหมด</p>
                      <p className="mt-1 text-2xl font-bold text-[#172B4D]">{floorSlots.length}<span className="ml-1 text-sm font-medium text-[#5E6C84]">ช่อง</span></p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
                      <p className="text-xs font-medium text-emerald-800">ว่าง</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-700">{availableCount}<span className="ml-1 text-sm font-medium">ช่อง</span></p>
                    </div>
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
                      <p className="text-xs font-medium text-rose-800">มีรถจอด</p>
                      <p className="mt-1 text-2xl font-bold text-rose-700">{occupiedCount}<span className="ml-1 text-sm font-medium">ช่อง</span></p>
                    </div>
                  </div>

                  <section className="overflow-hidden rounded-2xl border border-[#E3E8EF] bg-white">
                    <div className="flex flex-col gap-3 border-b border-[#E3E8EF] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <div>
                        <h3 className="font-bold text-[#172B4D]">สถานะช่องจอด ชั้น {selectedFloor === 'FL1' ? '1' : '2'}</h3>
                        <p className="mt-0.5 text-xs text-[#5E6C84]">เลือกดูช่องว่างหรือช่องที่มีรถจอด</p>
                      </div>
                      <div className="flex gap-1 rounded-xl bg-[#F5F7FA] p-1" aria-label="ตัวกรองสถานะช่องจอด">
                        {[
                          { key: 'all', label: `ทั้งหมด ${floorSlots.length}` },
                          { key: 'available', label: `ว่าง ${availableCount}` },
                          { key: 'occupied', label: `มีรถ ${occupiedCount}` },
                        ].map((filter) => (
                          <button
                            key={filter.key}
                            type="button"
                            onClick={() => setSlotFilter(filter.key)}
                            aria-pressed={slotFilter === filter.key}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${slotFilter === filter.key ? 'bg-white text-[#172B4D] shadow-sm' : 'text-[#5E6C84] hover:text-[#172B4D]'}`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 sm:gap-3 sm:p-5 lg:grid-cols-4 xl:grid-cols-5">
                      {visibleSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`flex min-h-[112px] flex-col justify-between rounded-xl border p-3.5 transition hover:shadow-sm ${slot.occupied ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-lg font-bold text-[#172B4D]">{slot.id}</span>
                            {slot.isEV && <span title="ช่องชาร์จรถไฟฟ้า" aria-label="ช่องชาร์จรถไฟฟ้า" className="rounded-lg bg-sky-100 p-1.5 text-sky-700"><Zap size={15} /></span>}
                          </div>
                          <div className={`flex items-center gap-2 text-xs font-semibold ${slot.occupied ? 'text-rose-800' : 'text-emerald-800'}`}>
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${slot.occupied ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            {slot.occupied ? 'มีรถจอด' : 'ว่าง'}
                          </div>
                        </div>
                      ))}
                      {visibleSlots.length === 0 && <p className="col-span-full py-8 text-center text-sm text-[#5E6C84]">ไม่พบช่องจอดในสถานะนี้</p>}
                    </div>
                  </section>
                </div>
              );
            })()}
          </div>
        )}


    while (added < count) {
      const id = `${prefix}-${String(serial).padStart(2, '0')}`;
      serial += 1;
      if (nextSlots.some((item) => item.id === id)) continue;
      nextSlots.push({ id, floor, occupied: false, isEV: Boolean(slotForm.isEV) });
      added += 1;
    }

    setLocalSlots(nextSlots);
    if (typeof setSlotsProp === 'function') setSlotsProp(nextSlots);
    localStorage.setItem('smart_parking_slots', JSON.stringify(nextSlots));
    setSelectedFloor(floor);
    setSlotModalOpen(false);
    setSlotForm((previous) => ({ ...previous, count: 4 }));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <PageHeading
        eyebrow={isSuperAdmin ? 'Platform overview' : 'Company overview'}
        title={isSuperAdmin ? 'ภาพรวมแพลตฟอร์ม' : `ภาพรวม ${company.name}`}
        description={isSuperAdmin
          ? 'ภาพรวมบริษัทและลานจอดรถทั้งหมดที่อยู่บนระบบ Smart Parking'
          : 'ภาพรวมการดำเนินงานของบริษัทและลานจอดรถในความดูแล'}
      />

      {isSuperAdmin ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="บริษัททั้งหมด" value={formatNumber(companyStats.totalCompanies)} hint="บริษัทที่ลงทะเบียนในระบบ" icon={Building2} />
            <StatCard label="บริษัทที่ใช้งาน" value={formatNumber(companyStats.activeCompanies)} hint="สถานะ Active" icon={CheckCircle2} tone="green" />
            <StatCard label="สาขาทั้งหมด" value={formatNumber(companyStats.totalBranches)} hint="รวมทุกบริษัท" icon={MapPin} />
            <StatCard label="ลานจอดทั้งหมด" value={formatNumber(companyStats.totalLots)} hint="รวมทุกบริษัท" icon={CarFront} />
          </div>
          <SectionCard
            title="บริษัทในระบบ"
            description="รายการบริษัทตัวอย่างที่เช่าใช้แพลตฟอร์ม Smart Parking"
            action={<button onClick={() => selectMenu('companies')} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1685F8] hover:text-[#0866C6]">ดูบริษัททั้งหมด <ChevronRight size={15} /></button>}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-xs text-[#7A869A]">
                  <tr className="border-b border-[#E3E8EF]">
                    <th className="pb-3 font-medium">ชื่อบริษัท</th>
                    <th className="pb-3 font-medium">แพ็กเกจ</th>
                    <th className="pb-3 font-medium">สาขา</th>
                    <th className="pb-3 font-medium">ลานจอด</th>
                    <th className="pb-3 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8EF]">
                  {companies.slice(0, 4).map((item) => (
                    <tr key={item.id}>
                      <td className="py-3.5">
                        <p className="font-semibold text-[#172B4D]">{item.name}</p>
                        <p className="mt-0.5 text-xs text-[#7A869A]">รหัส {item.code}</p>
                      </td>
                      <td className="py-3.5 text-[#5E6C84]">{item.plan}</td>
                      <td className="py-3.5 text-[#5E6C84]">{item.branchCount}</td>
                      <td className="py-3.5 text-[#5E6C84]">{item.parkingLotCount}</td>
                      <td className="py-3.5"><StatusBadge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
          <div className="rounded-xl border border-[#D7E8FC] bg-[#F2F8FF] p-4 text-sm text-[#315B86]">
            <p className="font-semibold">หมายเหตุเกี่ยวกับรายได้</p>
            <p className="mt-1 text-xs leading-5">รายงานรายรับค่าจอดเป็นเงินที่ผู้ขับขี่ชำระให้ผู้ให้บริการลานจอด ส่วนรายได้ของแพลตฟอร์มจากค่าเช่าระบบของบริษัทจะเป็นรายงานอีกส่วนหนึ่ง ซึ่งยังไม่ได้เปิดใช้ใน Mock Data ชุดนี้</p>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="ลานจอดในบริษัท" value={formatNumber(company.parkingLotCount || 0)} hint="ทุกลานจอดที่ลงทะเบียน" icon={CarFront} />
            <StatCard label="สาขา" value={formatNumber(company.branchCount || 0)} hint="สาขาภายใต้บริษัท" icon={MapPin} />
            <StatCard label="ช่องจอดที่มีรถ" value={formatNumber(occupiedSlots)} hint="จากข้อมูลตัวอย่างปัจจุบัน" icon={CarFront} tone="amber" />
            <StatCard label="ช่องจอดว่าง" value={formatNumber(freeSlots)} hint="จากข้อมูลตัวอย่างปัจจุบัน" icon={CheckCircle2} tone="green" />
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
            <SectionCard title="สถานะช่องจอด" description="สรุปสถานะช่องจอดจากข้อมูลจำลอง">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[#F5F7FA] p-4">
                  <p className="text-xs text-[#5E6C84]">มีรถจอด</p>
                  <p className="mt-1 text-2xl font-bold text-[#172B4D]">{occupiedSlots}</p>
                </div>
                <div className="rounded-lg bg-[#F5F7FA] p-4">
                  <p className="text-xs text-[#5E6C84]">ว่าง</p>
                  <p className="mt-1 text-2xl font-bold text-[#1685F8]">{freeSlots}</p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E3E8EF]">
                <div className="h-full rounded-full bg-[#1685F8]" style={{ width: `${slots.length ? (occupiedSlots / slots.length) * 100 : 0}%` }} />
              </div>
              <p className="mt-2 text-xs text-[#7A869A]">อัตราการใช้ช่องจอด {slots.length ? Math.round((occupiedSlots / slots.length) * 100) : 0}%</p>
            </SectionCard>
            <SectionCard title="ข้อมูลแพ็กเกจบริษัท">
              <p className="text-xs text-[#7A869A]">แพ็กเกจปัจจุบัน</p>
              <p className="mt-1 text-xl font-bold text-[#172B4D]">{company.plan}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 size={15} />
                <span>{company.status === 'active' ? 'บริษัทกำลังใช้งานระบบ' : 'บริษัทไม่ได้ใช้งาน'}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#7A869A]">ข้อมูลแพ็กเกจนี้เป็นข้อมูลจำลอง การจัดการสัญญาและการชำระค่าเช่าระบบจะเพิ่มในขั้นตอนถัดไป</p>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Platform management"
        title="จัดการบริษัท"
        description="เพิ่ม แก้ไข และค้นหาบริษัทที่เช่าใช้ระบบ Smart Parking"
        action={(
          <div className="flex flex-wrap gap-2">
            <button onClick={() => exportData('บริษัท')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E3E8EF] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#172B4D] hover:bg-[#F5F7FA]"><Download size={16} /> ส่งออกข้อมูล</button>
            <button onClick={openCreateCompany} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1685F8] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#0866C6]"><Plus size={16} /> เพิ่มบริษัท</button>
          </div>
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="บริษัททั้งหมด" value={companyStats.totalCompanies} icon={Building2} />
        <StatCard label="บริษัทที่ใช้งาน" value={companyStats.activeCompanies} icon={CheckCircle2} tone="green" />
        <StatCard label="แพ็กเกจที่ใช้" value={new Set(companies.map((item) => item.plan)).size} hint="ประเภทแพ็กเกจที่แตกต่างกัน" icon={CreditCard} />
      </div>
      <SectionCard title="รายชื่อบริษัท" description="ค้นหาบริษัทด้วยชื่อหรือรหัส และแก้ไขข้อมูลได้จากรายการนี้">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A869A]" />
            <input value={companySearch} onChange={(event) => setCompanySearch(event.target.value)} placeholder="ค้นหาชื่อหรือรหัสบริษัท" className="w-full rounded-lg border border-[#E3E8EF] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#1685F8]" />
          </div>
          <span className="text-xs text-[#7A869A]">พบ {filteredCompanies.length} จาก {companies.length} บริษัท</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#F5F7FA] text-xs text-[#5E6C84]">
              <tr>
                <th className="rounded-l-lg px-3 py-3 font-semibold">บริษัท</th>
                <th className="px-3 py-3 font-semibold">แพ็กเกจ</th>
                <th className="px-3 py-3 font-semibold">จำนวนสาขา</th>
                <th className="px-3 py-3 font-semibold">ลานจอด</th>
                <th className="px-3 py-3 font-semibold">สถานะ</th>
                <th className="rounded-r-lg px-3 py-3 font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8EF]">
              {filteredCompanies.map((item) => (
                <tr key={item.id} className="hover:bg-[#F9FBFD]">
                  <td className="px-3 py-4"><p className="font-semibold text-[#172B4D]">{item.name}</p><p className="mt-0.5 text-xs text-[#7A869A]">รหัส {item.code}</p></td>
                  <td className="px-3 py-4 text-[#5E6C84]">{item.plan}</td>
                  <td className="px-3 py-4 text-[#5E6C84]">{item.branchCount}</td>
                  <td className="px-3 py-4 text-[#5E6C84]">{item.parkingLotCount}</td>
                  <td className="px-3 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-3 py-4"><div className="flex items-center gap-3"><button onClick={() => setSelectedCompanyId(item.id)} className="text-xs font-semibold text-[#1685F8] hover:text-[#0866C6]">รายละเอียด</button><button onClick={() => openEditCompany(item)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#5E6C84] hover:text-[#1685F8]"><Pencil size={13} /> แก้ไข</button></div></td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-sm text-[#7A869A]">ไม่พบบริษัทที่ค้นหา</td></tr>}
            </tbody>
          </table>
        </div>
      </SectionCard>
      {selectedCompany && (
        <SectionCard title="รายละเอียดบริษัท" description={`รหัสบริษัท ${selectedCompany.code}`} action={<div className="flex gap-3"><button onClick={() => openEditCompany(selectedCompany)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1685F8]"><Pencil size={13} /> แก้ไข</button><button onClick={() => setSelectedCompanyId(null)} className="text-xs font-semibold text-[#5E6C84]">ปิดรายละเอียด</button></div>}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem label="ชื่อบริษัท" value={selectedCompany.name} />
            <DetailItem label="แพ็กเกจ" value={selectedCompany.plan} />
            <DetailItem label="จำนวนสาขา" value={`${selectedCompany.branchCount} สาขา`} />
            <DetailItem label="จำนวนลานจอด" value={`${selectedCompany.parkingLotCount} ลาน`} />
          </div>
        </SectionCard>
      )}


      {companyModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label={editingCompanyId ? 'แก้ไขบริษัท' : 'เพิ่มบริษัท'}>
          <form onSubmit={handleCompanySubmit} className="w-full max-w-xl rounded-2xl border border-[#E3E8EF] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E3E8EF] px-5 py-4"><div><h2 className="text-base font-bold text-[#172B4D]">{editingCompanyId ? 'แก้ไขข้อมูลบริษัท' : 'เพิ่มบริษัทใหม่'}</h2><p className="mt-1 text-xs text-[#7A869A]">ข้อมูลจะบันทึกใน Mock Data ของเบราว์เซอร์นี้</p></div><button type="button" onClick={() => setCompanyModalOpen(false)} className="rounded-lg p-2 text-[#7A869A] hover:bg-[#F5F7FA]" aria-label="ปิด"><X size={18} /></button></div>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-2"><span className="text-xs font-semibold text-[#5E6C84]">ชื่อบริษัท</span><input required value={companyForm.name} onChange={(event) => setCompanyForm({ ...companyForm, name: event.target.value })} placeholder="เช่น Metro Parking" className="w-full rounded-lg border border-[#E3E8EF] px-3 py-2.5 text-sm outline-none focus:border-[#1685F8]" /></label>
              <label className="space-y-1.5"><span className="text-xs font-semibold text-[#5E6C84]">รหัสบริษัท</span><input required value={companyForm.code} onChange={(event) => setCompanyForm({ ...companyForm, code: event.target.value.toUpperCase() })} placeholder="เช่น MTP" className="w-full rounded-lg border border-[#E3E8EF] px-3 py-2.5 text-sm uppercase outline-none focus:border-[#1685F8]" /></label>
              <label className="space-y-1.5"><span className="text-xs font-semibold text-[#5E6C84]">แพ็กเกจ</span><select value={companyForm.plan} onChange={(event) => setCompanyForm({ ...companyForm, plan: event.target.value })} className="w-full rounded-lg border border-[#E3E8EF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1685F8]"><option>Standard</option><option>Premium</option><option>Enterprise</option></select></label>
              <label className="space-y-1.5"><span className="text-xs font-semibold text-[#5E6C84]">จำนวนสาขา</span><input type="number" min="0" value={companyForm.branchCount} onChange={(event) => setCompanyForm({ ...companyForm, branchCount: event.target.value })} className="w-full rounded-lg border border-[#E3E8EF] px-3 py-2.5 text-sm outline-none focus:border-[#1685F8]" /></label>
              <label className="space-y-1.5"><span className="text-xs font-semibold text-[#5E6C84]">จำนวนลานจอด</span><input type="number" min="0" value={companyForm.parkingLotCount} onChange={(event) => setCompanyForm({ ...companyForm, parkingLotCount: event.target.value })} className="w-full rounded-lg border border-[#E3E8EF] px-3 py-2.5 text-sm outline-none focus:border-[#1685F8]" /></label>

        {/* ================= 3. รายงานกิจกรรม & Heatmap ================= */}
        {activeMenu === 'activity' && canAccessMenu('activity') && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">รายงานการใช้งานและความหนาแน่น</h2>
                <p className="text-xs text-[#5E6C84]">สถิติความหนาแน่นรายช่องจอด และรุ่นรถยนต์ยอดนิยม</p>
              </div>
              <button
                onClick={() => exportData('กิจกรรม')}
                className="flex w-fit items-center gap-2 bg-white hover:bg-[#F5F7FA] px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#E3E8EF]"
              >
                <Download size={14} /> ดาวน์โหลดข้อมูล
              </button>

            </div>
            <div className="flex justify-end gap-2 border-t border-[#E3E8EF] px-5 py-4"><button type="button" onClick={() => setCompanyModalOpen(false)} className="rounded-lg border border-[#E3E8EF] px-4 py-2.5 text-sm font-semibold text-[#5E6C84] hover:bg-[#F5F7FA]">ยกเลิก</button><button type="submit" className="rounded-lg bg-[#1685F8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0866C6]">{editingCompanyId ? 'บันทึกการแก้ไข' : 'เพิ่มบริษัท'}</button></div>
          </form>
        </div>
      )}
    </div>
  );


  const renderMap = () => {
    const floorOptions = [...new Set([...slots.map((slot) => slot.floor), 'FL1', 'FL2'])].filter(Boolean).sort();
    const floorSlots = slots.filter((slot) => slot.floor === selectedFloor);
    const visibleSlots = floorSlots.filter((slot) => {
      if (slotFilter === 'occupied') return slot.occupied;
      if (slotFilter === 'available') return !slot.occupied;
      if (slotFilter === 'ev') return slot.isEV;
      return true;
    });
    const occupiedOnFloor = floorSlots.filter((slot) => slot.occupied).length;
    const availableOnFloor = floorSlots.length - occupiedOnFloor;
    const splitIndex = Math.ceil(visibleSlots.length / 2);
    const topRow = visibleSlots.slice(0, splitIndex);
    const bottomRow = visibleSlots.slice(splitIndex);

    const renderBay = (slot) => (
      <div key={slot.id} className={`relative flex min-h-[142px] flex-col justify-between rounded-xl border p-3 transition ${slot.occupied ? 'border-slate-300 bg-white' : 'border-[#B9D9FA] bg-[#F2F8FF]'}`}>
        <div className="flex items-center justify-between gap-2"><span className="font-mono text-sm font-bold text-[#172B4D]">{slot.id}</span>{slot.isEV && <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#1685F8]"><Zap size={11} /> EV</span>}</div>
        <div className="flex justify-center py-2"><div className={`flex h-16 w-12 items-center justify-center rounded-xl border ${slot.occupied ? 'border-slate-300 bg-slate-100 text-slate-500' : 'border-[#B9D9FA] bg-white text-[#1685F8]'}`}><CarFront size={32} strokeWidth={1.7} /></div></div>
        <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5E6C84]"><span className={`h-2 w-2 rounded-full ${slot.occupied ? 'bg-slate-500' : 'bg-[#1685F8]'}`} />{slot.occupied ? 'มีรถจอด' : 'ว่าง'}</span><span className="text-[10px] text-[#A0AAB8]">{slot.occupied ? 'Occupied' : 'Available'}</span></div>
      </div>
    );

    return (
      <div className="space-y-6">
        <PageHeading eyebrow="Parking operations" title="ผังสถานะช่องจอด" description="ดูตำแหน่งช่องจอด แยกตามชั้นและกรองสถานะได้" action={<button onClick={() => { setSlotForm({ floor: selectedFloor, count: 4, isEV: false }); setSlotModalOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#1685F8] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#0866C6]"><Plus size={16} /> เพิ่มช่องจอด</button>} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><StatCard label="ช่องจอดทั้งหมด" value={slots.length} icon={CarFront} /><StatCard label="มีรถจอด" value={occupiedSlots} icon={CarFront} tone="amber" /><StatCard label="ช่องจอดว่าง" value={freeSlots} icon={CheckCircle2} tone="green" /></div>
        <SectionCard title="เลือกพื้นที่จอดรถ" description="เลือกชั้นและกรองช่องจอดตามสถานะ">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">{floorOptions.map((floor) => <button key={floor} onClick={() => { setSelectedFloor(floor); setSlotForm((previous) => ({ ...previous, floor })); }} className={`rounded-lg border px-4 py-2 text-sm font-semibold ${selectedFloor === floor ? 'border-[#1685F8] bg-[#1685F8] text-white' : 'border-[#E3E8EF] bg-white text-[#5E6C84] hover:bg-[#F5F7FA]'}`}>{floor === 'FL1' ? 'ชั้น 1' : floor === 'FL2' ? 'ชั้น 2' : floor}</button>)}</div>
            <div className="flex flex-wrap gap-1 rounded-lg border border-[#E3E8EF] bg-[#F5F7FA] p-1">{[{ id: 'all', label: 'ทั้งหมด' }, { id: 'occupied', label: 'มีรถจอด' }, { id: 'available', label: 'ว่าง' }, { id: 'ev', label: 'EV' }].map((filter) => <button key={filter.id} onClick={() => setSlotFilter(filter.id)} className={`rounded-md px-3 py-2 text-xs font-semibold ${slotFilter === filter.id ? 'bg-white text-[#1685F8] shadow-sm' : 'text-[#5E6C84]'}`}>{filter.label}</button>)}</div>

            {(() => {
              const vehicleCount = mockCarBrands.reduce((sum, car) => sum + car.count, 0);
              const averageHours = mockCarBrands.length
                ? (mockCarBrands.reduce((sum, car) => sum + car.avgHours * car.count, 0) / (vehicleCount || 1)).toFixed(1)
                : '0.0';
              const busySlots = mockSlotHeatmap.filter((item) => item.density > 80).length;

              return (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                    <div className="rounded-2xl border border-[#E3E8EF] bg-white p-4 sm:p-5">
                      <p className="text-xs font-medium text-[#5E6C84]">รถที่เข้าใช้บริการ</p>
                      <p className="mt-1 text-2xl font-bold text-[#172B4D]">{vehicleCount}<span className="ml-1 text-sm font-medium text-[#5E6C84]">คัน</span></p>
                    </div>
                    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:p-5">
                      <p className="text-xs font-medium text-sky-800">เวลาจอดเฉลี่ย</p>
                      <p className="mt-1 text-2xl font-bold text-sky-700">{averageHours}<span className="ml-1 text-sm font-medium">ชม.</span></p>
                    </div>
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
                      <p className="text-xs font-medium text-rose-800">ช่องที่มีความหนาแน่นสูง</p>
                      <p className="mt-1 text-2xl font-bold text-rose-700">{busySlots}<span className="ml-1 text-sm font-medium">ช่อง</span></p>
                    </div>
                  </div>

            {/* Heatmap ช่องจอด */}
            <div className="bg-white border border-[#E3E8EF] p-4 sm:p-6 rounded-2xl space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#172B4D]">แผนผังความหนาแน่นของช่องจอด</h3>
                  <p className="mt-1 text-xs text-[#5E6C84]">เปอร์เซ็นต์ยิ่งสูง หมายถึงช่องจอดถูกใช้งานบ่อย</p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-[#5E6C84]">
                  <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />ต่ำ · 0–50%</span>
                  <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber-500" />ปานกลาง · 51–80%</span>
                  <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-rose-500" />สูง · 81–100%</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {mockSlotHeatmap.map((item) => {
                  let color = 'bg-emerald-50 border-emerald-200 text-emerald-800';
                  let barColor = 'bg-emerald-500';
                  if (item.density > 80) {
                    color = 'bg-rose-50 border-rose-200 text-rose-800';
                    barColor = 'bg-rose-500';
                  } else if (item.density > 50) {
                    color = 'bg-amber-50 border-amber-200 text-amber-800';
                    barColor = 'bg-amber-500';
                  }

                  return (
                    <div key={item.slot} className={`rounded-xl border p-4 ${color}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#172B4D]">{item.slot}</span>
                        <span className="text-lg font-bold">{item.density}<span className="text-xs">%</span></span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80" role="progressbar" aria-label={`ความหนาแน่น ${item.slot}`} aria-valuenow={item.density} aria-valuemin={0} aria-valuemax={100}>
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(100, Math.max(0, item.density))}%` }} />
                      </div>
                      <span className="mt-2 block text-[11px] font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* สถิติรุ่นรถ */}
            <div className="bg-white border border-[#E3E8EF] p-4 sm:p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CarFront size={16} /> สถิติรุ่นรถและระยะเวลาจอดเฉลี่ย
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-xs">
                  <thead className="bg-[#F5F7FA] text-[#5E6C84]">
                    <tr>
                      <th className="py-2">รุ่นรถยนต์</th>
                      <th>จำนวนรถที่เข้ามา</th>
                      <th>จอดเฉลี่ย (ชม.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E8EF]">
                    {mockCarBrands.map((car, idx) => (
                      <tr key={idx} className="hover:bg-[#F5F7FA]/70">
                        <td className="py-3 font-semibold text-[#172B4D]">{car.brand}</td>
                        <td className="font-mono font-semibold text-[#1685F8]">{car.count} คัน</td>
                        <td className="font-mono text-[#5E6C84]">{car.avgHours} ชั่วโมง</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
                </>
              );
            })()}

          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-lg bg-[#F5F7FA] p-3"><p className="text-xs text-[#7A869A]">ช่องจอดในชั้นนี้</p><p className="mt-1 text-xl font-bold text-[#172B4D]">{floorSlots.length}</p></div><div className="rounded-lg bg-[#F5F7FA] p-3"><p className="text-xs text-[#7A869A]">มีรถจอด</p><p className="mt-1 text-xl font-bold text-slate-600">{occupiedOnFloor}</p></div><div className="rounded-lg bg-[#F5F7FA] p-3"><p className="text-xs text-[#7A869A]">ว่างพร้อมจอด</p><p className="mt-1 text-xl font-bold text-[#1685F8]">{availableOnFloor}</p></div></div>
        </SectionCard>
        <SectionCard title={`แผนผังลานจอด — ${selectedFloor === 'FL1' ? 'ชั้น 1' : selectedFloor === 'FL2' ? 'ชั้น 2' : selectedFloor}`} description="สัญลักษณ์รถแสดงช่องที่มีรถจอด ส่วนช่องสีฟ้าอ่อนคือช่องว่าง">
          <div className="rounded-xl border border-dashed border-[#C9D7E6] bg-[#F8FAFC] p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between text-[11px] text-[#7A869A]"><span>ทางเข้าพื้นที่จอด</span><span>ข้อมูลตัวอย่าง · {visibleSlots.length} ช่องที่แสดง</span></div>
            {visibleSlots.length === 0 ? <p className="py-12 text-center text-sm text-[#7A869A]">ไม่พบช่องจอดตามตัวกรองนี้</p> : <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{topRow.map(renderBay)}</div>
              {bottomRow.length > 0 && <div className="my-4 flex items-center justify-center border-y border-dashed border-[#B9C8D8] bg-white py-3 text-xs font-semibold tracking-wide text-[#7A869A]"><span className="mr-2">↔</span> ช่องทางสัญจรรถ <span className="ml-2">↔</span></div>}
              {bottomRow.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{bottomRow.map(renderBay)}</div>}
            </>}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#E3E8EF] pt-3 text-[11px] text-[#5E6C84]"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> มีรถจอด</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#1685F8]" /> ว่าง</span><span className="flex items-center gap-1.5"><Zap size={12} className="text-[#1685F8]" /> ช่อง EV</span></div>
          </div>
        </SectionCard>

        {slotModalOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label="เพิ่มช่องจอด"><form onSubmit={handleAddParkingSlots} className="w-full max-w-md rounded-2xl border border-[#E3E8EF] bg-white shadow-xl"><div className="flex items-center justify-between border-b border-[#E3E8EF] px-5 py-4"><div><h2 className="text-base font-bold text-[#172B4D]">เพิ่มช่องจอด</h2><p className="mt-1 text-xs text-[#7A869A]">ระบบจะสร้างรหัสช่องจอดต่อจากรายการเดิมให้อัตโนมัติ</p></div><button type="button" onClick={() => setSlotModalOpen(false)} className="rounded-lg p-2 text-[#7A869A] hover:bg-[#F5F7FA]" aria-label="ปิด"><X size={18} /></button></div><div className="space-y-4 p-5"><label className="block space-y-1.5"><span className="text-xs font-semibold text-[#5E6C84]">ชั้นจอดรถ</span><select value={slotForm.floor} onChange={(event) => setSlotForm({ ...slotForm, floor: event.target.value })} className="w-full rounded-lg border border-[#E3E8EF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1685F8]"><option value="FL1">ชั้น 1 (FL1)</option><option value="FL2">ชั้น 2 (FL2)</option></select></label><label className="block space-y-1.5"><span className="text-xs font-semibold text-[#5E6C84]">จำนวนช่องจอดที่ต้องการเพิ่ม</span><input type="number" min="1" max="100" required value={slotForm.count} onChange={(event) => setSlotForm({ ...slotForm, count: event.target.value })} className="w-full rounded-lg border border-[#E3E8EF] px-3 py-2.5 text-sm outline-none focus:border-[#1685F8]" /></label><label className="flex items-center gap-2 rounded-lg border border-[#E3E8EF] p-3 text-sm text-[#5E6C84]"><input type="checkbox" checked={slotForm.isEV} onChange={(event) => setSlotForm({ ...slotForm, isEV: event.target.checked })} className="h-4 w-4 accent-[#1685F8]" />กำหนดเป็นช่องจอดรถ EV ทั้งหมด</label><p className="text-xs leading-5 text-[#7A869A]">รหัสช่องจอดจะเริ่มจากหมายเลขถัดไป เช่น A-05 สำหรับชั้น 1 หรือ B-05 สำหรับชั้น 2</p></div><div className="flex justify-end gap-2 border-t border-[#E3E8EF] px-5 py-4"><button type="button" onClick={() => setSlotModalOpen(false)} className="rounded-lg border border-[#E3E8EF] px-4 py-2.5 text-sm font-semibold text-[#5E6C84]">ยกเลิก</button><button type="submit" className="rounded-lg bg-[#1685F8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0866C6]">เพิ่มช่องจอด</button></div></form></div>}
      </div>
    );
  };

  const renderVehicles = () => (
    <div className="space-y-6">
      <PageHeading eyebrow="Vehicle lookup" title="ค้นหาทะเบียนรถ" description="ค้นหารถจากทะเบียน รุ่นรถ หรือรหัสช่องจอดในข้อมูลตัวอย่าง" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><StatCard label="รถในระบบ" value={vehicles.length} icon={CarFront} /><StatCard label="ชำระเงินแล้ว" value={vehicles.filter((car) => car.paid).length} icon={CheckCircle2} tone="green" /><StatCard label="รอชำระเงิน" value={vehicles.filter((car) => !car.paid).length} icon={CreditCard} tone="amber" /></div>
      <SectionCard title="ค้นหารถ" description="พิมพ์ทะเบียนรถ เช่น 1กก9999 โดยไม่ต้องใส่ขีดก็ได้">
        <div className="relative max-w-xl"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A869A]" /><input value={vehicleSearch} onChange={(event) => setVehicleSearch(event.target.value)} placeholder="กรอกทะเบียนรถ เช่น 1กก-9999" className="w-full rounded-lg border border-[#E3E8EF] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1685F8]" /></div>
        <div className="mt-3 flex items-center justify-between gap-3"><p className="text-xs text-[#7A869A]">ค้นหาได้จากทะเบียน รุ่นรถ ชั้นจอด และรหัสช่องจอด</p><span className="shrink-0 text-xs font-semibold text-[#1685F8]">พบ {filteredVehicles.length} รายการ</span></div>
      </SectionCard>
      <SectionCard title="ผลการค้นหา" description="สถานะรถและข้อมูลการจอด">
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[#F5F7FA] text-xs text-[#5E6C84]"><tr><th className="rounded-l-lg px-3 py-3">ทะเบียนรถ</th><th className="px-3 py-3">รุ่นรถ</th><th className="px-3 py-3">ชั้น / ช่องจอด</th><th className="px-3 py-3">เวลาเข้า</th><th className="px-3 py-3">อัตราค่าจอด</th><th className="rounded-r-lg px-3 py-3">การชำระเงิน</th></tr></thead><tbody className="divide-y divide-[#E3E8EF]">{filteredVehicles.map((car) => <tr key={car.id} className="hover:bg-[#F9FBFD]"><td className="px-3 py-3.5 font-semibold text-[#172B4D]">{car.plate}</td><td className="px-3 py-3.5 text-[#5E6C84]">{car.brand}</td><td className="px-3 py-3.5 text-[#5E6C84]">{car.floor} / {car.slotId}</td><td className="px-3 py-3.5 text-[#5E6C84]">{car.entryTime} น.</td><td className="px-3 py-3.5 text-[#5E6C84]">{car.hourlyRate} บาท/ชม.</td><td className="px-3 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${car.paid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{car.paid ? 'ชำระแล้ว' : 'รอชำระเงิน'}</span></td></tr>)}{filteredVehicles.length === 0 && <tr><td colSpan="6" className="py-10 text-center text-sm text-[#7A869A]">ไม่พบทะเบียนรถที่ค้นหา</td></tr>}</tbody></table></div>
      </SectionCard>
      <div className="rounded-xl border border-[#D7E8FC] bg-[#F2F8FF] p-4 text-xs leading-5 text-[#315B86]">หมายเหตุ: หน้านี้ค้นหาจาก Mock Data ปัจจุบัน ข้อมูลรถยังไม่ได้แยก companyId ตามบริษัท จึงเป็นเพียงตัวอย่างการค้นหาในระบบ Frontend</div>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-6">
      <PageHeading eyebrow="Parking revenue" title="รายงานรายรับค่าจอด" description="รายรับจากค่าจอดรถของลานจอด ตามข้อมูลจำลองในระบบ" action={<button onClick={() => exportData('การเงิน')} className="inline-flex items-center gap-2 rounded-lg border border-[#E3E8EF] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#172B4D] hover:bg-[#F5F7FA]"><Download size={16} /> ดาวน์โหลด CSV</button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="รายรับตามข้อมูลตัวอย่าง" value={`${formatNumber(totalRevenue)} บาท`} hint="รวมข้อมูลรายชั่วโมงในกราฟ" icon={CreditCard} />
        <StatCard label="จำนวนรถในข้อมูล" value={`${formatNumber(vehicles.length)} คัน`} hint="รายการรถตัวอย่าง" icon={CarFront} />
        <StatCard label="ชำระเงินแล้ว" value={`${formatNumber(vehicles.filter((car) => car.paid).length)} คัน`} hint="จากรายการรถตัวอย่าง" icon={CheckCircle2} tone="green" />
      </div>
      <SectionCard title="รายรับตามช่วงเวลา" description="หน่วย: บาท">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockHourlyRevenue} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E8EF" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#7A869A', fontSize: 12 }} axisLine={{ stroke: '#E3E8EF' }} tickLine={false} />
              <YAxis tick={{ fill: '#7A869A', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [`${formatNumber(value)} บาท`, 'รายรับ']} contentStyle={{ border: '1px solid #E3E8EF', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" name="รายรับ" fill="#1685F8" radius={[5, 5, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
      <div className="rounded-xl border border-[#D7E8FC] bg-[#F2F8FF] p-4 text-xs leading-5 text-[#315B86]">รายงานนี้เป็นรายรับค่าจอดที่ผู้ขับขี่ชำระให้บริษัทผู้ให้บริการลานจอด ไม่ใช่รายได้ค่าเช่าแพลตฟอร์มที่บริษัทชำระให้เจ้าของระบบ</div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <PageHeading eyebrow="Usage analytics" title="การใช้งานและ Heatmap" description="ดูความหนาแน่นของช่องจอดและสถิติรุ่นรถจากข้อมูลจำลอง" action={<button onClick={() => exportData('กิจกรรม')} className="inline-flex items-center gap-2 rounded-lg border border-[#E3E8EF] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#172B4D] hover:bg-[#F5F7FA]"><Download size={16} /> ดาวน์โหลด CSV</button>} />
      <SectionCard title="ความหนาแน่นของช่องจอด" description="เปอร์เซ็นต์เป็นค่าความถี่การใช้งานจำลอง ไม่ใช่สถานะว่าง/ไม่ว่างแบบเรียลไทม์">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {mockSlotHeatmap.map((item) => {
            const barColor = item.density >= 80 ? 'bg-rose-500' : item.density >= 50 ? 'bg-amber-500' : 'bg-[#1685F8]';
            return (
              <div key={item.slot} className="rounded-lg border border-[#E3E8EF] p-3.5">
                <div className="flex items-center justify-between gap-2"><span className="font-mono text-sm font-bold text-[#172B4D]">{item.slot}</span><span className="text-sm font-semibold text-[#5E6C84]">{item.density}%</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F5F7FA]"><div className={`h-full rounded-full ${barColor}`} style={{ width: `${item.density}%` }} /></div>
                <p className="mt-2 text-xs text-[#7A869A]">ความหนาแน่น: {item.label}</p>
              </div>
            );
          })}
        </div>
      </SectionCard>
      <SectionCard title="รุ่นรถและระยะเวลาจอดเฉลี่ย" description="สถิติรถยนต์ที่เข้ามาใช้บริการจากข้อมูลจำลอง">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-xs text-[#7A869A]"><tr className="border-b border-[#E3E8EF]"><th className="pb-3 font-medium">รุ่นรถยนต์</th><th className="pb-3 font-medium">จำนวนรถ</th><th className="pb-3 font-medium">จอดเฉลี่ย</th></tr></thead>
            <tbody className="divide-y divide-[#E3E8EF]">{mockCarBrands.map((car) => <tr key={car.brand}><td className="py-3.5 font-semibold text-[#172B4D]">{car.brand}</td><td className="py-3.5 text-[#5E6C84]">{car.count} คัน</td><td className="py-3.5 text-[#5E6C84]">{car.avgHours} ชั่วโมง</td></tr>)}</tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );

  const renderRoles = () => (
    <div className="space-y-6">
      <PageHeading eyebrow="Access control" title="ผู้ใช้งานและสิทธิ์" description="กำหนดเมนูที่ Company Admin และ Staff สามารถเข้าถึงได้" />
      <SectionCard title="กำหนดสิทธิ์ตามบทบาท" description="การเปลี่ยนแปลงจะบันทึกไว้ใน Local Storage ของเครื่องนี้">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:max-w-md">
          {[{ key: 'admin', label: 'Company Admin' }, { key: 'staff', label: 'Staff' }].map((role) => (
            <button key={role.key} onClick={() => setSelectedRole(role.key)} className={`rounded-lg border px-4 py-3 text-sm font-semibold ${selectedRole === role.key ? 'border-[#1685F8] bg-[#F2F8FF] text-[#1685F8]' : 'border-[#E3E8EF] text-[#5E6C84] hover:bg-[#F5F7FA]'}`}>{role.label}</button>
          ))}
        </div>
        <div className="space-y-2">
          {PERMISSION_OPTIONS.map((permission) => (
            <label key={permission.key} className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-[#E3E8EF] px-4 py-3 text-sm hover:bg-[#F9FBFD]">
              <span className="text-[#172B4D]">{permission.label}</span>
              <input type="checkbox" checked={(rolePermissions[selectedRole] || []).includes(permission.key)} onChange={() => toggleRolePermission(selectedRole, permission.key)} className="h-4 w-4 accent-[#1685F8]" />
            </label>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  let pageContent;
  if (activeMenu === 'overview' && canAccessMenu('overview')) pageContent = renderOverview();
  else if (activeMenu === 'companies' && canAccessMenu('companies')) pageContent = renderCompanies();
  else if (activeMenu === 'map' && canAccessMenu('map')) pageContent = renderMap();
  else if (activeMenu === 'vehicles' && canAccessMenu('vehicles')) pageContent = renderVehicles();
  else if (activeMenu === 'finance' && canAccessMenu('finance')) pageContent = renderFinance();
  else if (activeMenu === 'activity' && canAccessMenu('activity')) pageContent = renderActivity();
  else if (activeMenu === 'roles' && canAccessMenu('roles')) pageContent = renderRoles();
  else pageContent = <div className="rounded-xl border border-[#E3E8EF] bg-white p-6"><h2 className="font-semibold text-[#172B4D]">ยังไม่มีสิทธิ์เข้าถึงเมนูนี้</h2><p className="mt-1 text-sm text-[#5E6C84]">กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์เพิ่มเติม</p></div>;

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-[#F5F7FA] text-[#172B4D]">
      {mobileNavOpen && <button aria-label="ปิดเมนู" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-[#E3E8EF] bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-[#E3E8EF] px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1685F8] text-white"><CarFront size={20} /></div>
            <div><p className="text-sm font-bold text-[#172B4D]">Smart Parking</p><p className="text-[10px] text-[#7A869A]">Management System</p></div>
          </div>
          <button onClick={() => setMobileNavOpen(false)} className="rounded-md p-1 text-[#7A869A] hover:bg-[#F5F7FA] lg:hidden" aria-label="ปิดเมนู"><X size={18} /></button>
        </div>
        <div className="border-b border-[#E3E8EF] px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A869A]">บัญชีที่เข้าสู่ระบบ</p>
          <p className="mt-1 truncate text-sm font-semibold text-[#172B4D]">{currentUser?.name || 'ผู้ดูแลระบบ'}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F2F8FF] px-2.5 py-1 text-[10px] font-semibold text-[#1685F8]"><ShieldCheck size={12} /> {roleLabel}</div>
          {isCompanyAdmin && <p className="mt-2 truncate text-xs text-[#7A869A]">{company.name}</p>}
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {['หน้าหลัก', 'แพลตฟอร์ม', 'การจัดการลานจอด', 'รายงาน', 'ตั้งค่าระบบ'].map((section) => {
            const items = navItems.filter((item) => item.section === section);
            if (!items.length) return null;
            return <div key={section} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#A0AAB8]">{section}</p>
              <div className="space-y-1">{items.map((item) => {
                const Icon = item.icon;
                const active = activeMenu === item.id;
                return <button key={item.id} onClick={() => selectMenu(item.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${active ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84] hover:bg-[#F5F7FA] hover:text-[#172B4D]'}`}><Icon size={17} /><span>{item.label}</span></button>;
              })}</div>
            </div>;
          })}
        </nav>
        <div className="border-t border-[#E3E8EF] p-3">
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"><LogOut size={17} /> ออกจากระบบ</button>
          <p className="px-3 pt-2 text-[10px] text-[#A0AAB8]">Smart Parking · Demo Version</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E3E8EF] bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)} className="rounded-lg border border-[#E3E8EF] p-2 text-[#5E6C84] hover:bg-[#F5F7FA] lg:hidden" aria-label="เปิดเมนู"><Menu size={18} /></button>
            <div><p className="text-sm font-semibold text-[#172B4D]">{isSuperAdmin ? 'Platform Administration' : company.name}</p><p className="text-[11px] text-[#7A869A]">ระบบจัดการลานจอดรถอัจฉริยะ</p></div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#E3E8EF] bg-white px-3 py-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-xs font-medium text-[#5E6C84]">ระบบตัวอย่าง</span></div>
        </header>
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1440px]">{pageContent}</div>
        </main>
        <footer className="border-t border-[#E3E8EF] bg-white px-6 py-3 text-center text-[11px] text-[#A0AAB8]">© 2026 Smart Parking Management Platform</footer>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === 'active';
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}><span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />{active ? 'ใช้งานอยู่' : 'ระงับการใช้งาน'}</span>;
}

function DetailItem({ label, value }) {
  return <div className="rounded-lg bg-[#F5F7FA] p-3"><p className="text-xs text-[#7A869A]">{label}</p><p className="mt-1 text-sm font-semibold text-[#172B4D]">{value}</p></div>;
}
