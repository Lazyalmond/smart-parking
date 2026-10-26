export const mockUsers = [
  {
    id: 'u-1',
    username: 'superadmin',
    password: 'password123',
    name: 'สิรภพ (ผู้ดูแลระบบสูงสุด)',
    role: 'superadmin', // เข้าได้ทุกเมนู รวมถึงจัดการสิทธิ์
    permissions: ['live_map', 'finance', 'activity', 'manage_roles']
  },
  {
    id: 'u-2',
    username: 'admin',
    password: 'password123',
    name: 'สมชาย (เจ้าหน้าที่)',
    role: 'admin', // เมนูทั่วไป เข้าหน้าจัดการสิทธิ์ไม่ได้
    permissions: ['live_map', 'activity']
  }
];