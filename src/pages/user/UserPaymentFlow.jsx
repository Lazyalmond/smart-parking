import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  History,
  Home,
  Info,
  MapPin,
  Navigation,
  ParkingCircle,
  QrCode,
  ReceiptText,
  Search,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { mockCars } from '../../data/mockData';
import { calculateParkingCharge } from '../../utils/parkingFee';
import './UserPaymentFlow.css';

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

export default function UserPaymentFlow() {
  const [activeTab, setActiveTab] = useState('search');
  const [screen, setScreen] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
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

    const found = mockCars.find((car) =>
      car.plate.replace(/[\s-]/g, '').toLocaleLowerCase('th-TH').includes(plate),
    );

    if (!found) {
      setSearchError('ไม่พบทะเบียนนี้ในลานจอดรถที่เลือก กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    setSearchError('');
    setSelectedCar(found);
    setCurrentTime(Date.now());
    setScreen('details');
    setActiveTab('search');
  };

  const goToSearch = () => {
    setSearchTerm('');
    setSearchError('');
    setSelectedCar(null);
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
    <div className="user-app-shell">
      <div className="user-app-frame">
        <header className="user-topbar">
          <div className="user-brand-lockup">
            <div className="user-brand-icon"><ParkingCircle size={23} strokeWidth={2.2} /></div>
            <div>
              <div className="user-brand-name">AUTO PARKING</div>
              <div className="user-brand-caption">SMART PARKING SERVICE</div>
            </div>
          </div>
          <div className="user-location-chip">
            <span className="user-location-dot" />
            <span>ลานจอดรถตัวอย่าง</span>
          </div>
        </header>

        <main className="user-main-content">
          {screen === 'search' && (
            <section className="search-screen" aria-labelledby="search-title">
              <div className="search-intro">
                <div className="search-intro-meta">
                  <span className="search-intro-line" />
                  <span>บริการค้นหารถและชำระค่าจอด</span>
                </div>
                <h1 id="search-title">ค้นหารถที่จอดอยู่</h1>
                <p>กรอกหมายเลขทะเบียนรถ เพื่อดูตำแหน่งจอดและตรวจสอบค่าบริการ</p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1685F8] hover:bg-[#0866C6] py-3 rounded-xl font-semibold text-sm transition text-white"
              >
                ค้นหารถ
              </button>
              <p className="text-xs text-[#7A869A] text-center">1กก-9999 หรือ 2ขข-1234</p>
            </form>
      </section>
          )}


              <section className="search-panel">
                <div className="search-panel-heading">
                  <div className="section-kicker">ค้นหาด้วยทะเบียนรถ</div>
                  <p className="search-panel-description">กรอกทะเบียนรถให้ตรงกับตอนเข้าจอด</p>
                </div>
                <form className="plate-search-form" onSubmit={handleSearch} noValidate>
                  <label className="plate-input-label" htmlFor="vehicle-plate">หมายเลขทะเบียนรถ</label>
                  <div className={`plate-input-wrap ${searchError ? 'has-error' : ''}`}>
                    <div className="plate-input-icon"><CarFront size={21} /></div>
                    <input
                      ref={searchInputRef}
                      id="vehicle-plate"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      placeholder="เช่น 1กก-9999"
                      value={searchTerm}
                      onChange={(event) => {
                        setSearchTerm(event.target.value);
                        if (searchError) setSearchError('');
                      }}
                      aria-invalid={Boolean(searchError)}
                      aria-describedby={searchError ? 'plate-error' : 'plate-hint'}
                    />
                    {searchTerm && (
                      <button className="clear-plate-button" type="button" onClick={() => {
                        setSearchTerm('');
                        setSearchError('');
                        searchInputRef.current?.focus();
                      }} aria-label="ล้างทะเบียน">
                        ×
                      </button>
                    )}
                  </div>
                  {searchError ? (
                    <div className="search-error" id="plate-error"><AlertCircle size={15} />{searchError}</div>
                  ) : (
                    <div className="plate-input-hint" id="plate-hint"><Info size={14} /> ตรวจสอบตัวอักษรและตัวเลขให้ถูกต้อง</div>
                  )}
                  <button className="primary-search-button" type="submit">
                    <Search size={19} /> ค้นหารถของฉัน <ArrowRight size={18} />
                  </button>
                </form>

                <div className="example-plates">
                  <span>ทะเบียนตัวอย่าง</span>
                  <button type="button" onClick={() => { setSearchTerm('1กก-9999'); setSearchError(''); }}>1กก-9999</button>
                  <button type="button" onClick={() => { setSearchTerm('2ขข-1234'); setSearchError(''); }}>2ขข-1234</button>
                </div>
              </section>

              <section className="how-it-works">
                <div className="how-heading">
                  <div>
                    <h3>วิธีใช้งาน</h3>
                  </div>
                </div>
                <div className="how-steps">
                  <div className="how-step">
                    <div className="how-step-icon step-blue"><Search size={19} /></div>
                    <div><strong>ค้นหาทะเบียน</strong><span>กรอกทะเบียนรถของคุณ</span></div>
                  </div>
                  <div className="how-step-connector" />
                  <div className="how-step">
                    <div className="how-step-icon step-violet"><MapPin size={19} /></div>
                    <div><strong>ดูตำแหน่งรถ</strong><span>เช็กชั้นและช่องจอดรถ</span></div>
                  </div>
                  <div className="how-step-connector" />
                  <div className="how-step">
                    <div className="how-step-icon step-green"><WalletCards size={19} /></div>
                    <div><strong>ชำระค่าจอด</strong><span>ตรวจสอบยอดและชำระเงิน</span></div>
                  </div>
                </div>
              </section>

              <div className="user-help-note">
                <div className="help-note-icon"><CircleHelpIcon /></div>
                <div><strong>ต้องการความช่วยเหลือ?</strong><span>ติดต่อเจ้าหน้าที่ประจำลานจอดรถได้ที่จุดบริการ</span></div>
                <ChevronRight size={18} />
              </div>
            </section>
          )}

          {screen === 'details' && selectedCar && parkingCharge && (
            <section className="details-screen">
              <button type="button" className="back-link" onClick={goToSearch}><ArrowLeft size={18} /> กลับไปค้นหา</button>
              <div className="page-title-block">
                <div className="section-kicker">VEHICLE INFORMATION</div>
                <h1>พบข้อมูลรถของคุณ</h1>
                <p>ตรวจสอบตำแหน่งรถและค่าจอดปัจจุบัน</p>
              </div>

              <div className="vehicle-card">
                <div className="vehicle-photo-wrap">
                  <img src={selectedCar.image} alt={selectedCar.brand} className="vehicle-photo" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                  <div className="vehicle-photo-badge"><BadgeCheck size={14} /> พบรถในระบบ</div>
                </div>
                <div className="vehicle-card-body">
                  <span className="vehicle-label">ทะเบียนรถ</span>
                  <div className="vehicle-plate-number">{selectedCar.plate}</div>
                  <div className="vehicle-brand-name">{selectedCar.brand}</div>
                </div>
              </div>

              <div className="location-card">
                <div className="card-heading-row">
                  <div className="card-heading-icon location-heading-icon"><MapPin size={19} /></div>
                  <div><h2>ตำแหน่งที่จอดรถ</h2><p>ตำแหน่งล่าสุดในลานจอดรถ</p></div>
                </div>
                <div className="parking-location-grid">
                  <div className="parking-location-item"><span>ชั้นจอด</span><strong>{selectedCar.floor}</strong></div>
                  <div className="parking-location-item"><span>โซน</span><strong>{getSlotZone(selectedCar.slotId)}</strong></div>
                  <div className="parking-location-item parking-slot-item"><span>หมายเลขช่อง</span><strong>{selectedCar.slotId}</strong></div>
                </div>
                <div className="location-footnote"><Navigation size={15} /> กรุณาตรวจสอบป้ายบอกทางภายในอาคาร</div>
              </div>

              <div className="fee-card">
                <div className="card-heading-row">
                  <div className="card-heading-icon fee-heading-icon"><ReceiptText size={19} /></div>
                  <div><h2>รายละเอียดค่าจอด</h2><p>ข้อมูลการใช้บริการปัจจุบัน</p></div>
                </div>
                <div className="fee-detail-row"><span><Clock3 size={15} /> เวลาเข้าจอด</span><strong>{selectedCar.entryTime} น.</strong></div>
                <div className="fee-detail-row"><span><CalendarDays size={15} /> ระยะเวลาที่จอด</span><strong>{formatDuration(parkingCharge.durationMinutes)}</strong></div>
                <div className="fee-detail-row"><span>อัตราค่าบริการ</span><strong>{formatCurrency(selectedCar.hourlyRate || 30)} บาท / ชั่วโมง</strong></div>
                <div className="fee-total-row"><span>ยอดชำระโดยประมาณ</span><strong>{formatCurrency(parkingCharge.amount)} <small>บาท</small></strong></div>
                <p className="fee-disclaimer">ยอดค่าจอดคำนวณตามเวลาปัจจุบัน และอาจเปลี่ยนแปลงจนกว่าจะชำระเงิน</p>
              </div>

              <button type="button" className="primary-search-button continue-payment-button" onClick={() => setScreen('payment')}>
                <CreditCard size={19} /> ดำเนินการชำระเงิน <ArrowRight size={18} />
              </button>
            </section>
          )}

          {screen === 'payment' && selectedCar && parkingCharge && (
            <section className="payment-screen">
              <button type="button" className="back-link" onClick={() => setScreen('details')}><ArrowLeft size={18} /> กลับไปดูรายละเอียด</button>
              <div className="page-title-block">
                <div className="section-kicker">SECURE PAYMENT</div>
                <h1>ชำระค่าจอดรถ</h1>
                <p>ตรวจสอบยอดเงินก่อนดำเนินการชำระ</p>
              </div>
              <div className="payment-total-card">
                <span>ยอดที่ต้องชำระ</span>
                <strong>{formatCurrency(parkingCharge.amount)} <small>บาท</small></strong>
                <div><CarFront size={15} /> {selectedCar.plate} <span>•</span> {selectedCar.brand}</div>
              </div>
              <div className="qr-payment-card">
                <div className="qr-card-heading"><div className="qr-heading-icon"><QrCode size={19} /></div><div><strong>PromptPay QR</strong><span>สแกนเพื่อชำระเงิน</span></div><span className="recommended-pill">แนะนำ</span></div>
                <div className="qr-placeholder"><QrCode size={154} strokeWidth={1.25} /><span>ตัวอย่าง QR Payment</span></div>
                <p className="qr-demo-note"><Info size={14} /> หน้านี้เป็นการจำลองการชำระเงินสำหรับทดสอบหน้าจอเท่านั้น</p>
              </div>
              <div className="payment-security-note"><ShieldCheck size={18} /><span>ตรวจสอบทะเบียนและยอดเงินให้ถูกต้องก่อนยืนยัน</span></div>
              <button type="button" className="primary-search-button confirm-payment-button" onClick={handlePaymentSuccess}>
                <CheckCircle2 size={19} /> จำลองการชำระเงินสำเร็จ
              </button>
              <button type="button" className="text-button" onClick={() => setScreen('details')}>ยกเลิกและกลับไปหน้ารายละเอียด</button>
            </section>
          )}

          {screen === 'success' && selectedCar && (
            <section className="success-screen">
              <div className="success-animation-icon"><CheckCircle2 size={46} /></div>
              <div className="section-kicker">PAYMENT COMPLETED</div>
              <h1>ชำระเงินสำเร็จ!</h1>
              <p className="success-subtitle">ขอบคุณที่ใช้บริการ Auto Parking</p>
              <div className="success-receipt-card">
                <div className="success-receipt-top"><span>ทะเบียนรถ</span><strong>{selectedCar.plate}</strong></div>
                <div className="success-receipt-row"><span>สถานที่</span><strong>{PARKING_LOCATION}</strong></div>
                <div className="success-receipt-row"><span>ตำแหน่งจอด</span><strong>{selectedCar.floor} · {selectedCar.slotId}</strong></div>
                <div className="success-receipt-row"><span>เวลาชำระ</span><strong>{formatDateTime(Date.now())}</strong></div>
                <div className="success-receipt-total"><span>ยอดชำระแล้ว</span><strong>{formatCurrency(paymentHistory[0]?.amount || 0)} บาท</strong></div>
              </div>
              <div className="grace-period-card">
                <div className="grace-period-heading"><Clock3 size={17} /><strong>เวลาสำหรับนำรถออกจากลานจอด</strong></div>
                <div className="grace-period-timer">{formatTimer(timeLeft)}</div>
                <p>กรุณานำรถออกภายใน 15 นาที หลังชำระเงิน</p>
              </div>
              {timeLeft === 0 && <div className="grace-expired-note"><AlertCircle size={16} /> หมดเวลาสำหรับนำรถออก กรุณาติดต่อเจ้าหน้าที่</div>}
              <button type="button" className="primary-search-button" onClick={goToSearch}>กลับสู่หน้าค้นหารถ <ArrowRight size={18} /></button>
            </section>
          )}

          {screen === 'history' && (
            <section className="history-screen">
              <div className="page-title-block history-title-block">
                <div className="section-kicker">PAYMENT RECORDS</div>
                <h1>ประวัติการชำระเงิน</h1>
                <p>รายการชำระเงินจากการใช้งานในอุปกรณ์นี้</p>
              </div>
              {paymentHistory.length === 0 ? (
                <div className="empty-history-card">
                  <div className="empty-history-icon"><History size={31} /></div>
                  <h2>ยังไม่มีประวัติการชำระเงิน</h2>
                  <p>เมื่อคุณชำระค่าจอดรถ รายการจะปรากฏที่หน้านี้</p>
                  <button type="button" className="secondary-action-button" onClick={showSearch}>ค้นหารถของฉัน <ArrowRight size={16} /></button>
                </div>
              ) : (
                <div className="history-list">
                  {paymentHistory.map((item) => (
                    <article className="history-item-card" key={item.id}>
                      <div className="history-item-top">
                        <div className="history-item-icon"><ReceiptText size={19} /></div>
                        <div className="history-item-title"><strong>{item.plate}</strong><span>{item.brand}</span></div>
                        <span className="paid-status"><CheckCircle2 size={13} /> สำเร็จ</span>
                      </div>
                      <div className="history-item-bottom"><span>{formatDateTime(item.paidAt)}</span><strong>{formatCurrency(item.amount)} บาท</strong></div>
                      <div className="history-item-location"><MapPin size={13} /> {item.location}</div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>

        <nav className="user-bottom-nav" aria-label="เมนูหลัก">
          <button type="button" className={activeTab === 'search' ? 'active' : ''} onClick={showSearch}>
            <Home size={20} strokeWidth={activeTab === 'search' ? 2.4 : 1.9} />
            <span>ค้นหารถ</span>
          </button>
          <button type="button" className={activeTab === 'history' ? 'active' : ''} onClick={showHistory}>
            <History size={20} strokeWidth={activeTab === 'history' ? 2.4 : 1.9} />
            <span>ประวัติชำระเงิน</span>
            {paymentHistory.length > 0 && <i className="history-count-dot" />}
          </button>
        </nav>
        <footer className="user-app-footer"><span>POWERED BY</span><strong>AUTO PARKING</strong><span>·</span><span>SMART PARKING PLATFORM</span></footer>
      </div>
    </div>
  );
}

function CircleHelpIcon() {
  return <span className="circle-help-mark">?</span>;
}
