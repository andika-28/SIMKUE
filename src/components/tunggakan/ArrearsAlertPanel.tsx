import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { ArrearsKPIStats } from '../../types';

interface ArrearsAlertPanelProps {
  kpi: ArrearsKPIStats;
  onFilterPriority: () => void;
  onFilterCategory: (cat: string) => void;
}

export const ArrearsAlertPanel: React.FC<ArrearsAlertPanelProps> = ({
  kpi,
  onFilterPriority,
  onFilterCategory,
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
      id="panel-arrears-alert"
      className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 border border-amber-300/80 rounded-xl p-5 shadow-xs relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Title & Description */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white">
                Perlu Perhatian
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Peringatan Piutang Pesantren
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              72 santri masih memiliki tunggakan aktif dengan total{' '}
              <span className="text-rose-700 font-extrabold underline decoration-rose-400 decoration-2">
                {formatRupiah(kpi.totalTunggakan)}
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Diperlukan koordinasi tindak lanjut penagihan dengan wali santri untuk menjaga kelancaran operasional dapur dan asrama.
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            id="btn-alert-view-priority"
            onClick={onFilterPriority}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            <span>Lihat Santri Prioritas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Breakdown Metrics Grid (3 Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-amber-200/60">
        {/* Tier 1: > 3 Bulan */}
        <div
          onClick={() => onFilterCategory('> 3 Bulan')}
          className="bg-white/80 hover:bg-white p-3 rounded-lg border border-rose-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-rose-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              Tunggakan &gt; 3 Bulan
            </span>
            <span className="font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">
              {kpi.breakdownAlert.lebih3Bulan.santriCount} Santri
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
            {formatRupiah(kpi.breakdownAlert.lebih3Bulan.nominal)}
          </p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Prioritas penagihan mendesak
          </span>
        </div>

        {/* Tier 2: 2–3 Bulan */}
        <div
          onClick={() => onFilterCategory('2–3 Bulan')}
          className="bg-white/80 hover:bg-white p-3 rounded-lg border border-amber-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Tunggakan 2–3 Bulan
            </span>
            <span className="font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
              {kpi.breakdownAlert.duaHingga3Bulan.santriCount} Santri
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
            {formatRupiah(kpi.breakdownAlert.duaHingga3Bulan.nominal)}
          </p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Kirim surat tagihan tahap II
          </span>
        </div>

        {/* Tier 3: < 2 Bulan */}
        <div
          onClick={() => onFilterCategory('1–2 Bulan')}
          className="bg-white/80 hover:bg-white p-3 rounded-lg border border-slate-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Tunggakan &lt; 2 Bulan
            </span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
              {kpi.breakdownAlert.kurang2Bulan.santriCount} Santri
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 group-hover:text-[#064E3B] transition-colors">
            {formatRupiah(kpi.breakdownAlert.kurang2Bulan.nominal)}
          </p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Kirim pengingat WhatsApp berkala
          </span>
        </div>
      </div>
    </div>
  );
};
