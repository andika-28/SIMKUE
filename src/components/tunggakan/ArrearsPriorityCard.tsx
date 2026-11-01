import React from 'react';
import { Target, Flame, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ArrearsKPIStats, ArrearsPriorityLevel } from '../../types';

interface ArrearsPriorityCardProps {
  kpi: ArrearsKPIStats;
  currentPriorityFilter: string;
  onSelectPriority: (priority: string) => void;
}

export const ArrearsPriorityCard: React.FC<ArrearsPriorityCardProps> = ({
  kpi,
  currentPriorityFilter,
  onSelectPriority,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div
      id="card-arrears-priority-collection"
      className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Prioritas Penagihan
              </h4>
              <p className="text-[10px] text-slate-500">
                Santri dengan tunggakan tertinggi dan periode tunggakan terlama
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Smart Priority Matrix
          </span>
        </div>

        {/* 3 Priority Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {/* HIGH PRIORITY */}
          <div
            onClick={() => onSelectPriority('HIGH')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              currentPriorityFilter === 'HIGH'
                ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-500/20'
                : 'bg-slate-50/50 hover:bg-rose-50/40 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-rose-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  HIGH PRIORITY
                </span>
                <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                  {kpi.priorityStats.high.santriCount} Santri
                </span>
              </div>
              <p className="text-base font-black text-rose-950 mt-1">
                {formatRupiah(kpi.priorityStats.high.nominal)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Tunggakan &gt; Rp3.000.000 atau &gt; 90 Hari
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-700 font-bold">
              <span>Filter Prioritas Tinggi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* MEDIUM PRIORITY */}
          <div
            onClick={() => onSelectPriority('MEDIUM')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              currentPriorityFilter === 'MEDIUM'
                ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20'
                : 'bg-slate-50/50 hover:bg-amber-50/40 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-amber-800">
                  MEDIUM PRIORITY
                </span>
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  {kpi.priorityStats.medium.santriCount} Santri
                </span>
              </div>
              <p className="text-base font-black text-amber-950 mt-1">
                {formatRupiah(kpi.priorityStats.medium.nominal)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Tunggakan Rp1.000.000 – Rp3.000.000
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800 font-bold">
              <span>Filter Prioritas Sedang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* LOW PRIORITY */}
          <div
            onClick={() => onSelectPriority('LOW')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              currentPriorityFilter === 'LOW'
                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20'
                : 'bg-slate-50/50 hover:bg-blue-50/40 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-blue-800">
                  LOW PRIORITY
                </span>
                <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                  {kpi.priorityStats.low.santriCount} Santri
                </span>
              </div>
              <p className="text-base font-black text-blue-950 mt-1">
                {formatRupiah(kpi.priorityStats.low.nominal)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Tunggakan &lt; Rp1.000.000 (Jatuh tempo baru)
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-blue-700 font-bold">
              <span>Filter Prioritas Rendah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-[#064E3B]" />
          <span>Rekomendasi tindak lanjut diperbarui secara otomatis per tanggal transaksi.</span>
        </div>
        {currentPriorityFilter !== 'Semua' && (
          <button
            type="button"
            onClick={() => onSelectPriority('Semua')}
            className="text-xs font-bold text-[#064E3B] hover:underline"
          >
            Tampilkan Semua Santri
          </button>
        )}
      </div>
    </div>
  );
};
