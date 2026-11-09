import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, XCircle, PhoneCall, QrCode, ArrowRight } from 'lucide-react';
import { mockCars, mockSlots } from '../../data/mockData';
import { calculateParkingCharge, PARKING_RATE_PER_HOUR } from '../../utils/parkingFee';

export default function KioskDisplays() {
  const [activeTab, setActiveTab] = useState('exit'); // 'entry' หรือ 'exit'
  const [selectedPlate, setSelectedPlate] = useState('1กก-9999');
  const [showQRModal, setShowQRModal] = useState(false);
  const [callingStaff, setCallingStaff] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // คำนวณช่องจอดว่างจริงจาก mockSlots
  const emptySlotsCount = mockSlots.filter(s => !s.occupied).length;
  const currentCar = mockCars.find(c => c.plate === selectedPlate) || mockCars[0];
  const parkingCharge = calculateParkingCharge(currentCar.entryTimestamp, currentTime);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B4D] p-6 flex flex-col items-center">
      {/* Switcher เลือกระหว่าง ทางเข้า กับ ทางออก */}
      <div className="flex gap-2 p-1.5 bg-white border border-[#E3E8EF] rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('entry')}
          aria-pressed={activeTab === 'entry'}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1685F8] focus-visible:ring-offset-2 ${
            activeTab === 'entry' ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84] hover:bg-[#EAF3FF] hover:text-[#0866C6]'
          }`}
        >
           จอไม้กั้นทางเข้า (Entry Gate)
        </button>
        <button
          onClick={() => setActiveTab('exit')}
          aria-pressed={activeTab === 'exit'}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1685F8] focus-visible:ring-offset-2 ${
            activeTab === 'exit' ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84] hover:bg-[#EAF3FF] hover:text-[#0866C6]'
          }`}
        >
           จอตู้ Kiosk ขาออก (Exit Kiosk)
        </button>
      </div>

      {/* ================= 1. จอทางเข้า ================= */}
      {activeTab === 'entry' && (
        <div className="w-full max-w-4xl bg-white border-2 border-[#E3E8EF] rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-[#E3E8EF] pb-4">
            <div className="flex items-center gap-3">
              <Camera className="text-[#1685F8] animate-pulse" size={32} />
              <div>
                <h2 className="text-2xl font-bold tracking-wide">ENTRY GATE CAMERA SYSTEM</h2>
                <p className="text-xs text-[#5E6C84]">ระบบตรวจจับป้ายทะเบียนขาเข้าแบบอัตโนมัติ (LPR)</p>
              </div>
            </div>
            {/* ป้ายไฟดิจิทัลแสดงช่องจอดว่าง */}
            <div className="bg-[#172B4D] border-2 border-[#1685F8]/50 px-6 py-3 rounded-2xl text-center">
              <span className="text-xs text-white/80 block font-semibold">ช่องจอดว่างทั้งหมด</span>
              <span className="text-4xl font-black font-mono text-[#1685F8]">{emptySlotsCount} คัน</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-[#E3E8EF] bg-black">
              <img src={currentCar.image} alt="CCTV Scan" className="w-full h-64 object-cover opacity-80" />
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                CCTV LIVE
              </div>
            </div>

            <div className="bg-[#F5F7FA] p-6 rounded-2xl border border-[#E3E8EF] space-y-4">
              <span className="text-xs text-[#5E6C84] uppercase tracking-widest block font-semibold">ผลการตรวจจับ</span>
              <div>
                <p className="text-xs text-[#7A869A]">ป้ายทะเบียนที่ตรวจพบ</p>
                <p className="text-4xl font-black text-[#1685F8] font-mono tracking-wider">{currentCar.plate}</p>
              </div>
              <div>
                <p className="text-xs text-[#7A869A]">ยี่ห้อ / รุ่นของรถ</p>
                <p className="text-xl font-semibold text-[#172B4D]">{currentCar.brand}</p>
              </div>
              <div className="pt-4 border-t border-[#E3E8EF] flex items-center gap-2 text-[#1685F8]">
                <CheckCircle2 size={20} />
                <span className="text-sm font-semibold">บันทึกเวลาเข้าเรียบร้อย ไม้กั้นเปิดอัตโนมัติ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. จอตู้ Kiosk ขาออก ================= */}
      {activeTab === 'exit' && (
        <div className="w-full max-w-4xl bg-white border-2 border-[#E3E8EF] rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-[#E3E8EF] pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-wide">EXIT KIOSK STATION</h2>
              <p className="text-xs text-[#5E6C84]">จุดตรวจสอบสถานะการชำระเงินก่อนออกจากพื้นที่</p>
            </div>

            {/* Selector จำลองสลับทะเบียนรถทดสอบ */}
            <div className="flex items-center gap-2 text-xs bg-[#F5F7FA] p-2 rounded-xl border border-[#E3E8EF]">
              <span className="text-[#5E6C84]">สลับรถทดสอบ:</span>
              <button
                onClick={() => setSelectedPlate('2ขข-1234')}
                className={`px-2.5 py-1 rounded ${selectedPlate === '2ขข-1234' ? 'bg-[#1685F8] text-white' : 'text-[#5E6C84]'}`}
              >
                2ขข-1234 (จ่ายแล้ว)
              </button>
              <button
                onClick={() => setSelectedPlate('1กก-9999')}
                className={`px-2.5 py-1 rounded ${selectedPlate === '1กก-9999' ? 'bg-amber-600 text-white' : 'text-[#5E6C84]'}`}
              >
                1กก-9999 (ยังไม่จ่าย)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* รายละเอียดรถที่จับได้ */}
            <div className="bg-[#F5F7FA] p-6 rounded-2xl border border-[#E3E8EF] space-y-4">
              <span className="text-xs text-[#5E6C84] uppercase tracking-widest block font-semibold">ทะเบียนขาออก</span>
              <div className="text-3xl font-black font-mono text-[#172B4D]">{currentCar.plate}</div>
              <p className="text-sm text-[#172B4D]">{currentCar.brand}</p>
              <div className="text-xs text-[#5E6C84] pt-2 border-t border-[#E3E8EF] space-y-1">
                <div>เวลาเข้า: {currentCar.entryTime} น.</div>
                <div>อัตราค่าบริการ: {PARKING_RATE_PER_HOUR} บาท/ชั่วโมง</div>
                <div>คิดค่าจอด: {parkingCharge.billedHours} ชั่วโมง</div>
              </div>

              {/* ปุ่ม Intercom เรียกเจ้าหน้าที่ */}
              <button
                onClick={() => {
                  setCallingStaff(true);
                  setTimeout(() => setCallingStaff(false), 3000);
                }}
                className={`w-full mt-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                  callingStaff ? 'bg-amber-500 text-slate-950' : 'bg-[#F5F7FA] hover:bg-[#E3E8EF] text-[#172B4D]'
                }`}
              >
                <PhoneCall size={16} />
                {callingStaff ? 'กำลังเชื่อมต่อเจ้าหน้าที่...' : 'กดเรียกเจ้าหน้าที่ (กรณีสแกนไม่ติด)'}
              </button>
            </div>

            {/* สถานะการชำระเงิน */}
            <div className="flex flex-col justify-between bg-[#F5F7FA] p-6 rounded-2xl border border-[#E3E8EF]">
              {currentCar.paid ? (
                <div className="text-center py-8 space-y-4 my-auto">
                  <CheckCircle2 size={72} className="text-[#1685F8] mx-auto animate-bounce" />
                  <h3 className="text-2xl font-bold text-[#1685F8]">ชำระเงินเรียบร้อยแล้ว</h3>
                  <p className="text-sm text-[#5E6C84]">ระบบสั่งเปิดไม้กั้นอัตโนมัติ ขอบคุณที่ใช้บริการ</p>
                </div>
              ) : (
                <div className="text-center py-4 space-y-4 my-auto">
                  <XCircle size={64} className="text-rose-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-rose-400">ยังไม่ได้ชำระค่าบริการ</h3>
                    <p className="text-xs text-[#5E6C84] mt-1">ยอดค้างชำระ {parkingCharge.amount} บาท</p>
                  </div>
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="w-full bg-[#1685F8] hover:bg-[#0866C6] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition  text-white"
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
              <div className="bg-white border border-[#E3E8EF] p-6 rounded-3xl max-w-sm w-full text-center space-y-4">
                <h4 className="text-lg font-bold">สแกนชำระเงินหน้าตู้ Kiosk</h4>
                <div className="bg-white p-4 rounded-2xl inline-block">
                  <QrCode size={180} className="text-slate-950" />
                </div>
                <p className="text-sm font-semibold text-[#1685F8]">ยอดชำระ: {parkingCharge.amount} บาท</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      currentCar.paid = true;
                      setShowQRModal(false);
                    }}
                    className="flex-1 bg-[#1685F8] hover:bg-[#0866C6] py-2.5 rounded-xl font-semibold text-xs"
                  >
                    จำลองว่าลูกค้าจ่ายเงินสำเร็จ
                  </button>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="px-4 py-2.5 bg-[#F5F7FA] hover:bg-[#E3E8EF] rounded-xl text-xs text-[#5E6C84]"
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
