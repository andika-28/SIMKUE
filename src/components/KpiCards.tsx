import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building,
  Users,
} from 'lucide-react';
import { formatRupiah } from '../data/initialData';
import { KpiSummary } from '../types';

interface KpiCardsProps {
  summary: KpiSummary;
  onCardClick?: (cardType: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary, onCardClick }) => {
  return (
    <section id="kpi-cards-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* CARD 1: Total Pemasukan */}
      <div
        id="card-kpi-pemasukan"
        onClick={() => onCardClick?.('pemasukan')}
        className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-[#64748B]">
            Total Pemasukan
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5%
          </span>
        </div>

        <div className="mt-2 text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
          {formatRupiah(summary.totalPemasukan)}
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px] text-[#94A3B8]">
          <span>{summary.pemasukanPeriod}</span>
          <span className="text-emerald-700 font-medium">Buku Kas Utama</span>
        </div>
      </div>

      {/* CARD 2: Total Pengeluaran */}
      <div
        id="card-kpi-pengeluaran"
        onClick={() => onCardClick?.('pengeluaran')}
        className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-[#64748B]">
            Total Pengeluaran
          </span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -5.2%
          </span>
        </div>

        <div className="mt-2 text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
          {formatRupiah(summary.totalPengeluaran)}
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px] text-[#94A3B8]">
          <span>{summary.pengeluaranPeriod}</span>
          <span className="text-amber-700 font-medium">Realisasi Pos RAPBP</span>
        </div>
      </div>

      {/* CARD 3: Total Saldo */}
      <div
        id="card-kpi-saldo"
        onClick={() => onCardClick?.('saldo')}
        className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-[#64748B]">
            Total Saldo
          </span>
          <span className="text-[10px] font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            {summary.rekeningAktifCount} Rekening
          </span>
        </div>

        <div className="mt-2 text-xl sm:text-2xl font-black text-[#064E3B] tracking-tight">
          {formatRupiah(summary.totalSaldo)}
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px] text-[#94A3B8]">
          <span>Seluruh Rekening Bank</span>
          <span className="text-[#064E3B] font-medium">Tersinkronisasi</span>
        </div>
      </div>

      {/* CARD 4: Total Tunggakan */}
      <div
        id="card-kpi-tunggakan"
        onClick={() => onCardClick?.('tunggakan')}
        className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-[#64748B]">
            Total Tunggakan
          </span>
          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {summary.santriMenunggakCount} Santri
          </span>
        </div>

        <div className="mt-2 text-xl sm:text-2xl font-black text-red-600 tracking-tight">
          {formatRupiah(summary.totalTunggakan)}
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px] text-[#94A3B8]">
          <span>Tagihan Santri Belum Lunas</span>
          <span className="text-red-600 font-medium">Perlu Tindak Lanjut</span>
        </div>
      </div>
    </section>
  );
};
