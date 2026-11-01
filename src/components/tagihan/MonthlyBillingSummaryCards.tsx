import React from 'react';
import { FileText, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { MonthlyBillingSummary } from '../../types';

interface MonthlyBillingSummaryCardsProps {
  summary: MonthlyBillingSummary;
  onFilterByStatus?: (status: string) => void;
}

export const MonthlyBillingSummaryCards: React.FC<MonthlyBillingSummaryCardsProps> = ({
  summary,
  onFilterByStatus,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  // Circular progress stroke calculation
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, summary.persentasePembayaran));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Total Tagihan Bulan Ini */}
      <div
        id="card-total-tagihan"
        className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Total Tagihan Bulan Ini
            </p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-1 tracking-tight">
              {formatRupiah(summary.totalTagihanNominal)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 border border-slate-200">
            <FileText className="w-5 h-5 text-[#064E3B]" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
          <span className="font-medium text-slate-700">{summary.periode}</span>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
            {summary.totalTagihanSantri} Santri Terdaftar
          </span>
        </div>
      </div>

      {/* Card 2: Sudah Lunas */}
      <div
        id="card-tagihan-lunas"
        onClick={() => onFilterByStatus && onFilterByStatus('Lunas')}
        className="bg-white rounded-xl p-5 border border-emerald-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Sudah Lunas
              </p>
            </div>
            <h3 className="text-2xl font-bold text-emerald-950 mt-1 tracking-tight">
              {formatRupiah(summary.lunasNominal)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200 group-hover:bg-emerald-100 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-emerald-50 flex items-center justify-between text-xs">
          <span className="font-medium text-emerald-800">{summary.lunasSantriCount} Santri</span>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Terverifikasi Lunas
          </span>
        </div>
      </div>

      {/* Card 3: Belum Lunas */}
      <div
        id="card-tagihan-belum-lunas"
        onClick={() => onFilterByStatus && onFilterByStatus('Belum Lunas')}
        className="bg-white rounded-xl p-5 border border-rose-200 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Belum Lunas
              </p>
            </div>
            <h3 className="text-2xl font-bold text-rose-950 mt-1 tracking-tight">
              {formatRupiah(summary.belumLunasNominal)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center flex-shrink-0 border border-rose-200 group-hover:bg-rose-100 transition-colors">
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-rose-50 flex items-center justify-between text-xs">
          <span className="font-semibold text-rose-800">{summary.belumLunasSantriCount} Santri</span>
          <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
            Perlu Penagihan
          </span>
        </div>
      </div>

      {/* Card 4: Persentase Pembayaran */}
      <div
        id="card-persentase-pembayaran"
        className="bg-white rounded-xl p-5 border border-emerald-300 shadow-xs flex flex-col justify-between relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Persentase Pembayaran
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h3 className="text-2xl font-bold text-[#064E3B] tracking-tight">
                {summary.persentasePembayaran.toFixed(1).replace('.', ',')}%
              </h3>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
                Target 100%
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1 font-medium">Tagihan bulan ini</p>
          </div>

          {/* Circular Progress Gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-slate-100"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-[#064E3B] transition-all duration-1000 ease-out"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-bold text-[#064E3B]">
                {Math.round(summary.persentasePembayaran)}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Lunas: <strong>{summary.lunasSantriCount}</strong></span>
          <span>Sisa: <strong>{summary.belumLunasSantriCount}</strong> santri</span>
        </div>
      </div>
    </div>
  );
};
