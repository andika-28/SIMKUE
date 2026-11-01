import React from 'react';
import {
  TrendingDown,
  Calendar,
  Layers,
  Utensils,
  Receipt,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { ExpenseKpiSummary } from '../../types';

interface ExpenseKpiCardsProps {
  summary: ExpenseKpiSummary;
  onFilterCategory?: (cat: string) => void;
  onFilterToday?: () => void;
}

export const ExpenseKpiCards: React.FC<ExpenseKpiCardsProps> = ({
  summary,
  onFilterCategory,
  onFilterToday,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp ');
  };

  return (
    <div id="expense-kpi-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Pengeluaran Bulan Ini */}
      <div
        id="card-total-pengeluaran-bulan"
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-rose-50/70 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Pengeluaran Bulan Ini
            </span>
            <div className="text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight">
              {formatRupiah(summary.totalPengeluaranBulanIni)}
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                <Calendar className="w-3 h-3 text-slate-500" />
                {summary.periodLabel}
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Sesuai Anggaran
              </span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100 shadow-2xs group-hover:scale-105 transition-transform">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 2: Pengeluaran Hari Ini */}
      <div
        id="card-pengeluaran-hari-ini"
        onClick={onFilterToday}
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-blue-50/70 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Pengeluaran Hari Ini
            </span>
            <div className="text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight">
              {formatRupiah(summary.pengeluaranHariIni)}
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {summary.pengeluaranHariIniCount} transaksi dicatat
              </span>
              <span className="text-[10px] text-slate-400">1 September 2026</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shadow-2xs group-hover:scale-105 transition-transform">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 3: Pengeluaran Terbesar */}
      <div
        id="card-pengeluaran-terbesar"
        onClick={() => onFilterCategory && onFilterCategory(summary.pengeluaranTerbesarKategori)}
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-50/70 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pengeluaran Terbesar
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-amber-900 block truncate max-w-[140px]">
                {summary.pengeluaranTerbesarKategori}
              </span>
            </div>
            <div className="text-xl font-black text-slate-900 tracking-tight">
              {formatRupiah(summary.pengeluaranTerbesarNominal)}
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              {summary.totalPengeluaranBulanIni > 0
                ? `Bulan berjalan (${Math.round(
                    (summary.pengeluaranTerbesarNominal / summary.totalPengeluaranBulanIni) * 100
                  )}% dari total)`
                : 'Belum ada pengeluaran'}
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shadow-2xs group-hover:scale-105 transition-transform">
            <Utensils className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 4: Transaksi Pengeluaran */}
      <div
        id="card-total-transaksi"
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50/70 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Transaksi Pengeluaran
            </span>
            <div className="text-2xl lg:text-[26px] font-black text-[#064E3B] tracking-tight">
              {summary.totalTransaksiCount}{' '}
              <span className="text-sm font-semibold text-slate-500 font-sans">Transaksi</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {summary.totalTransaksiCount > 0 ? 'Tertib Administrasi' : 'Buku Kas Bersih'}
              </span>
              <span className="text-[10px] text-slate-400">{summary.periodLabel}</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-100 shadow-2xs group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
