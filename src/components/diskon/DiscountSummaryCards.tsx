import React from 'react';
import { Tag, Sparkles, Users, TrendingUp } from 'lucide-react';
import { DiscountKPIStats } from '../../types';

interface DiscountSummaryCardsProps {
  kpi: DiscountKPIStats;
  selectedStatus?: string;
  onFilterByStatus?: (status: string) => void;
}

export const DiscountSummaryCards: React.FC<DiscountSummaryCardsProps> = ({
  kpi,
  selectedStatus,
  onFilterByStatus,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* CARD 1: Total Diskon Bulan Ini */}
      <div
        id="card-kpi-total-diskon-bulan-ini"
        className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B]">
              Total Diskon Bulan Ini
            </span>
            <h3 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              {formatRupiah(kpi.totalDiskonBulanIni)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-100 flex-shrink-0">
            <Tag className="w-5 h-5 text-[#064E3B]" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">Periode Aktif:</span>
          <span className="font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {kpi.periodeBulanIni}
          </span>
        </div>
      </div>

      {/* CARD 2: Jumlah Diskon Aktif */}
      <div
        id="card-kpi-jumlah-diskon-aktif"
        onClick={() => onFilterByStatus && onFilterByStatus('Aktif')}
        className={`bg-white rounded-xl p-5 border shadow-xs flex flex-col justify-between transition-all cursor-pointer ${
          selectedStatus === 'Aktif'
            ? 'border-[#064E3B] ring-2 ring-emerald-100'
            : 'border-[#E2E8F0] hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B]">
              Jumlah Diskon Aktif
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-extrabold text-[#064E3B] tracking-tight">
                {kpi.jumlahDiskonAktif} Diskon
              </h3>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#064E3B]" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">Status Penggunaan:</span>
          <span className="font-semibold text-emerald-800 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Untuk periode aktif
          </span>
        </div>
      </div>

      {/* CARD 3: Santri Terdampak */}
      <div
        id="card-kpi-santri-terdampak"
        className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B]">
              Santri Terdampak
            </span>
            <h3 className="text-2xl font-extrabold text-blue-700 tracking-tight">
              {kpi.santriTerdampakBulanIni} Santri
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 flex-shrink-0">
            <Users className="w-5 h-5 text-blue-700" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">Cakupan Santri:</span>
          <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Menerima diskon
          </span>
        </div>
      </div>

      {/* CARD 4: Total Diskon Tahun Ini */}
      <div
        id="card-kpi-total-diskon-tahun-ini"
        className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#64748B]">
              Total Diskon Tahun Ini
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatRupiah(kpi.totalDiskonTahunIni)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200 flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-amber-700" />
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">Akumulasi:</span>
          <span className="font-bold text-slate-700">
            Tahun Ajaran {kpi.tahunAjaran}
          </span>
        </div>
      </div>
    </div>
  );
};
