import { PageHeading, StatCard, SectionCard } from '../components/AdminShared.jsx';
import { CarFront, CheckCircle2, CreditCard, Search } from 'lucide-react';

export default function AdminVehiclesPage(props) {
  const { vehicles, vehicleSearch, setVehicleSearch, filteredVehicles, visibleVehicles, vehiclePage, setVehiclePage, vehiclePageSize, vehiclePageCount } = props;
  return (

    <div className="space-y-6">
      <PageHeading eyebrow="Vehicle lookup" title="ค้นหาทะเบียนรถ" description="ค้นหารถจากทะเบียน รุ่นรถ หรือรหัสช่องจอดในข้อมูลตัวอย่าง" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><StatCard label="รถในระบบ" value={vehicles.length} icon={CarFront} /><StatCard label="ชำระเงินแล้ว" value={vehicles.filter((car) => car.paid).length} icon={CheckCircle2} tone="green" /><StatCard label="รอชำระเงิน" value={vehicles.filter((car) => !car.paid).length} icon={CreditCard} tone="amber" /></div>
      <SectionCard title="ค้นหารถ" description="พิมพ์ทะเบียนรถ เช่น 1กก9999 โดยไม่ต้องใส่ขีดก็ได้">
        <div className="relative max-w-xl"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A869A]" /><input value={vehicleSearch} onChange={(event) => { setVehicleSearch(event.target.value); setVehiclePage(1); }} placeholder="กรอกทะเบียนรถ เช่น 1กก9999" className="w-full rounded-lg border border-[#E3E8EF] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#1685F8]" /></div>
        <div className="mt-3 flex items-center justify-between gap-3"><p className="text-xs text-[#7A869A]">ค้นหาได้จากทะเบียน รุ่นรถ ชั้นจอด และรหัสช่องจอด</p><span className="shrink-0 text-xs font-semibold text-[#1685F8]">พบ {filteredVehicles.length} รายการ</span></div>
      </SectionCard>
      <SectionCard title="ผลการค้นหา" description="สถานะรถและข้อมูลการจอด">
        <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-[#F5F7FA] text-xs text-[#5E6C84]"><tr><th className="rounded-l-lg px-3 py-3">ทะเบียนรถ</th><th className="px-3 py-3">จังหวัด</th><th className="px-3 py-3">รุ่นรถ</th><th className="px-3 py-3">ชั้น / ช่องจอด</th><th className="px-3 py-3">เวลาเข้า</th><th className="px-3 py-3">อัตราค่าจอด</th><th className="rounded-r-lg px-3 py-3">การชำระเงิน</th></tr></thead><tbody className="divide-y divide-[#E3E8EF]">{visibleVehicles.map((car) => <tr key={car.id} className="hover:bg-[#F9FBFD]"><td className="px-3 py-3.5 font-semibold text-[#172B4D]">{car.plate}</td><td className="px-3 py-3.5 text-[#5E6C84]">{car.province || 'ไม่ระบุจังหวัด'}</td><td className="px-3 py-3.5 text-[#5E6C84]">{car.brand}</td><td className="px-3 py-3.5 text-[#5E6C84]">{car.floor} / {car.slotId}</td><td className="px-3 py-3.5 text-[#5E6C84]">{car.entryTime} น.</td><td className="px-3 py-3.5 text-[#5E6C84]">{car.hourlyRate} บาท/ชม.</td><td className="px-3 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${car.paid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{car.paid ? 'ชำระแล้ว' : 'รอชำระเงิน'}</span></td></tr>)}{filteredVehicles.length === 0 && <tr><td colSpan="7" className="py-10 text-center text-sm text-[#7A869A]">ไม่พบทะเบียนที่ตรงกัน</td></tr>}</tbody></table></div>
        <div className="mt-4 flex flex-col gap-3 border-t border-[#E3E8EF] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#7A869A]">แสดง {filteredVehicles.length === 0 ? 0 : (vehiclePage - 1) * vehiclePageSize + 1}–{Math.min(vehiclePage * vehiclePageSize, filteredVehicles.length)} จาก {filteredVehicles.length} คัน</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setVehiclePage((page) => Math.max(1, page - 1))} disabled={vehiclePage === 1} className="rounded-lg border border-[#E3E8EF] px-3 py-2 text-xs font-semibold text-[#5E6C84] hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-40">ก่อนหน้า</button>
            <span className="min-w-16 text-center text-xs text-[#5E6C84]">หน้า {vehiclePage} / {vehiclePageCount}</span>
            <button onClick={() => setVehiclePage((page) => Math.min(vehiclePageCount, page + 1))} disabled={vehiclePage >= vehiclePageCount} className="rounded-lg border border-[#E3E8EF] px-3 py-2 text-xs font-semibold text-[#5E6C84] hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-40">ถัดไป</button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
