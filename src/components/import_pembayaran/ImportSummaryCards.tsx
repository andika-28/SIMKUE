import React from 'react';
import { Upload, CheckCircle2, AlertTriangle, Wallet, FileText, ArrowUpRight } from 'lucide-react';
import { ImportSummaryStats } from '../../types';

interface ImportSummaryCardsProps {
  stats: ImportSummaryStats;
  onFilterStatus?: (status: string) => void;
}

export const ImportSummaryCards: React.FC<ImportSummaryCardsProps> = ({ stats, onFilterStatus }) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div id="section-import-summary-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* CARD 1: Total Import Bulan Ini */}
      <div
        id="card-summary-total-import"
        className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Import Bulan Ini
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalImportMonth.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-500">Transaksi</span>
            </h3>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                {stats.periodLabel}
              </span>
              <span className="text-[10px] text-slate-400">Total batch tercatat</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 group-hover:bg-[#064E3B] group-hover:text-white transition-all shadow-2xs">
            <Upload className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CARD 2: Total Nominal Import */}
      <div
        id="card-summary-nominal-import"
        className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Nominal Import
            </span>
            <h3 className="text-2xl font-black text-[#064E3B] tracking-tight">
              {formatRupiah(stats.totalNominalMonth)}
            </h3>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Bulan berjalan
              </span>
              <span className="text-[10px] text-slate-400">Kas masuk terdata</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 group-hover:bg-[#064E3B] group-hover:text-white transition-all shadow-2xs">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CARD 3: Berhasil Diproses */}
      <div
        id="card-summary-success-import"
        className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Berhasil Diproses
            </span>
            <h3 className="text-2xl font-black text-emerald-700 tracking-tight">
              {stats.berhasilCount.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-500">Transaksi</span>
            </h3>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                98% berhasil
              </span>
              <span className="text-[10px] text-slate-400">Lunas & rekonsiliasi</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CARD 4: Perlu Validasi */}
      <div
        id="card-summary-warning-import"
        className="bg-white rounded-xl border border-amber-200 p-4.5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group bg-amber-50/30"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Perlu Validasi
            </span>
            <h3 className="text-2xl font-black text-amber-900 tracking-tight">
              {stats.perluValidasiCount} <span className="text-xs font-semibold text-amber-700">Transaksi</span>
            </h3>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Perlu Pemeriksaan
              </span>
              <span className="text-[10px] text-amber-700/80">Data tidak cocok / duplikat</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
