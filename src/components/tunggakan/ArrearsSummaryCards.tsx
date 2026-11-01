import React from 'react';
import { Wallet, Receipt, CalendarDays, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ArrearsKPIStats } from '../../types';

interface ArrearsSummaryCardsProps {
  kpi: ArrearsKPIStats;
  selectedJenisTunggakan: string;
  onSelectJenis: (jenis: string) => void;
}

export const ArrearsSummaryCards: React.FC<ArrearsSummaryCardsProps> = ({
  kpi,
  selectedJenisTunggakan,
  onSelectJenis,
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
      {/* CARD 1: Total Tunggakan */}
      <div
        id="card-summary-total-tunggakan"
        onClick={() => onSelectJenis('Semua Jenis')}
        className={`bg-white rounded-xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md relative overflow-hidden group ${
          selectedJenisTunggakan === 'Semua Jenis'
            ? 'border-rose-300 ring-2 ring-rose-500/20'
            : 'border-[#E2E8F0]'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-rose-700">
              Total Tunggakan
            </span>
            <h3 className="text-2xl font-black text-rose-950 tracking-tight">
              {formatRupiah(kpi.totalTunggakan)}
            </h3>
            <p className="text-xs text-rose-700/80 font-medium">
              Seluruh santri aktif (72 santri)
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-rose-100/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Persentase Belum Lunas:</span>
          <span className="font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            24.0% Total Santri
          </span>
        </div>
      </div>

      {/* CARD 2: Tunggakan Bulanan */}
      <div
        id="card-summary-tunggakan-bulanan"
        onClick={() => onSelectJenis('Tagihan Bulanan')}
        className={`bg-white rounded-xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md relative overflow-hidden group ${
          selectedJenisTunggakan === 'Tagihan Bulanan'
            ? 'border-amber-400 ring-2 ring-amber-500/20'
            : 'border-[#E2E8F0]'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700">
              Tunggakan Bulanan
            </span>
            <h3 className="text-2xl font-black text-amber-950 tracking-tight">
              {formatRupiah(kpi.tunggakanBulanan)}
            </h3>
            <p className="text-xs text-amber-700/80 font-medium">
              Tagihan SPP, Makan & Listrik
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Receipt className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-100/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Porsi terhadap total:</span>
          <span className="font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            52.9% dari Piutang
          </span>
        </div>
      </div>

      {/* CARD 3: Tunggakan Tahunan */}
      <div
        id="card-summary-tunggakan-tahunan"
        onClick={() => onSelectJenis('Tagihan Tahunan')}
        className={`bg-white rounded-xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md relative overflow-hidden group ${
          selectedJenisTunggakan === 'Tagihan Tahunan'
            ? 'border-orange-400 ring-2 ring-orange-500/20'
            : 'border-[#E2E8F0]'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-orange-700">
              Tunggakan Tahunan
            </span>
            <h3 className="text-2xl font-black text-orange-950 tracking-tight">
              {formatRupiah(kpi.tunggakanTahunan)}
            </h3>
            <p className="text-xs text-orange-700/80 font-medium">
              Sisa pembayaran tahunan (Cicilan)
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <CalendarDays className="w-5 h-5 text-orange-600" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-orange-100/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Porsi terhadap total:</span>
          <span className="font-extrabold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
            47.1% dari Piutang
          </span>
        </div>
      </div>

      {/* CARD 4: Santri Menunggak */}
      <div
        id="card-summary-santri-menunggak"
        className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs relative overflow-hidden group"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-600">
              Santri Menunggak
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {kpi.santriMenunggakCount}{' '}
              <span className="text-base font-semibold text-slate-600">Santri</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Dari {kpi.totalSantriAktif} santri aktif terdaftar
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Users className="w-5 h-5 text-rose-600" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Tingkat Ketertiban:</span>
          <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            76.0% Lunas Tepat Waktu
          </span>
        </div>
      </div>
    </div>
  );
};
