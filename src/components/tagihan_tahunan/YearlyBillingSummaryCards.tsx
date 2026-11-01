import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
  Receipt,
  AlertTriangle,
} from 'lucide-react';
import { YearlyBillingSummary } from '../../types';

interface YearlyBillingSummaryCardsProps {
  summary: YearlyBillingSummary;
  onFilterByStatus?: (status: string) => void;
  selectedFilterStatus?: string;
}

export const YearlyBillingSummaryCards: React.FC<YearlyBillingSummaryCardsProps> = ({
  summary,
  onFilterByStatus,
  selectedFilterStatus,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  // Circular progress calculation for Card 2
  const percentage = Math.min(100, Math.max(0, summary.persentasePembayaran));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* CARD 1: Total Tagihan Tahunan */}
      <div
        id="card-yearly-total"
        onClick={() => onFilterByStatus && onFilterByStatus('Semua Status')}
        className={`bg-white rounded-xl p-5 border transition-all cursor-pointer ${
          selectedFilterStatus === 'Semua Status' || !selectedFilterStatus
            ? 'border-slate-300 shadow-xs ring-1 ring-slate-200'
            : 'border-[#E2E8F0] shadow-xs hover:border-slate-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Total Tagihan Tahunan
            </p>
            <h3 className="text-2xl font-black text-[#0F172A] mt-1 tracking-tight">
              {formatRupiah(summary.totalTagihanNominal)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#064E3B] flex items-center justify-center flex-shrink-0 border border-slate-200">
            <Receipt className="w-5 h-5 text-[#064E3B]" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
          <span className="font-medium text-slate-700">Tahun Ajaran {summary.tahunAjaran}</span>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold text-[11px]">
            {summary.totalSantri} Santri
          </span>
        </div>
      </div>

      {/* CARD 2: Sudah Dibayar */}
      <div
        id="card-yearly-paid"
        onClick={() => onFilterByStatus && onFilterByStatus('Lunas')}
        className={`bg-white rounded-xl p-5 border transition-all cursor-pointer group ${
          selectedFilterStatus === 'Lunas'
            ? 'border-emerald-400 bg-emerald-50/20 shadow-xs ring-2 ring-emerald-500/20'
            : 'border-emerald-200/80 shadow-xs hover:border-emerald-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Sudah Dibayar
              </p>
            </div>
            <h3 className="text-2xl font-black text-emerald-950 mt-1 tracking-tight">
              {formatRupiah(summary.sudahDibayarNominal)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200 group-hover:bg-emerald-100 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-800">
            {percentage}% dari total tagihan
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            {summary.santriLunasCount} Santri Lunas
          </span>
        </div>
      </div>

      {/* CARD 3: Sisa Tagihan */}
      <div
        id="card-yearly-remaining"
        onClick={() => onFilterByStatus && onFilterByStatus('Belum Dibayar')}
        className={`bg-white rounded-xl p-5 border transition-all cursor-pointer group ${
          selectedFilterStatus === 'Belum Dibayar'
            ? 'border-rose-400 bg-rose-50/20 shadow-xs ring-2 ring-rose-500/20'
            : 'border-rose-200/80 shadow-xs hover:border-rose-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Sisa Tagihan
              </p>
            </div>
            <h3 className="text-2xl font-black text-rose-950 mt-1 tracking-tight">
              {formatRupiah(summary.sisaTagihanNominal)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center flex-shrink-0 border border-rose-200 group-hover:bg-rose-100 transition-colors">
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-rose-50 flex items-center justify-between text-xs">
          <span className="font-bold text-rose-800">Belum diselesaikan</span>
          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
            {100 - percentage}% Piutang
          </span>
        </div>
      </div>

      {/* CARD 4: Santri Belum Lunas */}
      <div
        id="card-yearly-unpaid-students"
        onClick={() => onFilterByStatus && onFilterByStatus('Sebagian')}
        className={`bg-white rounded-xl p-5 border transition-all cursor-pointer group ${
          selectedFilterStatus === 'Sebagian'
            ? 'border-amber-400 bg-amber-50/20 shadow-xs ring-2 ring-amber-500/20'
            : 'border-amber-200/80 shadow-xs hover:border-amber-300'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Santri Belum Lunas
              </p>
            </div>
            <h3 className="text-2xl font-black text-amber-950 mt-1 tracking-tight">
              {summary.santriBelumLunasCount} Santri
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200 group-hover:bg-amber-100 transition-colors">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-amber-50 flex items-center justify-between text-xs">
          <span className="font-bold text-amber-800">Memiliki sisa tagihan</span>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            {summary.santriSebagianCount} Sebagian / {summary.santriBelumBayarCount} Belum
          </span>
        </div>
      </div>
    </div>
  );
};
