import React from 'react';
import {
  Receipt,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { formatRupiah } from '../../../data/initialData';

interface FinancialSummaryCardsProps {
  totalTagihan?: number;
  totalPembayaran?: number;
  totalTunggakan?: number;
  statusKeuangan?: 'LUNAS' | 'BELUM LUNAS';
  academicYear?: string;
}

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  totalTagihan = 8500000,
  totalPembayaran = 7650000,
  totalTunggakan = 850000,
  statusKeuangan = 'BELUM LUNAS',
  academicYear = '2026/2027',
}) => {
  const isLunas = statusKeuangan === 'LUNAS' || totalTunggakan === 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* CARD 1: Total Tagihan */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition group">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Total Tagihan
            </span>
            <div className="text-2xl font-extrabold text-[#1E293B] mt-1 tracking-tight">
              {formatRupiah(totalTagihan)}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 text-[#334155] group-hover:bg-slate-200 transition">
            <FileText className="w-5 h-5 text-[#064E3B]" />
          </div>
        </div>
        <p className="text-xs text-[#64748B] mt-3">
          Tahun Ajaran {academicYear}
        </p>
      </div>

      {/* CARD 2: Total Pembayaran */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-emerald-200 transition group">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Total Pembayaran
            </span>
            <div className="text-2xl font-extrabold text-[#064E3B] mt-1 tracking-tight">
              {formatRupiah(totalPembayaran)}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-[#064E3B] group-hover:bg-emerald-100 transition">
            <CheckCircle2 className="w-5 h-5 text-[#064E3B]" />
          </div>
        </div>
        <p className="text-xs text-emerald-700 font-medium mt-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Pembayaran diterima
        </p>
      </div>

      {/* CARD 3: Total Tunggakan */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-amber-200 transition group">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Total Tunggakan
            </span>
            <div className="text-2xl font-extrabold text-amber-700 mt-1 tracking-tight">
              {formatRupiah(totalTunggakan)}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-100 transition">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <p className="text-xs text-amber-800 font-medium mt-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Belum diselesaikan
        </p>
      </div>

      {/* CARD 4: Status Keuangan */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition group">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Status Keuangan
            </span>
            <div className="mt-1.5">
              {isLunas ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-[#064E3B] border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  LUNAS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  BELUM LUNAS
                </span>
              )}
            </div>
          </div>
          <div className={`p-2.5 rounded-lg ${isLunas ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-[#64748B] mt-3">
          {isLunas ? 'Seluruh kewajiban terselesaikan' : 'Masih memiliki tunggakan'}
        </p>
      </div>
    </div>
  );
};
