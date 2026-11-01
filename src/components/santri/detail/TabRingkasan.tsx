import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Receipt,
  FileSpreadsheet,
  Calendar,
  CreditCard,
  Building,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DetailedBill, FinancialTimelineActivity, Student } from '../../../types';
import { formatRupiah } from '../../../data/initialData';

interface TabRingkasanProps {
  student: Student;
  bills: DetailedBill[];
  activities: FinancialTimelineActivity[];
  onOpenBillDetail: (bill: DetailedBill) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const TabRingkasan: React.FC<TabRingkasanProps> = ({
  student,
  bills,
  activities,
  onOpenBillDetail,
  onNavigateToTab,
}) => {
  // Donut chart data
  const totalTagihan = 8500000;
  const sudahDibayar = 7650000;
  const belumDibayar = 850000;
  const percentPaid = Math.round((sudahDibayar / totalTagihan) * 100);

  const chartData = [
    { name: 'Sudah Dibayar', value: sudahDibayar, color: '#064E3B' }, // Deep Emerald
    { name: 'Belum Dibayar', value: belumDibayar, color: '#F59E0B' }, // Amber warning
  ];

  // Specific bills to highlight
  const agustusBill = bills.find((b) => b.periode.includes('Agustus 2026')) || bills[0];
  const septemberBill = bills.find((b) => b.periode.includes('September 2026')) || bills[1];
  const uangKertas = bills.find((b) => b.rincian.includes('Uang Kertas')) || bills[2];
  const uangKegiatan = bills.find((b) => b.rincian.includes('Uang Kegiatan')) || bills[3];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-150">
      
      {/* ========================================================= */}
      {/* LEFT COLUMN: Status Tagihan (7 cols)                       */}
      {/* ========================================================= */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
          
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
                Status Tagihan
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Kewajiban tagihan bulanan dan tahunan santri periode aktif.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('Tagihan')}
              className="text-xs font-semibold text-[#064E3B] hover:underline flex items-center gap-1"
            >
              <span>Semua Tagihan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            
            {/* 1. MONTHLY BILL: Agustus 2026 (LUNAS) */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 transition hover:shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                      Tagihan Bulanan
                    </span>
                    <span className="text-[#CBD5E1]">•</span>
                    <h4 className="text-sm font-bold text-[#1E293B]">
                      Agustus 2026
                    </h4>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    SPP + Makan + Listrik & Air
                  </p>
                </div>

                {/* Green Status Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#064E3B] border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  LUNAS
                </span>
              </div>

              {/* Breakdown numbers */}
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-emerald-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-[#64748B] block">SPP</span>
                  <span className="font-semibold text-[#1E293B]">Rp200.000</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Uang Makan</span>
                  <span className="font-semibold text-[#1E293B]">Rp600.000</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Listrik & Air</span>
                  <span className="font-semibold text-[#1E293B]">Rp50.000</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] block font-bold">Total</span>
                  <span className="font-extrabold text-[#064E3B]">Rp850.000</span>
                </div>
              </div>
            </div>

            {/* 2. MONTHLY BILL: September 2026 (BELUM LUNAS) */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 transition hover:shadow-xs relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Tagihan Bulanan
                    </span>
                    <span className="text-amber-300">•</span>
                    <h4 className="text-sm font-bold text-[#1E293B]">
                      September 2026
                    </h4>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Jatuh tempo: <strong className="text-amber-900 font-semibold">10 September 2026</strong>
                  </p>
                </div>

                {/* Amber/Red Warning Styling */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  BELUM LUNAS
                </span>
              </div>

              {/* Breakdown numbers */}
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-amber-200/80 text-xs">
                <div>
                  <span className="text-[10px] text-[#64748B] block">SPP</span>
                  <span className="font-semibold text-[#1E293B]">Rp200.000</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Uang Makan</span>
                  <span className="font-semibold text-[#1E293B]">Rp600.000</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Listrik & Air</span>
                  <span className="font-semibold text-[#1E293B]">Rp50.000</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-900 block font-bold">Total</span>
                  <span className="font-extrabold text-amber-900">Rp850.000</span>
                </div>
              </div>

              {/* Button: Lihat Detail Tagihan → */}
              <div className="mt-3 pt-2 flex items-center justify-end">
                <button
                  id="btn-lihat-detail-september"
                  onClick={() => onOpenBillDetail(septemberBill)}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs active:scale-98"
                >
                  <span>Lihat Detail Tagihan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. ANNUAL BILL: Uang Kertas (Semester Ganjil - LUNAS) */}
            <div className="rounded-xl border border-[#E2E8F0] p-3.5 flex items-center justify-between hover:bg-[#F8FAFC] transition">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 text-[#064E3B]">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-[#1E293B]">
                      Uang Kertas
                    </h5>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                      Semester Ganjil
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Biaya cetak modul & naskah ujian
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <span className="text-xs font-bold text-[#1E293B]">
                  Rp250.000
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#064E3B] border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  LUNAS
                </span>
              </div>
            </div>

            {/* 4. ANNUAL BILL: Uang Kegiatan (Semester Ganjil - LUNAS) */}
            <div className="rounded-xl border border-[#E2E8F0] p-3.5 flex items-center justify-between hover:bg-[#F8FAFC] transition">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 text-[#064E3B]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-[#1E293B]">
                      Uang Kegiatan
                    </h5>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                      Semester Ganjil
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Ekstrakurikuler, kepramukaan & bahasa
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <span className="text-xs font-bold text-[#1E293B]">
                  Rp200.000
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#064E3B] border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  LUNAS
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Donut Chart + Timeline (5 cols)              */}
      {/* ========================================================= */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Ringkasan Pembayaran Donut */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
            <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
              Ringkasan Pembayaran
            </h3>
            <span className="text-xs font-medium text-[#64748B]">
              T.A 2026/2027
            </span>
          </div>

          {/* Donut Chart Container */}
          <div className="relative h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-black text-[#064E3B] leading-none">
                {percentPaid}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mt-1">
                Tagihan Terbayar
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E2E8F0] mt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#064E3B] flex-shrink-0" />
              <div>
                <span className="text-[10px] text-[#64748B] block">Sudah Dibayar</span>
                <span className="text-xs font-bold text-[#1E293B]">
                  {formatRupiah(sudahDibayar)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-amber-500 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-[#64748B] block">Belum Dibayar</span>
                <span className="text-xs font-bold text-amber-700">
                  {formatRupiah(belumDibayar)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Aktivitas Keuangan Terakhir (Timeline Style) */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
            <h3 className="text-sm font-bold text-[#1E293B] tracking-tight">
              Aktivitas Keuangan Terakhir
            </h3>
            <button
              onClick={() => onNavigateToTab('Riwayat Pembayaran')}
              className="text-[11px] font-semibold text-[#064E3B] hover:underline"
            >
              Lihat Riwayat
            </button>
          </div>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => {
              const isSuccess = act.status === 'Berhasil';
              const isPending = act.status === 'Menunggu Pembayaran';

              return (
                <div key={act.id} className="relative group">
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      isSuccess
                        ? 'bg-[#064E3B]'
                        : isPending
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-medium text-[#94A3B8] block">
                        {act.tanggal}
                      </span>
                      <p className="text-xs font-semibold text-[#1E293B] mt-0.5">
                        {act.keterangan}
                      </p>
                      <span
                        className={`inline-block text-[10px] font-bold mt-1 px-1.5 py-0.2 rounded ${
                          isSuccess
                            ? 'bg-emerald-50 text-[#064E3B]'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        Status: {act.status}
                      </span>
                    </div>

                    <div className="text-right font-mono text-xs font-bold text-[#1E293B]">
                      {formatRupiah(act.nominal)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
