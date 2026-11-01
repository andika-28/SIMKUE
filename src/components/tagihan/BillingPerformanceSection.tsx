import React from 'react';
import { School, GraduationCap, TrendingUp, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { UNIT_BILLING_PERFORMANCE, CLASS_BILLING_PERFORMANCE } from '../../data/monthlyBillingData';

export const BillingPerformanceSection: React.FC = () => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div id="billing-performance-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4 text-[#064E3B]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Analisis Pembayaran Tagihan
            </h3>
            <p className="text-xs text-[#64748B]">
              Performa penerimaan dan kepatuhan pembayaran bulanan santri
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          Update Real-Time
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CARD 1: Status Pembayaran per Unit */}
        <div
          id="card-perf-unit"
          className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-[#064E3B]" />
                <h4 className="text-sm font-bold text-[#0F172A]">
                  Status Pembayaran per Unit
                </h4>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                MTs vs MA
              </span>
            </div>

            <div className="space-y-5">
              {UNIT_BILLING_PERFORMANCE.map((unitData) => {
                const paidPct = Math.round((unitData.sudahDibayar / unitData.totalTagihan) * 100);

                return (
                  <div key={unitData.unit} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {unitData.unit}
                        </span>
                        <span className="text-xs font-medium text-slate-700">
                          {unitData.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#064E3B]">
                          {paidPct}%
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">Terkumpul</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#064E3B] h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${paidPct}%` }}
                        title={`Sudah Dibayar: ${formatRupiah(unitData.sudahDibayar)}`}
                      />
                    </div>

                    {/* Financial details breakdown */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <p className="text-slate-500 text-[10px]">Total Tagihan:</p>
                        <p className="font-bold text-slate-800 font-mono mt-0.5">
                          {formatRupiah(unitData.totalTagihan)}
                        </p>
                      </div>
                      <div className="bg-emerald-50/70 rounded-lg p-2 border border-emerald-100">
                        <p className="text-emerald-700 text-[10px] flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5 inline" />
                          Sudah Dibayar:
                        </p>
                        <p className="font-bold text-emerald-900 font-mono mt-0.5">
                          {formatRupiah(unitData.sudahDibayar)}
                        </p>
                      </div>
                      <div className="bg-rose-50/70 rounded-lg p-2 border border-rose-100">
                        <p className="text-rose-700 text-[10px] flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5 inline" />
                          Belum Dibayar:
                        </p>
                        <p className="font-bold text-rose-900 font-mono mt-0.5">
                          {formatRupiah(unitData.belumDibayar)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata kepatuhan pesantren: <strong>79,8%</strong></span>
            <span className="text-emerald-700 font-medium">Target akhir bulan: 95%</span>
          </div>
        </div>

        {/* CARD 2: Status Pembayaran per Kelas */}
        <div
          id="card-perf-kelas"
          className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#064E3B]" />
                <h4 className="text-sm font-bold text-[#0F172A]">
                  Status Pembayaran per Kelas
                </h4>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Tingkat Kepatuhan
              </span>
            </div>

            <div className="space-y-3.5">
              {CLASS_BILLING_PERFORMANCE.map((item) => {
                const isHigh = item.percentage >= 85;
                const isMedium = item.percentage >= 80 && item.percentage < 85;
                const barColor = isHigh
                  ? 'bg-[#064E3B]'
                  : isMedium
                  ? 'bg-emerald-600'
                  : 'bg-amber-600';

                return (
                  <div key={item.kelas} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{item.kelas}</span>
                        <span className="text-[10px] text-slate-400">
                          ({item.lunasCount}/{item.totalSantri} Lunas)
                        </span>
                      </div>
                      <span className="font-bold text-slate-800 font-mono">
                        {item.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-[#064E3B]"></span> &ge;85% Tinggi
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span> &lt;80% Perlu Perhatian
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">Kelas 2 Tertinggi (92%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
