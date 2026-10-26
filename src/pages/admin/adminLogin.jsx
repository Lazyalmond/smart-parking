// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { Lock, User, ShieldAlert } from 'lucide-react';
import { mockUsers } from "../../data/mockData";

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // ตรวจสอบกับ Mock Data
    const foundUser = mockUsers.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (foundUser) {
      // บันทึกสถานะลง localStorage เพื่อไม่ให้รีเฟรชแล้วหลุด
      localStorage.setItem('smart_parking_admin', JSON.stringify(foundUser));
      onLoginSuccess(foundUser);
    } else {
      setErrorMsg('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">เข้าสู่ระบบ Admin Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Smart Parking Management System</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="superadmin หรือ admin"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl transition text-xs shadow-lg shadow-emerald-950"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center space-y-1">
          <p>บัญชีทดสอบ:</p>
          <p>Super Admin: <span className="text-slate-300 font-mono">superadmin / password123</span></p>
          <p>Admin ทั่วไป: <span className="text-slate-300 font-mono">admin / password123</span></p>
        </div>
      </div>
    </div>
  );
}