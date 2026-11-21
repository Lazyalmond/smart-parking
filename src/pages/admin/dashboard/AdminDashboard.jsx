import React, { useMemo, useState } from 'react';
import AdminOverviewPage from './pages/AdminOverviewPage.jsx';
import AdminCompaniesPage from './pages/AdminCompaniesPage.jsx';
import AdminParkingMapPage from './pages/AdminParkingMapPage.jsx';
import AdminVehiclesPage from './pages/AdminVehiclesPage.jsx';
import AdminFinancePage from './pages/AdminFinancePage.jsx';
import AdminActivityPage from './pages/AdminActivityPage.jsx';
import AdminPermissionsPage from './pages/AdminPermissionsPage.jsx';
import {
  Activity,
  Building2,
  CarFront,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import {
  mockSlots,
  mockHourlyRevenue,
  mockCarBrands,
  mockCars,
  mockCompanies,
  mockUsers,
} from '../../../data/mockData';

const DEFAULT_ROLE_PERMISSIONS = {
  admin: ['live_map', 'activity'],
  staff: ['live_map'],
};

const PERMISSION_OPTIONS = [
  { key: 'live_map', label: 'ผังแสดงสถานะช่องจอด' },
  { key: 'finance', label: 'รายงานรายรับค่าจอด' },
  { key: 'activity', label: 'รายงานการใช้งานและความหนาแน่น' },
];

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
  const [userAccounts, setUserAccounts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('smart_parking_users') || 'null');
      return Array.isArray(saved) ? saved : mockUsers;
    } catch {
      return mockUsers;
    }
  });
  const [userPermissionOverrides, setUserPermissionOverrides] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('smart_parking_user_permissions') || '{}');
    } catch {
      return {};
    }
  });
  const [editingPermissionUserId, setEditingPermissionUserId] = useState(null);
  const [userPermissionDraft, setUserPermissionDraft] = useState([]);
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', username: '', password: '', role: 'admin', companyId: '' });
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopNavCollapsed, setDesktopNavCollapsed] = useState(false);
  const [companies, setCompanies] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('smart_parking_companies') || 'null');
      return Array.isArray(saved) ? saved : mockCompanies;
    } catch {
      return mockCompanies;
    }
  });
  const [localSlots, setLocalSlots] = useState(mockSlots);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [companyForm, setCompanyForm] = useState({ name: '', code: '', branchCount: 1, parkingLotCount: 1, hourlyRate: 30, paidExitGracePeriodMinutes: 15, overstayHourlyRate: 50 });
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehiclePage, setVehiclePage] = useState(1);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [slotForm, setSlotForm] = useState({ floor: 'FL1', count: 4, isEV: false });

  const userRole = currentUser?.role || 'superadmin';
  const isSuperAdmin = userRole === 'superadmin';
  const isCompanyAdmin = userRole === 'admin';
  const canManageParkingSlots = isSuperAdmin || isCompanyAdmin;
  const canAccessRoles = isSuperAdmin;
  const roleLabel = isSuperAdmin
    ? 'Super Admin'
    : isCompanyAdmin ? 'Company Admin' : 'Staff';
  const company = companies.find((item) => item.id === currentUser?.companyId) || companies[0] || { name: 'ไม่พบข้อมูลอาคาร', status: 'inactive', branchCount: 0, parkingLotCount: 0 };
  const slots = Array.isArray(slotsProp) ? slotsProp : localSlots;
  const vehicles = Array.isArray(vehiclesProp) ? vehiclesProp : mockCars;

  const effectivePermissions = isSuperAdmin
    ? ['live_map', 'finance', 'activity', 'manage_roles']
    : userPermissionOverrides[currentUser?.id] || rolePermissions[userRole] || currentUser?.permissions || [];

  const firstAllowedMenu = isSuperAdmin || isCompanyAdmin
    ? 'overview'
    : effectivePermissions.includes('live_map')
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
    ...(isSuperAdmin ? [{ id: 'companies', label: 'จัดการอาคาร', icon: Building2, section: 'แพลตฟอร์ม' }] : []),
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
  const normalizedVehicleSearch = vehicleSearch.trim().toLocaleLowerCase('th-TH').replace(/[\s-]/g, '');
  const isPlateSearch = /[\d\u0E00-\u0E7F]/u.test(normalizedVehicleSearch);
  const hasInvalidPlateCharacters = /[a-z]/i.test(normalizedVehicleSearch);
  const filteredVehicles = vehicles.filter((car) => {
    if (!normalizedVehicleSearch) return true;
    if (hasInvalidPlateCharacters) return false;
    const normalizedPlate = String(car.plate || '').toLocaleLowerCase('th-TH').replace(/[\s-]/g, '');
    if (isPlateSearch) return normalizedPlate.startsWith(normalizedVehicleSearch);
    return [car.province, car.brand, car.slotId, car.floor].some((value) => String(value || '').toLocaleLowerCase('th-TH').replace(/[\s-]/g, '').includes(normalizedVehicleSearch));
  });
  const vehiclePageSize = 10;
  const vehiclePageCount = Math.max(1, Math.ceil(filteredVehicles.length / vehiclePageSize));
  const visibleVehicles = filteredVehicles.slice((vehiclePage - 1) * vehiclePageSize, vehiclePage * vehiclePageSize);
  const manageableUsers = userAccounts.filter((user) => user.role !== 'superadmin');
  const editingPermissionUser = manageableUsers.find((user) => user.id === editingPermissionUserId);

  const toggleRolePermission = (role, permission) => {
    const currentPermissions = rolePermissions[role] || [];
    const nextPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((item) => item !== permission)
      : [...currentPermissions, permission];
    const updated = { ...rolePermissions, [role]: nextPermissions };
    localStorage.setItem('smart_parking_role_permissions', JSON.stringify(updated));
    setRolePermissions(updated);
  };

  const openUserPermissionEditor = (user) => {
    const permissions = userPermissionOverrides[user.id] || rolePermissions[user.role] || user.permissions || [];
    setUserPermissionDraft([...permissions]);
    setEditingPermissionUserId(user.id);
  };

  const saveUserPermissions = () => {
    if (!editingPermissionUser) return;
    const updated = { ...userPermissionOverrides, [editingPermissionUser.id]: userPermissionDraft };
    localStorage.setItem('smart_parking_user_permissions', JSON.stringify(updated));
    setUserPermissionOverrides(updated);
    setEditingPermissionUserId(null);
  };

  const deleteManagedUser = (user) => {
    const roleLabel = user.role === 'admin' ? 'ผู้ดูแล' : 'เจ้าหน้าที่ลานจอด';
    if (!window.confirm(`ต้องการลบ${roleLabel} ${user.name} ใช่หรือไม่?`)) return;
    const nextUsers = userAccounts.filter((item) => item.id !== user.id);
    const nextOverrides = { ...userPermissionOverrides };
    delete nextOverrides[user.id];
    localStorage.setItem('smart_parking_users', JSON.stringify(nextUsers));
    localStorage.setItem('smart_parking_user_permissions', JSON.stringify(nextOverrides));
    setUserAccounts(nextUsers);
    setUserPermissionOverrides(nextOverrides);
    setEditingPermissionUserId(null);
  };

  const handleAddAdmin = (event) => {
    event.preventDefault();
    const username = adminForm.username.trim();
    if (!adminForm.name.trim() || !username || !adminForm.password) return;
    if (userAccounts.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      alert('ชื่อผู้ใช้นี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น');
      return;
    }
    const newAdmin = {
      id: `user-${Date.now()}`,
      username,
      password: adminForm.password,
      name: adminForm.name.trim(),
      role: adminForm.role,
      companyId: adminForm.companyId || companies[0]?.id || null,
      permissions: [...(rolePermissions[adminForm.role] || DEFAULT_ROLE_PERMISSIONS[adminForm.role])],
    };
    const updated = [...userAccounts, newAdmin];
    localStorage.setItem('smart_parking_users', JSON.stringify(updated));
    setUserAccounts(updated);
    setAdminForm({ name: '', username: '', password: '', role: 'admin', companyId: '' });
    setAddAdminModalOpen(false);
  };

  const exportData = (type) => {
    let rows = [];
    if (type === 'อาคาร') {
      rows = [
        ['อาคาร', 'รหัสอาคาร', 'สถานะ', 'จำนวนสาขา', 'จำนวนลานจอด'],
        ...companies.map((item) => [item.name, item.code, item.status, item.branchCount, item.parkingLotCount]),
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

  const deleteCompany = (item) => {
    if (!window.confirm(`ต้องการลบอาคาร ${item.name} ใช่หรือไม่?`)) return;
    persistCompanies(companies.filter((companyItem) => companyItem.id !== item.id));
    if (selectedCompanyId === item.id) setSelectedCompanyId(null);
  };

  const openCreateCompany = () => {
    setEditingCompanyId(null);
    setCompanyForm({ name: '', code: '', branchCount: 1, parkingLotCount: 1, hourlyRate: 30, paidExitGracePeriodMinutes: 15, overstayHourlyRate: 50 });
    setCompanyModalOpen(true);
  };

  const openEditCompany = (item) => {
    setEditingCompanyId(item.id);
    setCompanyForm({
      name: item.name || '',
      code: item.code || '',
      branchCount: item.branchCount || 1,
      parkingLotCount: item.parkingLotCount || 1,
      hourlyRate: item.hourlyRate ?? 30,
      paidExitGracePeriodMinutes: item.paidExitGracePeriodMinutes ?? 15,
      overstayHourlyRate: item.overstayHourlyRate ?? 50,
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
      alert('รหัสอาคารนี้มีอยู่แล้ว กรุณาใช้รหัสอื่น');
      return;
    }

    const companyData = {
      id: editingCompanyId || `company-${Date.now()}`,
      name,
      code,
      status: editingCompanyId ? (companies.find((item) => item.id === editingCompanyId)?.status || 'active') : 'active',
      branchCount: Math.max(0, Number(companyForm.branchCount) || 0),
      parkingLotCount: Math.max(0, Number(companyForm.parkingLotCount) || 0),
      hourlyRate: Math.max(0, Number(companyForm.hourlyRate) || 0),
      paidExitGracePeriodMinutes: Math.max(0, Number(companyForm.paidExitGracePeriodMinutes) || 0),
      overstayHourlyRate: Math.max(0, Number(companyForm.overstayHourlyRate) || 0),
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
    if (!canManageParkingSlots) return;
    const count = Math.min(100, Math.max(1, Number(slotForm.count) || 1));
    const floor = slotForm.floor;
    const prefix = floor === 'FL1' ? 'A' : floor === 'FL2' ? 'B' : `F${floor.replace(/\D/g, '') || 'X'}`;
    const nextSlots = [...slots];
    let serial = 1;
    let added = 0;

    while (added < count) {
      const id = `${prefix}-${String(serial).padStart(2, '0')}`;
      serial += 1;
      if (nextSlots.some((item) => item.id === id)) continue;
      nextSlots.push({ id, floor, occupied: false, isEV: Boolean(slotForm.isEV) });
      added += 1;
    }

    setLocalSlots(nextSlots);
    if (typeof setSlotsProp === 'function') setSlotsProp(nextSlots);
    setSelectedFloor(floor);
    setSlotModalOpen(false);
    setSlotForm((previous) => ({ ...previous, count: 4 }));
  };

  const handleDeleteParkingSlot = (slotId) => {
    if (!canManageParkingSlots) return;
    const nextSlots = slots.filter((slot) => slot.id !== slotId);
    setLocalSlots(nextSlots);
    if (typeof setSlotsProp === 'function') setSlotsProp(nextSlots);
  };

  const handleToggleParkingSlotEV = (slotId) => {
    if (!canManageParkingSlots) return;
    const nextSlots = slots.map((slot) => slot.id === slotId ? { ...slot, isEV: !slot.isEV } : slot);
    setLocalSlots(nextSlots);
    if (typeof setSlotsProp === 'function') setSlotsProp(nextSlots);
  };

  const pageProps = { isSuperAdmin, canManageParkingSlots, company, companyStats, companies, selectMenu, occupiedSlots, freeSlots, slots, exportData, openCreateCompany, companySearch, setCompanySearch, filteredCompanies, selectedCompanyId, setSelectedCompanyId, openEditCompany, deleteCompany, selectedCompany, companyModalOpen, handleCompanySubmit, editingCompanyId, companyForm, setCompanyForm, setCompanyModalOpen, selectedFloor, setSelectedFloor, slotForm, setSlotForm, slotFilter, setSlotFilter, slotModalOpen, setSlotModalOpen, handleAddParkingSlots, handleDeleteParkingSlot, handleToggleParkingSlotEV, vehicles, vehicleSearch, setVehicleSearch, filteredVehicles, visibleVehicles, vehiclePage, setVehiclePage, vehiclePageSize, vehiclePageCount, totalRevenue, PERMISSION_OPTIONS, setAddAdminModalOpen, selectedRole, setSelectedRole, rolePermissions, toggleRolePermission, manageableUsers, userPermissionOverrides, openUserPermissionEditor, editingPermissionUser, userPermissionDraft, setUserPermissionDraft, deleteManagedUser, saveUserPermissions, addAdminModalOpen, handleAddAdmin, adminForm, setAdminForm, setEditingPermissionUserId };

  let pageContent;
  if (activeMenu === 'overview' && canAccessMenu('overview')) pageContent = <AdminOverviewPage {...pageProps} />;
  else if (activeMenu === 'companies' && canAccessMenu('companies')) pageContent = <AdminCompaniesPage {...pageProps} />;
  else if (activeMenu === 'map' && canAccessMenu('map')) pageContent = <AdminParkingMapPage {...pageProps} />;
  else if (activeMenu === 'vehicles' && canAccessMenu('vehicles')) pageContent = <AdminVehiclesPage {...pageProps} />;
  else if (activeMenu === 'finance' && canAccessMenu('finance')) pageContent = <AdminFinancePage {...pageProps} />;
  else if (activeMenu === 'activity' && canAccessMenu('activity')) pageContent = <AdminActivityPage {...pageProps} />;
  else if (activeMenu === 'roles' && canAccessMenu('roles')) pageContent = <AdminPermissionsPage {...pageProps} />;
  else pageContent = <div className="rounded-xl border border-[#E3E8EF] bg-white p-6"><h2 className="font-semibold text-[#172B4D]">ยังไม่มีสิทธิ์เข้าถึงเมนูนี้</h2><p className="mt-1 text-sm text-[#5E6C84]">กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์เพิ่มเติม</p></div>;

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-[#F5F7FA] text-[#172B4D]">
      {mobileNavOpen && <button aria-label="ปิดเมนู" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-[#E3E8EF] bg-white transition-all duration-200 lg:inset-y-auto lg:top-[60px] lg:bottom-auto lg:h-[calc(100vh-60px)] lg:translate-x-0 ${desktopNavCollapsed ? 'lg:w-20' : 'lg:w-64'} ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`flex h-16 items-center border-b border-[#E3E8EF] px-5 ${desktopNavCollapsed ? 'justify-center lg:px-3' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1685F8] text-white"><CarFront size={20} /></div>
            <div className={desktopNavCollapsed ? 'lg:hidden' : ''}><p className="text-sm font-bold text-[#172B4D]">Smart Parking</p><p className="text-[10px] text-[#7A869A]">Management System</p></div>
          </div>
          <button onClick={() => setDesktopNavCollapsed((collapsed) => !collapsed)} className="hidden rounded-md p-1 text-[#7A869A] hover:bg-[#F5F7FA] lg:block" aria-label={desktopNavCollapsed ? 'แสดงเมนู' : 'ซ่อนเมนู'} title={desktopNavCollapsed ? 'แสดงเมนู' : 'ซ่อนเมนู'}>{desktopNavCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button>
          <button onClick={() => setMobileNavOpen(false)} className="rounded-md p-1 text-[#7A869A] hover:bg-[#F5F7FA] lg:hidden" aria-label="ปิดเมนู"><X size={18} /></button>
        </div>
        <div className={`border-b border-[#E3E8EF] px-5 py-4 ${desktopNavCollapsed ? 'lg:hidden' : ''}`}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A869A]">บัญชีที่เข้าสู่ระบบ</p>
          <p className="mt-1 truncate text-sm font-semibold text-[#172B4D]">{currentUser?.name || 'ผู้ดูแลระบบ'}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F2F8FF] px-2.5 py-1 text-[10px] font-semibold text-[#1685F8]"><ShieldCheck size={12} /> {roleLabel}</div>
          {isCompanyAdmin && <p className="mt-2 truncate text-xs text-[#7A869A]">{company.name}</p>}
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          {['หน้าหลัก', 'แพลตฟอร์ม', 'การจัดการลานจอด', 'รายงาน', 'ตั้งค่าระบบ'].map((section) => {
            const items = navItems.filter((item) => item.section === section);
            if (!items.length) return null;
            return <div key={section} className="mb-5">
              <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#A0AAB8] ${desktopNavCollapsed ? 'lg:hidden' : ''}`}>{section}</p>
              <div className="space-y-1">{items.map((item) => {
                const Icon = item.icon;
                const active = activeMenu === item.id;
                return <button key={item.id} onClick={() => selectMenu(item.id)} title={desktopNavCollapsed ? item.label : undefined} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${desktopNavCollapsed ? 'lg:justify-center' : ''} ${active ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84] hover:bg-[#F5F7FA] hover:text-[#172B4D]'}`}><Icon size={17} /><span className={desktopNavCollapsed ? 'lg:hidden' : ''}>{item.label}</span></button>;
              })}</div>
            </div>;
          })}
        </nav>
        <div className="border-t border-[#E3E8EF] p-3">
          <button onClick={onLogout} title={desktopNavCollapsed ? 'ออกจากระบบ' : undefined} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 ${desktopNavCollapsed ? 'lg:justify-center' : ''}`}><LogOut size={17} /><span className={desktopNavCollapsed ? 'lg:hidden' : ''}>ออกจากระบบ</span></button>
          <p className="px-3 pt-2 text-[10px] text-[#A0AAB8]">Smart Parking · Demo Version</p>
        </div>
      </aside>

      <div className={`flex min-w-0 flex-1 flex-col ${desktopNavCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
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
