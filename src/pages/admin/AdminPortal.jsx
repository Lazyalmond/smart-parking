// src/pages/admin/AdminPortal.jsx
import React, { useState } from 'react';
import AdminLogin from './adminLogin';
import AdminDashboard from './AdminDashboard';
import { mockUsers } from '../../data/mockData';

function getSavedUser() {
  try {
    const saved = localStorage.getItem('smart_parking_admin');
    if (!saved) return null;

    const parsedUser = JSON.parse(saved);
    // อ่านบัญชีจาก Mock Data ล่าสุด เพื่อให้ role และ companyId ที่แก้ไขใหม่เป็นปัจจุบัน
    return mockUsers.find((user) => user.username === parsedUser.username) || null;
  } catch {
    localStorage.removeItem('smart_parking_admin');
    return null;
  }
}

export default function AdminPortal({ vehicles, slots, setSlots }) {
  const [currentUser, setCurrentUser] = useState(getSavedUser);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('smart_parking_admin');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={handleLogin} />;
  }

  return (
    <AdminDashboard
      currentUser={currentUser}
      onLogout={handleLogout}
      vehicles={vehicles}
      slots={slots}
      setSlots={setSlots}
    />
  );
}
