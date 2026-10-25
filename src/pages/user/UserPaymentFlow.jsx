import React, { useState, useEffect } from 'react';
import { Search, Car, QrCode, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { mockCars } from '../../data/mockData';

export default function UserPaymentFlow() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 นาที = 900 วินาที

  // นับถอยหลัง Grace Period 15 นาทีเมื่อชำระเงินสำเร็จ
  useEffect(() => {
    let timer;
    if (isPaid && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPaid, timeLeft]);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = mockCars.find(c => c.plate.includes(searchTerm.trim()));
    if (found) {
      setSelectedCar(found);
    } else {
      alert('ไม่พบข้อมูลป้ายทะเบียนในระบบ');
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex justify-center p-4">
      {/* Container จำลองจอมือถือ */}
      <div className="w-full max-w-md bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700 flex flex-col justify-between">
        
        <div>
          <header className="mb-6 text-center">
            <h1 className="text-xl font-bold text-emerald-400">Smart Parking Payment</h1>
            <p className="text-xs text-slate-400">สแกนจากเสา เพื่อค้นหาทะเบียนและชำระเงิน</p>
          </header>

          {/* สเต็ป 1: ค้นหาทะเบียน */}
          {!selectedCar && (
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="กรอกป้ายทะเบียน (เช่น 1กก-9999)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-semibold text-sm transition"
              >
                ค้นหารถของฉัน
              </button>
              <p className="text-xs text-slate-500 text-center">ทดสอบพิมพ์: 1กก-9999 หรือ 2ขข-1234</p>
            </form>
          )}

          {/* สเต็ป 2: แสดงรายละเอียดและยอดเงิน */}
          {selectedCar && !isPaid && (
            <div className="space-y-4">
              <img
                src={selectedCar.image}
                alt={selectedCar.plate}
                className="w-full h-44 object-cover rounded-2xl border border-slate-700"
              />
              <div className="bg-slate-900/60 p-4 rounded-2xl space-y-2 text-sm border border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">ทะเบียน:</span>
                  <span className="font-bold text-emerald-400">{selectedCar.plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">รุ่นรถ:</span>
                  <span>{selectedCar.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">เวลาเข้า:</span>
                  <span>{selectedCar.entryTime} น.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ระยะเวลา:</span>
                  <span> {selectedCar.entryTime} </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-base">
                  <span className="font-bold">ยอดชำระ:</span>
                  <span className="font-bold text-emerald-400">60 บาท</span>
                </div>
              </div>

              {/* จำลอง Thai QR */}
              <div className="bg-white p-4 rounded-2xl flex flex-col items-center">
                <QrCode size={160} className="text-slate-950" />
                <span className="text-slate-900 text-xs font-semibold mt-2">Thai QR Payment</span>
              </div>

              <button
                onClick={() => setIsPaid(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-semibold text-sm transition"
              >
                จำลองการชำระเงินสำเร็จ
              </button>
            </div>
          )}

          {/* สเต็ป 3: ชำระเงินแล้ว + นับถอยหลัง 15 นาที */}
          {isPaid && (
            <div className="text-center space-y-6 py-6">
              <CheckCircle2 size={64} className="text-emerald-400 mx-auto" />
              <div>
                <h2 className="text-lg font-bold">ชำระเงินสำเร็จเรียบร้อย</h2>
                <p className="text-xs text-slate-400 mt-1">ทะเบียน {selectedCar.plate}</p>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-center gap-2 text-amber-400 mb-2">
                  <Clock size={18} />
                  <span className="text-xs font-semibold">ระยะเวลาที่ต้องออกจากพื้นที่ (Grace Period)</span>
                </div>
                <div className="text-4xl font-mono font-bold tracking-wider text-emerald-400">
                  {formatTimer(timeLeft)}
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center gap-2 text-left">
                <AlertTriangle size={24} className="text-amber-400 shrink-0" />
                <p className="text-xs text-amber-300">
                  หากไม่ออกจากพื้นที่ภายใน 15 นาที ระบบจะเริ่มคิดค่าบริการเพิ่มเติมตามอัตราปกติ
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedCar && (
          <button
            onClick={() => {
              setSelectedCar(null);
              setIsPaid(false);
              setTimeLeft(15 * 60);
            }}
            className="text-xs text-slate-500 hover:text-slate-300 mt-4 text-center block w-full"
          >
            ← กลับไปหน้าค้นหา
          </button>
        )}
      </div>
    </div>
  );
}