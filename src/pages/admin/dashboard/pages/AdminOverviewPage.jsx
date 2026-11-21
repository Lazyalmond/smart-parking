import { PageHeading, StatCard, SectionCard, StatusBadge, formatNumber } from '../components/AdminShared.jsx';
import { Building2, CheckCircle2, CarFront, ChevronRight } from 'lucide-react';

export default function AdminOverviewPage(props) {
  const { isSuperAdmin, company, companyStats, companies, selectMenu, occupiedSlots, freeSlots, slots } = props;
  return (

    <div className="space-y-6">
      <PageHeading
        eyebrow={isSuperAdmin ? 'Platform overview' : 'Company overview'}
        title={isSuperAdmin ? 'ภาพรวมแพลตฟอร์ม' : `ภาพรวม ${company.name}`}
        description={isSuperAdmin
          ? 'ภาพรวมอาคารและลานจอดรถทั้งหมดที่อยู่บนระบบ Smart Parking'
          : 'ภาพรวมการดำเนินงานของอาคารและลานจอดรถในความดูแล'}
      />

      {isSuperAdmin ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="อาคารทั้งหมด" value={formatNumber(companyStats.totalCompanies)} hint="อาคารที่ลงทะเบียนในระบบ" icon={Building2} />
            <StatCard label="อาคารที่ใช้งาน" value={formatNumber(companyStats.activeCompanies)} hint="สถานะ Active" icon={CheckCircle2} tone="green" />
          </div>
          <SectionCard
            title="อาคารในระบบ"
            description="รายการอาคารตัวอย่างที่ใช้แพลตฟอร์ม Smart Parking"
            action={<button onClick={() => selectMenu('companies')} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1685F8] hover:text-[#0866C6]">ดูอาคารทั้งหมด <ChevronRight size={15} /></button>}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className="text-xs text-[#7A869A]">
                  <tr className="border-b border-[#E3E8EF]">
                    <th className="pb-3 font-medium">ชื่ออาคาร</th>
                    <th className="pb-3 font-medium">สาขา</th>
                    <th className="pb-3 font-medium">ลานจอด</th>
                    <th className="pb-3 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8EF]">
                  {companies.slice(0, 4).map((item) => (
                    <tr key={item.id}>
                      <td className="py-3.5">
                        <p className="font-semibold text-[#172B4D]">{item.name}</p>
                        <p className="mt-0.5 text-xs text-[#7A869A]">รหัส {item.code}</p>
                      </td>
                      <td className="py-3.5 text-[#5E6C84]">{item.branchCount}</td>
                      <td className="py-3.5 text-[#5E6C84]">{item.parkingLotCount}</td>
                      <td className="py-3.5"><StatusBadge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="ช่องจอดที่มีรถ" value={formatNumber(occupiedSlots)} hint="จากข้อมูลตัวอย่างปัจจุบัน" icon={CarFront} tone="amber" />
            <StatCard label="ช่องจอดว่าง" value={formatNumber(freeSlots)} hint="จากข้อมูลตัวอย่างปัจจุบัน" icon={CheckCircle2} tone="green" />
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
            <SectionCard title="สถานะช่องจอด" description="สรุปสถานะช่องจอดจากข้อมูลจำลอง">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[#F5F7FA] p-4">
                  <p className="text-xs text-[#5E6C84]">มีรถจอด</p>
                  <p className="mt-1 text-2xl font-bold text-[#172B4D]">{occupiedSlots}</p>
                </div>
                <div className="rounded-lg bg-[#F5F7FA] p-4">
                  <p className="text-xs text-[#5E6C84]">ว่าง</p>
                  <p className="mt-1 text-2xl font-bold text-[#1685F8]">{freeSlots}</p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E3E8EF]">
                <div className="h-full rounded-full bg-[#1685F8]" style={{ width: `${slots.length ? (occupiedSlots / slots.length) * 100 : 0}%` }} />
              </div>
              <p className="mt-2 text-xs text-[#7A869A]">อัตราการใช้ช่องจอด {slots.length ? Math.round((occupiedSlots / slots.length) * 100) : 0}%</p>
            </SectionCard>
            <SectionCard title="สถานะอาคาร">
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 size={15} />
                <span>{company.status === 'active' ? 'อาคารกำลังใช้งานระบบ' : 'อาคารไม่ได้ใช้งาน'}</span>
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
