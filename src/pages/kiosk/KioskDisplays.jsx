import React, { useState } from 'react';
import { Camera, CheckCircle2, XCircle, PhoneCall, QrCode, ArrowRight } from 'lucide-react';
import { mockCars, mockSlots } from '../../data/mockData';

export default function KioskDisplays() {
  const [activeTab, setActiveTab] = useState('exit'); // 'entry' หรือ 'exit'
  const [selectedPlate, setSelectedPlate] = useState('1กก-9999');
  const [showQRModal, setShowQRModal] = useState(false);
  const [callingStaff, setCallingStaff] = useState(false);

  // คำนวณช่องจอดว่างจริงจาก mockSlots
  const emptySlotsCount = mockSlots.filter(s => !s.occupied).length;
  const currentCar = mockCars.find(c => c.plate === selectedPlate) || mockCars[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      {/* Switcher เลือกระหว่าง ทางเข้า กับ ทางออก */}
      <div className="flex gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('entry')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'entry' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          🖥️ จอไม้กั้นทางเข้า (Entry Gate)
        </button>
        <button
          onClick={() => setActiveTab('exit')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'exit' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          🖥️ จอตู้ Kiosk ขาออก (Exit Kiosk)
        </button>
      </div>

      {/* ================= 1. จอทางเข้า ================= */}
      {activeTab === 'entry' && (
        <div className="w-full max-w-4xl bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Camera className="text-emerald-400 animate-pulse" size={32} />
              <div>
                <h2 className="text-2xl font-bold tracking-wide">ENTRY GATE CAMERA SYSTEM</h2>
                <p className="text-xs text-slate-400">ระบบตรวจจับป้ายทะเบียนขาเข้าแบบอัตโนมัติ (LPR)</p>
              </div>
            </div>
            {/* ป้ายไฟดิจิทัลแสดงช่องจอดว่าง */}
            <div className="bg-black/80 border-2 border-emerald-500/50 px-6 py-3 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block font-semibold uppercase">ช่องจอดว่างทั้งหมด</span>
              <span className="text-4xl font-black font-mono text-emerald-400">{emptySlotsCount} คัน</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black">
              <img src={currentCar.image} alt="CCTV Scan" className="w-full h-64 object-cover opacity-80" />
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                CCTV LIVE
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <span className="text-xs text-slate-400 uppercase tracking-widest block font-semibold">ผลการตรวจจับ</span>
              <div>
                <p className="text-xs text-slate-500">ป้ายทะเบียนที่ตรวจพบ</p>
                <p className="text-4xl font-black text-emerald-400 font-mono tracking-wider">{currentCar.plate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">ยี่ห้อ / รุ่นของรถ</p>
                <p className="text-xl font-semibold text-slate-200">{currentCar.brand}</p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={20} />
                <span className="text-sm font-semibold">บันทึกเวลาเข้าเรียบร้อย ไม้กั้นเปิดอัตโนมัติ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. จอตู้ Kiosk ขาออก ================= */}
      {activeTab === 'exit' && (
        <div className="w-full max-w-4xl bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-wide">EXIT KIOSK STATION</h2>
              <p className="text-xs text-slate-400">จุดตรวจสอบสถานะการชำระเงินก่อนออกจากพื้นที่</p>
            </div>

            {/* Selector จำลองสลับทะเบียนรถทดสอบ */}
            <div className="flex items-center gap-2 text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400">สลับรถทดสอบ:</span>
              <button
                onClick={() => setSelectedPlate('2ขข-1234')}
                className={`px-2.5 py-1 rounded ${selectedPlate === '2ขข-1234' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                2ขข-1234 (จ่ายแล้ว)
              </button>
              <button
                onClick={() => setSelectedPlate('1กก-9999')}
                className={`px-2.5 py-1 rounded ${selectedPlate === '1กก-9999' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              >
                1กก-9999 (ยังไม่จ่าย)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* รายละเอียดรถที่จับได้ */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <span className="text-xs text-slate-400 uppercase tracking-widest block font-semibold">ทะเบียนขาออก</span>
              <div className="text-3xl font-black font-mono text-white">{currentCar.plate}</div>
              <p className="text-sm text-slate-300">{currentCar.brand}</p>
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 space-y-1">
                <div>เวลาเข้า: {currentCar.entryTime} น.</div>
                <div>อัตราค่าบริการ: {currentCar.hourlyRate} บาท/ชม.</div>
              </div>

              {/* ปุ่ม Intercom เรียกเจ้าหน้าที่ */}
              <button
                onClick={() => {
                  setCallingStaff(true);
                  setTimeout(() => setCallingStaff(false), 3000);
                }}
                className={`w-full mt-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                  callingStaff ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <PhoneCall size={16} />
                {callingStaff ? 'กำลังเชื่อมต่อเจ้าหน้าที่...' : 'กดเรียกเจ้าหน้าที่ (กรณีสแกนไม่ติด)'}
              </button>
            </div>

            {/* สถานะการชำระเงิน */}
            <div className="flex flex-col justify-between bg-slate-950 p-6 rounded-2xl border border-slate-800">
              {currentCar.paid ? (
                <div className="text-center py-8 space-y-4 my-auto">
                  <CheckCircle2 size={72} className="text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-bold text-emerald-400">ชำระเงินเรียบร้อยแล้ว</h3>
                  <p className="text-sm text-slate-400">ระบบสั่งเปิดไม้กั้นอัตโนมัติ ขอบคุณที่ใช้บริการ</p>
                </div>
              ) : (
                <div className="text-center py-4 space-y-4 my-auto">
                  <XCircle size={64} className="text-rose-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-rose-400">ยังไม่ได้ชำระค่าบริการ</h3>
                    <p className="text-xs text-slate-400 mt-1">มียอดค้างชำระ 60 บาท</p>
                  </div>
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <QrCode size={18} />
                    สร้าง Thai QR ชำระเงินหน้าตู้ Kiosk
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Modal จำลอง Thai QR ชำระเงินหน้าตู้ */}
          {showQRModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-sm w-full text-center space-y-4">
                <h4 className="text-lg font-bold">สแกนชำระเงินหน้าตู้ Kiosk</h4>
                <div className="bg-white p-4 rounded-2xl inline-block">
                  <QrCode size={180} className="text-slate-950" />
                </div>
                <p className="text-sm font-semibold text-emerald-400">ยอดชำระ: 60 บาท</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      currentCar.paid = true;
                      setShowQRModal(false);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl font-semibold text-xs"
                  >
                    จำลองว่าลูกค้าจ่ายเงินสำเร็จ
                  </button>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-400"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}