import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  CreditCard,
  History,
  Info,
  Map,
  MapPin,
  Navigation,
  ParkingCircle,
  QrCode,
  ReceiptText,
  Search,
  ShieldCheck,
  WalletCards,
  X,
} from 'lucide-react';
import { mockCars } from '../../data/mockData';
import { calculateParkingCharge } from '../../utils/parkingFee';

const PARKING_LOCATION = 'ลานจอดรถตัวอย่าง';
const GRACE_PERIOD_SECONDS = 15 * 60;

function formatCurrency(value) {
  return new Intl.NumberFormat('th-TH').format(value || 0);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatDuration(minutes) {
  if (minutes < 1) return 'น้อยกว่า 1 นาที';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes} นาที`;
  if (remainingMinutes === 0) return `${hours} ชั่วโมง`;
  return `${hours} ชั่วโมง ${remainingMinutes} นาที`;
}

function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getSlotZone(slotId) {
  return slotId?.split('-')[0] || '—';
}

export default function UserPaymentFlow({ vehicles = mockCars, onPaymentSuccess }) {
  const [activeTab, setActiveTab] = useState('search');
  const [screen, setScreen] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const [matchingCars, setMatchingCars] = useState([]);
  const [isParkingMapOpen, setIsParkingMapOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(GRACE_PERIOD_SECONDS);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!selectedCar || screen !== 'details') return undefined;
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, [selectedCar, screen]);

  useEffect(() => {
    if (screen !== 'success' || timeLeft <= 0) return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [screen, timeLeft]);

  const parkingCharge = useMemo(() => {
    if (!selectedCar) return null;
    return calculateParkingCharge(
      selectedCar.entryTimestamp,
      currentTime,
      selectedCar.hourlyRate || 30,
    );
  }, [selectedCar, currentTime]);

  const handleSearch = (event) => {
    event.preventDefault();
    const plate = searchTerm.trim().replace(/[\s-]/g, '').toLocaleLowerCase('th-TH');

    if (!plate) {
      setSearchError('กรุณากรอกหมายเลขทะเบียนรถก่อนค้นหา');
      searchInputRef.current?.focus();
      return;
    }

    const found = vehicles.filter((car) =>
      !car.paid
      && car.plate.replace(/[\s-]/g, '').toLocaleLowerCase('th-TH') === plate,
    );

    if (found.length === 0) {
      setSearchError('ไม่พบทะเบียนนี้ในลานจอดรถที่เลือก กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    setSearchError('');
    if (found.length > 1) {
      setMatchingCars(found);
      setScreen('province');
      return;
    }

    setMatchingCars([]);
    setSelectedCar(found[0]);
    setCurrentTime(Date.now());
    setScreen('details');
    setActiveTab('search');
  };

  const goToSearch = () => {
    setSearchTerm('');
    setSearchError('');
    setSelectedCar(null);
    setMatchingCars([]);
    setTimeLeft(GRACE_PERIOD_SECONDS);
    setScreen('search');
    setActiveTab('search');
  };

  const handlePaymentSuccess = () => {
    if (!selectedCar || !parkingCharge) return;
    const paidAt = Date.now();
    const transaction = {
      id: `AP-${String(paidAt).slice(-8)}`,
      plate: selectedCar.plate,
      brand: selectedCar.brand,
      amount: parkingCharge.amount,
      paidAt,
      location: PARKING_LOCATION,
    };
    setPaymentHistory((previous) => [transaction, ...previous]);
    onPaymentSuccess?.(selectedCar.id);
    setCurrentTime(paidAt);
    setTimeLeft(GRACE_PERIOD_SECONDS);
    setScreen('success');
    setActiveTab('search');
  };

  const showHistory = () => {
    setActiveTab('history');
    setScreen('history');
  };

  const showSearch = () => {
    setActiveTab('search');
    if (screen === 'history') {
      setSelectedCar(null);
      setSearchError('');
      setSearchTerm('');
      setScreen('search');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-0 py-3 sm:px-4">
      <div className="mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-[430px] flex-col overflow-hidden rounded-xl border border-[#E3E8EF] bg-white shadow-sm">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-[#E3E8EF] bg-white px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1685F8] text-white"><ParkingCircle size={23} strokeWidth={2.2} /></div>
            <div>
              <div className="text-xs font-extrabold tracking-wide text-[#172B4D]">AUTO PARKING</div>
              <div className="mt-1 text-[9px] font-semibold tracking-wider text-[#7A869A]">SMART PARKING SERVICE</div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col bg-[#F5F7FA] px-4 py-5">
          {screen === 'search' && (
            <section className="mx-auto flex w-full flex-1 flex-col">
              <section className="rounded-xl border border-[#E3E8EF] bg-white p-4 shadow-sm">
                <div className="mb-3">
                  <div className="text-sm font-bold uppercase tracking-wide text-[#1685F8]">ค้นหาด้วยทะเบียนรถ</div>
                </div>
                <form className="mt-2" onSubmit={handleSearch} noValidate>
                  <label className="mb-1.5 block text-base font-semibold text-[#5E6C84]" htmlFor="vehicle-plate">หมายเลขทะเบียนรถ</label>
                  <div className={`flex min-h-12 items-center gap-2 rounded-lg border border-[#E3E8EF] bg-white px-3 focus-within:border-[#1685F8] focus-within:ring-2 focus-within:ring-[#1685F8]/10 ${searchError ? 'border-red-500 ring-2 ring-red-100' : ''}`}>
                    <div className="shrink-0 text-[#7A869A]"><CarFront size={21} /></div>
                    <input
                      ref={searchInputRef}
                      id="vehicle-plate"
                      className={`min-w-0 flex-1 border-0 bg-transparent text-base font-semibold text-[#172B4D] outline-none placeholder:text-[#A0AAB8] ${searchError ? 'text-red-700' : ''}`}
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      placeholder="เช่น 1กก9999"
                      value={searchTerm}
                      onChange={(event) => {
                        setSearchTerm(event.target.value);
                        if (searchError) setSearchError('');
                      }}
                      aria-invalid={Boolean(searchError)}
                      aria-describedby={searchError ? 'plate-error' : 'plate-hint'}
                    />
                    {searchTerm && (
                      <button
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F7FA] text-lg text-[#5E6C84] hover:bg-[#E3E8EF]"
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setSearchError('');
                          searchInputRef.current?.focus();
                        }}
                        aria-label="ล้างทะเบียน"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {searchError ? (
                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 p-2 text-xs text-red-700" id="plate-error"><AlertCircle size={15} />{searchError}</div>
                  ) : (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[#7A869A]" id="plate-hint"><Info size={14} /> ตรวจสอบตัวอักษรและตัวเลขให้ถูกต้อง</div>
                  )}
                  <button className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1685F8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0866C6] focus:outline-none focus:ring-2 focus:ring-[#1685F8]/30" type="submit">
                    <Search size={19} /> ค้นหารถของฉัน <ArrowRight size={18} />
                  </button>
                </form>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#7A869A]">
                  <span>ทะเบียนตัวอย่าง</span>
                  <button type="button" className="rounded border border-[#E3E8EF] bg-[#F5F7FA] px-2 py-1 text-[11px] font-medium text-[#5E6C84] hover:bg-[#F5F7FA]" onClick={() => { setSearchTerm('1กก9999'); setSearchError(''); }}>1กก9999</button>
                  <button type="button" onClick={() => { setSearchTerm('2ขข1234'); setSearchError(''); }}>2ขข1234</button>
                </div>
              </section>

              <section className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h3>วิธีใช้งาน</h3>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="min-w-0 rounded-lg border border-[#E3E8EF] bg-white p-2">
                    <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: "#F5F7FA", color: "#5E6C84" }}><Search size={19} /></div>
                    <div><strong className="block text-[13px] font-semibold text-[#5E6C84]">ค้นหาทะเบียน</strong><span className="mt-1 block text-[11px] leading-snug text-[#7A869A]">กรอกทะเบียนรถของคุณ</span></div>
                  </div>
                  <div className="hidden" />
                  <div className="min-w-0 rounded-lg border border-[#E3E8EF] bg-white p-2">
                    <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: "#F5F7FA", color: "#5E6C84" }}><Clock3 size={19} /></div>
                    <div><strong className="block text-[13px] font-semibold text-[#5E6C84]">เช็คชั่วโมงจอด</strong><span className="mt-1 block text-[11px] leading-snug text-[#7A869A]">ตรวจสอบระยะเวลาจอด</span></div>
                  </div>
                  <div className="hidden" />
                  <div className="min-w-0 rounded-lg border border-[#E3E8EF] bg-white p-2">
                    <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: "#F5F7FA", color: "#5E6C84" }}><WalletCards size={19} /></div>
                    <div><strong className="block text-[13px] font-semibold text-[#5E6C84]">ชำระค่าจอด</strong><span className="mt-1 block text-[11px] leading-snug text-[#7A869A]">ตรวจสอบยอดและชำระเงิน</span></div>
                  </div>
                </div>
              </section>

              <div className="mt-auto flex items-center gap-2 border-t border-[#E3E8EF] pt-3 text-[#7A869A]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F2F8FF] text-[#1685F8]"><CircleHelpIcon /></div>
                <div><strong>ต้องการความช่วยเหลือ?</strong><span>ติดต่อเจ้าหน้าที่ประจำลานจอดรถได้ที่จุดบริการ</span></div>
              </div>
            </section>
          )}

          {screen === 'province' && (
            <section>
              <button type="button" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-[#5E6C84] hover:text-[#1685F8]" onClick={goToSearch}><ArrowLeft size={18} /> กลับไปค้นหา</button>
              <div className="my-4">
                <div className="text-[10px] font-bold uppercase tracking-wide text-[#1685F8]">CONFIRM LICENSE PLATE</div>
                <h1>ยืนยันจังหวัดทะเบียน</h1>
                <p className="text-sm text-[#7A869A]">พบรถทะเบียน {matchingCars[0]?.plate} มากกว่าหนึ่งคัน กรุณาเลือกจังหวัดบนป้ายทะเบียนเพื่อยืนยันรถของคุณ</p>
              </div>
              <div className="grid gap-3">
                {matchingCars.map((car) => (
                  <button key={car.id} type="button" className="rounded-xl border border-[#E3E8EF] bg-white p-4 text-left hover:border-[#1685F8] focus:outline-none focus:ring-2 focus:ring-[#1685F8]/30" onClick={() => {
                    setSelectedCar(car);
                    setCurrentTime(Date.now());
                    setScreen('details');
                    setActiveTab('search');
                  }}>
                    <span className="text-xs text-[#7A869A]">จังหวัด</span>
                    <strong className="mt-1 block text-lg text-[#172B4D]">{car.province || 'ไม่ระบุจังหวัด'}</strong>
                    <span className="mt-1 block text-sm text-[#5E6C84]">{car.plate} · {car.brand}</span>
                    <span className="mt-1 block text-xs text-[#7A869A]">ตำแหน่งจอด {car.floor} / {car.slotId}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {screen === 'details' && selectedCar && parkingCharge && (
            <section >
              <button type="button" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-[#5E6C84] hover:text-[#1685F8]" onClick={goToSearch}><ArrowLeft size={18} /> กลับไปค้นหา</button>
              <div className="my-4">
                <div className="text-[10px] font-bold uppercase tracking-wide text-[#1685F8]">VEHICLE INFORMATION</div>
                <h1>พบข้อมูลรถของคุณ</h1>
                <p>ตรวจสอบตำแหน่งรถและค่าจอดปัจจุบัน</p>
              </div>

              <div className="mb-3 overflow-hidden rounded-xl border border-[#E3E8EF] bg-white">
                <div className="relative h-36 overflow-hidden bg-[#F5F7FA]">
                  <img src={selectedCar.image} alt={selectedCar.brand} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-green-700 shadow-sm"><BadgeCheck size={14} /> พบรถในระบบ</div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-[#7A869A]">ทะเบียนรถ</span>
                  <div className="mt-1 text-2xl font-bold text-[#172B4D]">{selectedCar.plate}</div>
                  <div className="mt-1 text-sm text-[#5E6C84]">ทะเบียน: {selectedCar.province || 'ไม่ระบุจังหวัด'}</div>
                  <div className="mt-1 text-sm text-[#5E6C84]">{selectedCar.brand}</div>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-[#E3E8EF] bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F2F8FF] text-[#1685F8]"><MapPin size={19} /></div>
                  <div className="min-w-0 flex-1"><h2>ตำแหน่งที่จอดรถ</h2><p>ตำแหน่งล่าสุดในลานจอดรถ</p></div>
                  <button type="button" onClick={() => setIsParkingMapOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] text-[#1685F8] hover:bg-[#DBEAFE] focus:outline-none focus:ring-2 focus:ring-[#1685F8]/30" aria-label="เปิดแผนที่ช่องจอด" title="ดูแผนที่"><Map size={19} /></button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="min-w-0 rounded-md bg-[#F5F7FA] p-2 text-xs"><span>ชั้นจอด</span><strong>{selectedCar.floor}</strong></div>
                  <div className="min-w-0 rounded-md bg-[#F5F7FA] p-2 text-xs"><span>โซน</span><strong>{getSlotZone(selectedCar.slotId)}</strong></div>
                  <div className="min-w-0 rounded-md bg-[#F5F7FA] p-2 text-xs bg-[#F2F8FF]"><span>หมายเลขช่อง</span><strong>{selectedCar.slotId}</strong></div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-[#7A869A]"><Navigation size={15} /> กรุณาตรวจสอบป้ายบอกทางภายในอาคาร</div>
              </div>

              {isParkingMapOpen && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsParkingMapOpen(false); }}>
                  <section className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="parking-map-title">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1685F8]"><Map size={20} /></div>
                      <div className="min-w-0 flex-1"><h2 id="parking-map-title" className="text-base font-bold text-[#172B4D]">แผนที่ช่องจอดรถ</h2><p className="mt-1 text-xs text-[#7A869A]">ชั้น {selectedCar.floor} · โซน {getSlotZone(selectedCar.slotId)} · ช่อง {selectedCar.slotId}</p></div>
                      <button type="button" onClick={() => setIsParkingMapOpen(false)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#7A869A] hover:bg-[#F5F7FA]" aria-label="ปิดแผนที่"><X size={19} /></button>
                    </div>
                    <div className="rounded-lg border border-dashed border-[#C8D2DF] bg-[#F8FAFC] p-3">
                      <div className="mb-3 text-center text-[10px] font-semibold tracking-[0.2em] text-[#7A869A]">ช่องจอด · โซน {getSlotZone(selectedCar.slotId)}</div>
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 25 }, (_, index) => {
                          const slotNumber = String(index + 1).padStart(2, '0');
                          const slotId = `${getSlotZone(selectedCar.slotId)}-${slotNumber}`;
                          const isSelected = slotId === selectedCar.slotId;
                          return <div key={slotId} className={`flex h-10 items-center justify-center rounded-md border text-xs font-semibold ${isSelected ? 'border-[#1685F8] bg-[#1685F8] text-white shadow-sm' : 'border-[#E3E8EF] bg-white text-[#A0AAB8]'}`} aria-current={isSelected ? 'location' : undefined}>{slotNumber}</div>;
                        })}
                      </div>
                      <div className="mt-3 rounded bg-[#EDF2F7] py-1.5 text-center text-[10px] font-medium tracking-widest text-[#7A869A]">ทางเดิน</div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#5E6C84]"><span className="h-3 w-3 rounded-sm bg-[#1685F8]" /> ช่องจอดรถของคุณ</div>
                    <button type="button" onClick={() => setIsParkingMapOpen(false)} className="mt-4 w-full rounded-lg bg-[#1685F8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0866C6]">ปิดแผนที่</button>
                  </section>
                </div>
              )}

              <div className="mt-3 rounded-xl border border-[#E3E8EF] bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700"><ReceiptText size={19} /></div>
                  <div><h2>รายละเอียดค่าจอด</h2><p>ข้อมูลการใช้บริการปัจจุบัน</p></div>
                </div>
                <div className="flex min-h-9 items-center justify-between gap-2 border-b border-[#E3E8EF] py-2 text-xs text-[#5E6C84]"><span><Clock3 size={15} /> เวลาเข้าจอด</span><strong>{selectedCar.entryTime} น.</strong></div>
                <div className="flex min-h-9 items-center justify-between gap-2 border-b border-[#E3E8EF] py-2 text-xs text-[#5E6C84]"><span><CalendarDays size={15} /> ระยะเวลาที่จอด</span><strong>{formatDuration(parkingCharge.durationMinutes)}</strong></div>
                <div className="flex min-h-9 items-center justify-between gap-2 border-b border-[#E3E8EF] py-2 text-xs text-[#5E6C84]"><span>อัตราค่าบริการ</span><strong>{formatCurrency(selectedCar.hourlyRate || 30)} บาท / ชั่วโมง</strong></div>
                <div className="mt-3 flex items-center justify-between gap-2 text-sm font-bold text-[#172B4D]"><span>ยอดชำระโดยประมาณ</span><strong>{formatCurrency(parkingCharge.amount)} <small>บาท</small></strong></div>
                <p className="mt-2 text-[11px] leading-relaxed text-[#7A869A]">ยอดค่าจอดคำนวณตามเวลาปัจจุบัน และอาจเปลี่ยนแปลงจนกว่าจะชำระเงิน</p>
              </div>

              <button type="button" className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1685F8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0866C6] focus:outline-none focus:ring-2 focus:ring-[#1685F8]/30 mt-4" onClick={() => setScreen('payment')}>
                <CreditCard size={19} /> ดำเนินการชำระเงิน <ArrowRight size={18} />
              </button>
            </section>
          )}

          {screen === 'payment' && selectedCar && parkingCharge && (
            <section className="">
              <button type="button" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-[#5E6C84] hover:text-[#1685F8]" onClick={() => setScreen('details')}><ArrowLeft size={18} /> กลับไปดูรายละเอียด</button>
              <div className="my-4">
                <div className="text-[10px] font-bold uppercase tracking-wide text-[#1685F8]">SECURE PAYMENT</div>
                <h1>ชำระค่าจอดรถ</h1>
                <p>ตรวจสอบยอดเงินก่อนดำเนินการชำระ</p>
              </div>
              <div className="rounded-xl bg-[#0866C6] p-5 text-center text-white">
                <span>ยอดที่ต้องชำระ</span>
                <strong>{formatCurrency(parkingCharge.amount)} <small>บาท</small></strong>
                <div><CarFront size={15} /> {selectedCar.plate} <span>•</span> {selectedCar.brand}</div>
              </div>
              <div className="mt-3 rounded-xl border border-[#E3E8EF] bg-white p-4">
                <div className="flex items-center gap-2"><div className="text-[#1685F8]"><QrCode size={19} /></div><div><strong>PromptPay QR</strong><span>สแกนเพื่อชำระเงิน</span></div><span className="ml-auto rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">แนะนำ</span></div>
                <div className="mx-auto my-4 flex h-48 w-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E3E8EF] bg-[#F5F7FA] text-[#172B4D]"><QrCode size={154} strokeWidth={1.25} /><span>ตัวอย่าง QR Payment</span></div>
                <p className="flex items-start justify-center gap-2 text-center text-[11px] text-[#7A869A]"><Info size={14} /> หน้านี้เป็นการจำลองการชำระเงินสำหรับทดสอบหน้าจอเท่านั้น</p>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F2F8FF] p-3 text-xs text-[#0866C6]"><ShieldCheck size={18} /><span>ตรวจสอบทะเบียนและยอดเงินให้ถูกต้องก่อนยืนยัน</span></div>
              <button type="button" className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1685F8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0866C6] focus:outline-none focus:ring-2 focus:ring-[#1685F8]/30 mt-3" onClick={handlePaymentSuccess}>
                <CheckCircle2 size={19} /> จำลองการชำระเงินสำเร็จ
              </button>
              <button type="button" className="mt-3 w-full text-center text-xs text-[#7A869A] hover:text-[#1685F8]" onClick={() => setScreen('details')}>ยกเลิกและกลับไปหน้ารายละเอียด</button>
            </section>
          )}

          {screen === 'success' && selectedCar && (
            <section className="py-5 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600"><CheckCircle2 size={46} /></div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-[#1685F8]">PAYMENT COMPLETED</div>
              <h1>ชำระเงินสำเร็จ!</h1>
              <p className="mb-4 text-sm text-[#7A869A]">ขอบคุณที่ใช้บริการ Auto Parking</p>
              <div className="rounded-xl border border-[#E3E8EF] bg-white p-4 text-left">
                <div className="flex items-center justify-between border-b border-dashed border-[#E3E8EF] pb-3"><span>ทะเบียนรถ</span><strong>{selectedCar.plate}</strong></div>
                <div className="flex justify-between gap-2 pt-3 text-xs text-[#5E6C84]"><span>สถานที่</span><strong>{PARKING_LOCATION}</strong></div>
                <div className="flex justify-between gap-2 pt-3 text-xs text-[#5E6C84]"><span>ตำแหน่งจอด</span><strong>{selectedCar.floor} · {selectedCar.slotId}</strong></div>
                <div className="flex justify-between gap-2 pt-3 text-xs text-[#5E6C84]"><span>เวลาชำระ</span><strong>{formatDateTime(Date.now())}</strong></div>
                <div className="mt-3 flex items-center justify-between border-t border-[#E3E8EF] pt-3 text-sm font-bold"><span>ยอดชำระแล้ว</span><strong>{formatCurrency(paymentHistory[0]?.amount || 0)} บาท</strong></div>
              </div>
              <div className="mt-3 rounded-xl border border-[#E3E8EF] bg-[#F2F8FF] p-4">
                <div className="flex items-center justify-center gap-2 text-xs text-[#0866C6]"><Clock3 size={17} /><strong>เวลาสำหรับนำรถออกจากลานจอด</strong></div>
                <div className="my-2 text-3xl font-extrabold tracking-wider text-[#1685F8]">{formatTimer(timeLeft)}</div>
                <p>กรุณานำรถออกภายใน 15 นาที หลังชำระเงิน</p>
              </div>
              {timeLeft === 0 && <div className="mt-3 flex items-center gap-2 text-xs text-amber-700"><AlertCircle size={16} /> หมดเวลาสำหรับนำรถออก กรุณาติดต่อเจ้าหน้าที่</div>}
              <button type="button" className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1685F8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0866C6] focus:outline-none focus:ring-2 focus:ring-[#1685F8]/30" onClick={goToSearch}>กลับสู่หน้าค้นหารถ <ArrowRight size={18} /></button>
            </section>
          )}

          {screen === 'history' && (
            <section className="">
              <div className="my-4 mb-5 mt-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-[#1685F8]">PAYMENT RECORDS</div>
                <h1>ประวัติการชำระเงิน</h1>
                <p>รายการชำระเงินจากการใช้งานในอุปกรณ์นี้</p>
              </div>
              {paymentHistory.length === 0 ? (
                <div className="rounded-xl border border-[#E3E8EF] bg-white p-6 text-center">
                  <div className="mb-3 text-[#1685F8]"><History size={31} /></div>
                  <h2>ยังไม่มีประวัติการชำระเงิน</h2>
                  <p>เมื่อคุณชำระค่าจอดรถ รายการจะปรากฏที่หน้านี้</p>
                  <button type="button" className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#E3E8EF] bg-[#F2F8FF] px-4 py-2 text-sm font-semibold text-[#1685F8]" onClick={showSearch}>ค้นหารถของฉัน <ArrowRight size={16} /></button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {paymentHistory.map((item) => (
                    <article className="rounded-xl border border-[#E3E8EF] bg-white p-4" key={item.id}>
                      <div className="flex items-center gap-3">
                        <div className="text-[#1685F8]"><ReceiptText size={19} /></div>
                        <div className="min-w-0 flex-1"><strong>{item.plate}</strong><span>{item.brand}</span></div>
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700"><CheckCircle2 size={13} /> สำเร็จ</span>
                      </div>
                      <div className="mt-3 flex justify-between gap-2 border-t border-[#E3E8EF] pt-3 text-xs text-[#5E6C84]"><span>{formatDateTime(item.paidAt)}</span><strong>{formatCurrency(item.amount)} บาท</strong></div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-[#7A869A]"><MapPin size={13} /> {item.location}</div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function CircleHelpIcon() {
  return <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs font-bold">?</span>;
}
