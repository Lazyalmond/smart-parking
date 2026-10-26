// src/pages/admin/AdminPortal.jsx
import React, { useState } from 'react';
import AdminLogin from './adminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPortal({ vehicles, slots, setSlots }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smart_parking_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('smart_parking_admin');
    setCurrentUser(null);
  };

  // 1. ถ้ายังไม่ล็อกอิน -> แสดงหน้าฟอร์ม Login
  if (!currentUser) {
    return <AdminLogin onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // 2. ถ้าล็อกอินแล้ว -> แสดงหน้า Dashboard พร้อมส่งข้อมูล user และ props ต่างๆ ไปทำงานต่อ
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