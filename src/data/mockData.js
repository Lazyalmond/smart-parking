// src/data/mockData.js
export const mockCars = [
  {
    id: "car-1",
    plate: "1กก-9999",
    brand: "Honda Civic FE",
    entryTime: "10:15",
    entryTimestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
    floor: "ชั้น 2",
    slotId: "B-04",
    hourlyRate: 30,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1590362891988-f77804702e30?w=600&auto=format&fit=crop",
  },
  {
    id: "car-2",
    plate: "2ขข-1234",
    brand: "Toyota Camry",
    entryTime: "08:30",
    entryTimestamp: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
    floor: "ชั้น 1",
    slotId: "A-12",
    hourlyRate: 30,
    paid: true,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop",
  },
  {
    id: "car-9",
    plate: "3ขพ-8821",
    brand: "Honda CR-V e:HEV",
    entryTime: "08:10",
    entryTimestamp: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
    floor: "ชั้น 2",
    slotId: "B-09",
    hourlyRate: 30,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&auto=format&fit=crop",
  },
  {
    id: "car-10",
    plate: "8กฮ-4321",
    brand: "Toyota Corolla Cross",
    entryTime: "09:40",
    entryTimestamp: new Date(Date.now() - 3.0 * 3600 * 1000).toISOString(),
    floor: "ชั้น 1",
    slotId: "A-22",
    hourlyRate: 30,
    paid: true,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop",
  },
  {
    id: "car-11",
    plate: "1ขบ-6712",
    brand: "Porsche Macan",
    entryTime: "07:15",
    entryTimestamp: new Date(Date.now() - 5.5 * 3600 * 1000).toISOString(),
    floor: "ชั้น 4",
    slotId: "VIP-02",
    hourlyRate: 80,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop",
  },
  {
    id: "car-12",
    plate: "5ขม-9087",
    brand: "Nissan Kicks e-POWER",
    entryTime: "11:20",
    entryTimestamp: new Date(Date.now() - 1.3 * 3600 * 1000).toISOString(),
    floor: "ชั้น 2",
    slotId: "B-15",
    hourlyRate: 30,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop",
  },
  {
    id: "car-13",
    plate: "4กศ-2345",
    brand: "MG4 Electric",
    entryTime: "10:50",
    entryTimestamp: new Date(Date.now() - 1.8 * 3600 * 1000).toISOString(),
    floor: "ชั้น B1",
    slotId: "EV-05",
    hourlyRate: 40,
    paid: true,
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop",
  },
  {
    id: "car-14",
    plate: "2ขจ-1199",
    brand: "Audi A5 Sportback",
    entryTime: "08:55",
    entryTimestamp: new Date(Date.now() - 3.7 * 3600 * 1000).toISOString(),
    floor: "ชั้น 3",
    slotId: "C-08",
    hourlyRate: 50,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&auto=format&fit=crop",
  },
  {
    id: "car-15",
    plate: "9กบ-6543",
    brand: "Toyota Fortuner Legender",
    entryTime: "06:40",
    entryTimestamp: new Date(Date.now() - 6.0 * 3600 * 1000).toISOString(),
    floor: "ชั้น 1",
    slotId: "A-02",
    hourlyRate: 30,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop",
  },
  {
    id: "car-16",
    plate: "6ขล-7734",
    brand: "Volvo XC60 Recharge",
    entryTime: "09:05",
    entryTimestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    floor: "ชั้น B1",
    slotId: "EV-12",
    hourlyRate: 40,
    paid: true,
    image:
      "https://images.unsplash.com/photo-1541348263662-e0c86437da10?w=600&auto=format&fit=crop",
  },
  {
    id: "car-17",
    plate: "3กว-3210",
    brand: "Isuzu D-Max Stealth",
    entryTime: "05:50",
    entryTimestamp: new Date(Date.now() - 6.8 * 3600 * 1000).toISOString(),
    floor: "ชั้น 1",
    slotId: "A-18",
    hourlyRate: 30,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&auto=format&fit=crop",
  },
  {
    id: "car-18",
    plate: "7ขต-5544",
    brand: "Hyundai IONIQ 5",
    entryTime: "11:05",
    entryTimestamp: new Date(Date.now() - 1.6 * 3600 * 1000).toISOString(),
    floor: "ชั้น B1",
    slotId: "EV-01",
    hourlyRate: 40,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop",
  },
  {
    id: "car-19",
    plate: "8ขช-2891",
    brand: "Subaru Forester",
    entryTime: "10:00",
    entryTimestamp: new Date(Date.now() - 2.6 * 3600 * 1000).toISOString(),
    floor: "ชั้น 2",
    slotId: "B-21",
    hourlyRate: 30,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop",
  },
  {
    id: "car-20",
    plate: "1ฌง-4509",
    brand: "Lexus NX 350h",
    entryTime: "08:15",
    entryTimestamp: new Date(Date.now() - 4.4 * 3600 * 1000).toISOString(),
    floor: "ชั้น 3",
    slotId: "C-05",
    hourlyRate: 50,
    paid: true,
    image:
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop",
  },
  {
    id: "car-21",
    plate: "4ขฉ-9812",
    brand: "Honda City Hatchback",
    entryTime: "12:00",
    entryTimestamp: new Date(Date.now() - 0.6 * 3600 * 1000).toISOString(),
    floor: "ชั้น 2",
    slotId: "B-03",
    hourlyRate: 30,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1590362891988-f77804702e30?w=600&auto=format&fit=crop",
  },
  {
    id: "car-22",
    plate: "2กด-8877",
    brand: "Toyota Yaris Ativ",
    entryTime: "09:10",
    entryTimestamp: new Date(Date.now() - 3.4 * 3600 * 1000).toISOString(),
    floor: "ชั้น 1",
    slotId: "A-07",
    hourlyRate: 30,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop",
  },
  {
    id: "car-23",
    plate: "5ฮภ-6006",
    brand: "Porsche Taycan 4S",
    entryTime: "07:30",
    entryTimestamp: new Date(Date.now() - 5.1 * 3600 * 1000).toISOString(),
    floor: "ชั้น 4",
    slotId: "VIP-01",
    hourlyRate: 80,
    paid: true,
    image:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&auto=format&fit=crop",
  },
  {
    id: "car-24",
    plate: "9ขร-1478",
    brand: "GWM Ora Good Cat",
    entryTime: "11:35",
    entryTimestamp: new Date(Date.now() - 1.1 * 3600 * 1000).toISOString(),
    floor: "ชั้น B1",
    slotId: "EV-06",
    hourlyRate: 40,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop",
  },
  {
    id: "car-25",
    plate: "6ขด-3369",
    brand: "MINI Cooper S Countryman",
    entryTime: "10:30",
    entryTimestamp: new Date(Date.now() - 2.1 * 3600 * 1000).toISOString(),
    floor: "ชั้น 3",
    slotId: "C-12",
    hourlyRate: 50,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop",
  },
  {
    id: "car-26",
    plate: "7กต-4400",
    brand: "Mazda CX-30",
    entryTime: "08:40",
    entryTimestamp: new Date(Date.now() - 3.9 * 3600 * 1000).toISOString(),
    floor: "ชั้น 2",
    slotId: "B-12",
    hourlyRate: 30,
    paid: true,
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop",
  },
  {
    id: "car-27",
    plate: "1ขบ-9988",
    brand: "Tesla Model 3 Highland",
    entryTime: "12:15",
    entryTimestamp: new Date(Date.now() - 0.4 * 3600 * 1000).toISOString(),
    floor: "ชั้น B1",
    slotId: "EV-09",
    hourlyRate: 40,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop",
  },
  {
    id: "car-28",
    plate: "8ขพ-1902",
    brand: "Mercedes-Benz E300e",
    entryTime: "06:30",
    entryTimestamp: new Date(Date.now() - 6.1 * 3600 * 1000).toISOString(),
    floor: "ชั้น 3",
    slotId: "C-03",
    hourlyRate: 50,
    paid: false,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop",
  },
];

export const mockSlots = [
  { id: "A-01", floor: "FL1", occupied: true, isEV: false },
  { id: "A-02", floor: "FL1", occupied: false, isEV: true },
  { id: "A-03", floor: "FL1", occupied: true, isEV: false },
  { id: "A-04", floor: "FL1", occupied: false, isEV: false },
  { id: "B-01", floor: "FL2", occupied: true, isEV: false },
  { id: "B-02", floor: "FL2", occupied: false, isEV: false },
  { id: "B-03", floor: "FL2", occupied: true, isEV: true },
  { id: "B-04", floor: "FL2", occupied: true, isEV: false },
];

// เพิ่มต่อท้ายใน src/data/mockData.js

export const mockHourlyRevenue = [
  { time: "08:00", revenue: 1200 },
  { time: "10:00", revenue: 3400 },
  { time: "12:00", revenue: 5800 }, // Peak
  { time: "14:00", revenue: 4200 },
  { time: "16:00", revenue: 3100 },
  { time: "18:00", revenue: 4900 },
  { time: "20:00", revenue: 1800 },
];

export const mockCarBrands = [
  { brand: "Honda Civic", count: 42, avgHours: 3.2 },
  { brand: "Toyota Camry", count: 35, avgHours: 2.8 },
  { brand: "BYD Atto 3", count: 28, avgHours: 4.1 },
  { brand: "Mazda 2", count: 20, avgHours: 1.5 },
];

export const mockSlotHeatmap = [
  { slot: "A-01", density: 95, label: "สูงมาก" },
  { slot: "A-02", density: 88, label: "สูง" },
  { slot: "A-03", density: 72, label: "ปานกลาง" },
  { slot: "A-04", density: 30, label: "น้อย" },
  { slot: "B-01", density: 82, label: "สูง" },
  { slot: "B-02", density: 45, label: "น้อย" },
  { slot: "B-03", density: 90, label: "สูงมาก" },
  { slot: "B-04", density: 60, label: "ปานกลาง" },
];

export const mockUsers = [
  {
    id: "u-1",
    username: "superadmin",
    password: "password123",
    name: "ผู้ดูแลระบบสูงสุด",
    role: "superadmin",
    permissions: ["live_map", "finance", "activity", "manage_roles"]
  },
  {
    id: "u-2",
    username: "admin",
    password: "password123",
    name: "เจ้าหน้าที่ดูแลระบบ",
    role: "admin",
    permissions: ["live_map", "activity"]
  }
];
