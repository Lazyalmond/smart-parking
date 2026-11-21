import { PageHeading, StatCard, SectionCard } from '../components/AdminShared.jsx';
import { CarFront, CheckCircle2, Plus, Zap, X, Trash2 } from 'lucide-react';

export default function AdminParkingMapPage(props) {
  const { canManageParkingSlots, slots, selectedFloor, setSelectedFloor, slotForm, setSlotForm, slotFilter, setSlotFilter, occupiedSlots, freeSlots, slotModalOpen, setSlotModalOpen, handleAddParkingSlots, handleDeleteParkingSlot, handleToggleParkingSlotEV } = props;

    const floorOptions = [...new Set([...slots.map((slot) => slot.floor), 'FL1', 'FL2'])].filter(Boolean).sort();
    const floorSlots = slots.filter((slot) => slot.floor === selectedFloor);
    const visibleSlots = floorSlots.filter((slot) => {
      if (slotFilter === 'occupied') return slot.occupied;
      if (slotFilter === 'available') return !slot.occupied;
      if (slotFilter === 'ev') return slot.isEV;
      return true;
    });
    const occupiedOnFloor = floorSlots.filter((slot) => slot.occupied).length;
    const availableOnFloor = floorSlots.length - occupiedOnFloor;
    const splitIndex = Math.ceil(visibleSlots.length / 2);
    const topRow = visibleSlots.slice(0, splitIndex);
    const bottomRow = visibleSlots.slice(splitIndex);

    const renderBay = (slot) => (
      <div key={slot.id} className={`relative flex min-h-[142px] flex-col justify-between rounded-xl border p-3 transition ${slot.occupied ? 'border-slate-300 bg-white' : 'border-[#B9D9FA] bg-[#F2F8FF]'}`}>
        <div className="flex items-center justify-between gap-2"><span className="font-sans text-sm font-bold text-[#172B4D]">{slot.id}</span><div className="flex items-center gap-1">{slot.isEV && <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#1685F8]"><Zap size={11} /> EV</span>}{canManageParkingSlots && <><button type="button" onClick={() => handleToggleParkingSlotEV(slot.id)} className={`rounded-md p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1685F8] ${slot.isEV ? 'text-[#1685F8] hover:bg-[#EAF3FF]' : 'text-[#7A869A] hover:bg-[#F5F7FA]'}`} aria-label={`${slot.isEV ? 'ยกเลิก EV' : 'กำหนดเป็น EV'} ${slot.id}`} title={slot.isEV ? 'ยกเลิกช่อง EV' : 'กำหนดเป็นช่อง EV'}><Zap size={15} /></button><button type="button" onClick={() => handleDeleteParkingSlot(slot.id)} className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400" aria-label={`ลบช่องจอด ${slot.id}`} title={`ลบช่องจอด ${slot.id}`}><Trash2 size={15} /></button></>}</div></div>
        <div className="flex justify-center py-2"><div className={`flex h-16 w-12 items-center justify-center rounded-xl border ${slot.occupied ? 'border-slate-300 bg-slate-100 text-slate-500' : 'border-[#B9D9FA] bg-white text-[#1685F8]'}`}><CarFront size={32} strokeWidth={1.7} /></div></div>
        <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5E6C84]"><span className={`h-2 w-2 rounded-full ${slot.occupied ? 'bg-slate-500' : 'bg-[#1685F8]'}`} />{slot.occupied ? 'มีรถจอด' : 'ว่าง'}</span><span className="text-[10px] text-[#A0AAB8]">{slot.occupied ? 'Occupied' : 'Available'}</span></div>
      </div>
    );

    return (
      <div className="space-y-6">
        <PageHeading eyebrow="Parking operations" title="ผังสถานะช่องจอด" description="ดูตำแหน่งช่องจอด แยกตามชั้นและกรองสถานะได้" action={canManageParkingSlots ? <button onClick={() => { setSlotForm({ floor: selectedFloor, count: 4, isEV: false }); setSlotModalOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#1685F8] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#0866C6]"><Plus size={16} /> เพิ่มช่องจอด</button> : null} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><StatCard label="ช่องจอดทั้งหมด" value={slots.length} icon={CarFront} /><StatCard label="มีรถจอด" value={occupiedSlots} icon={CarFront} tone="amber" /><StatCard label="ช่องจอดว่าง" value={freeSlots} icon={CheckCircle2} tone="green" /></div>
        <SectionCard title="เลือกพื้นที่จอดรถ" description="เลือกชั้นและกรองช่องจอดตามสถานะ">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">{floorOptions.map((floor) => <button key={floor} onClick={() => { setSelectedFloor(floor); setSlotForm((previous) => ({ ...previous, floor })); }} className={`rounded-lg border px-4 py-2 text-sm font-semibold ${selectedFloor === floor ? 'border-[#1685F8] bg-[#1685F8] text-white' : 'border-[#E3E8EF] bg-white text-[#5E6C84] hover:bg-[#F5F7FA]'}`}>{floor === 'FL1' ? 'ชั้น 1' : floor === 'FL2' ? 'ชั้น 2' : floor}</button>)}</div>
            <div className="flex flex-wrap gap-1 rounded-lg border border-[#E3E8EF] bg-[#F5F7FA] p-1">{[{ id: 'all', label: 'ทั้งหมด' }, { id: 'occupied', label: 'มีรถจอด' }, { id: 'available', label: 'ว่าง' }, { id: 'ev', label: 'EV' }].map((filter) => <button key={filter.id} onClick={() => setSlotFilter(filter.id)} className={`rounded-md px-3 py-2 text-xs font-semibold ${slotFilter === filter.id ? 'bg-white text-[#1685F8] shadow-sm' : 'text-[#5E6C84]'}`}>{filter.label}</button>)}</div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-lg bg-[#F5F7FA] p-3"><p className="text-xs text-[#7A869A]">ช่องจอดในชั้นนี้</p><p className="mt-1 text-xl font-bold text-[#172B4D]">{floorSlots.length}</p></div><div className="rounded-lg bg-[#F5F7FA] p-3"><p className="text-xs text-[#7A869A]">มีรถจอด</p><p className="mt-1 text-xl font-bold text-slate-600">{occupiedOnFloor}</p></div><div className="rounded-lg bg-[#F5F7FA] p-3"><p className="text-xs text-[#7A869A]">ว่างพร้อมจอด</p><p className="mt-1 text-xl font-bold text-[#1685F8]">{availableOnFloor}</p></div></div>
        </SectionCard>
        <SectionCard title={`แผนผังลานจอด — ${selectedFloor === 'FL1' ? 'ชั้น 1' : selectedFloor === 'FL2' ? 'ชั้น 2' : selectedFloor}`} description="สัญลักษณ์รถแสดงช่องที่มีรถจอด ส่วนช่องสีฟ้าอ่อนคือช่องว่าง">
          <div className="rounded-xl border border-dashed border-[#C9D7E6] bg-[#F8FAFC] p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between text-[11px] text-[#7A869A]"><span>ทางเข้าพื้นที่จอด</span><span>ข้อมูลตัวอย่าง · {visibleSlots.length} ช่องที่แสดง</span></div>
            {visibleSlots.length === 0 ? <p className="py-12 text-center text-sm text-[#7A869A]">ไม่พบช่องจอดตามตัวกรองนี้</p> : <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{topRow.map(renderBay)}</div>
              {bottomRow.length > 0 && <div className="my-4 flex items-center justify-center border-y border-dashed border-[#B9C8D8] bg-white py-3 text-xs font-semibold tracking-wide text-[#7A869A]"><span className="mr-2">↔</span> ช่องทางสัญจรรถ <span className="ml-2">↔</span></div>}
              {bottomRow.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{bottomRow.map(renderBay)}</div>}
            </>}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#E3E8EF] pt-3 text-[11px] text-[#5E6C84]"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> มีรถจอด</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#1685F8]" /> ว่าง</span><span className="flex items-center gap-1.5"><Zap size={12} className="text-[#1685F8]" /> ช่อง EV</span></div>
          </div>
        </SectionCard>

        {canManageParkingSlots && slotModalOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label="เพิ่มช่องจอด"><form onSubmit={handleAddParkingSlots} className="w-full max-w-md rounded-2xl border border-[#E3E8EF] bg-white shadow-xl"><div className="flex items-center justify-between border-b border-[#E3E8EF] px-5 py-4"><div><h2 className="text-base font-bold text-[#172B4D]">เพิ่มช่องจอด</h2><p className="mt-1 text-xs text-[#7A869A]">ระบบจะสร้างรหัสช่องจอดต่อจากรายการเดิมให้อัตโนมัติ</p></div><button type="button" onClick={() => setSlotModalOpen(false)} className="rounded-lg p-2 text-[#7A869A] hover:bg-[#F5F7FA]" aria-label="ปิด"><X size={18} /></button></div><div className="space-y-4 p-5"><label className="block space-y-1.5"><span className="text-xs font-semibold text-[#5E6C84]">ชั้นจอดรถ</span><select value={slotForm.floor} onChange={(event) => setSlotForm({ ...slotForm, floor: event.target.value })} className="w-full rounded-lg border border-[#E3E8EF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1685F8]"><option value="FL1">ชั้น 1 (FL1)</option><option value="FL2">ชั้น 2 (FL2)</option></select></label><label className="block space-y-1.5"><span className="text-xs font-semibold text-[#5E6C84]">จำนวนช่องจอดที่ต้องการเพิ่ม</span><input type="number" min="1" max="100" required value={slotForm.count} onChange={(event) => setSlotForm({ ...slotForm, count: event.target.value })} className="w-full rounded-lg border border-[#E3E8EF] px-3 py-2.5 text-sm outline-none focus:border-[#1685F8]" /></label><label className="flex items-center gap-2 rounded-lg border border-[#E3E8EF] p-3 text-sm text-[#5E6C84]"><input type="checkbox" checked={slotForm.isEV} onChange={(event) => setSlotForm({ ...slotForm, isEV: event.target.checked })} className="h-4 w-4 accent-[#1685F8]" />กำหนดเป็นช่องจอดรถ EV ทั้งหมด</label><p className="text-xs leading-5 text-[#7A869A]">รหัสช่องจอดจะเริ่มจากหมายเลขถัดไป เช่น A-05 สำหรับชั้น 1 หรือ B-05 สำหรับชั้น 2</p></div><div className="flex justify-end gap-2 border-t border-[#E3E8EF] px-5 py-4"><button type="button" onClick={() => setSlotModalOpen(false)} className="rounded-lg border border-[#E3E8EF] px-4 py-2.5 text-sm font-semibold text-[#5E6C84]">ยกเลิก</button><button type="submit" className="rounded-lg bg-[#1685F8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0866C6]">เพิ่มช่องจอด</button></div></form></div>}
      </div>
    );
}
