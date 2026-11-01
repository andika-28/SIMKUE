import React from 'react';
import {
  Clock,
  TrendingDown,
  Trophy,
  AlertTriangle,
  ArrowRight,
  Eye,
  Calendar,
} from 'lucide-react';
import { ArrearsKPIStats, StudentArrearItem } from '../../types';

interface ArrearsAgingAndTrendProps {
  kpi: ArrearsKPIStats;
  onSelectStudentByNis: (nis: string) => void;
  onFilterCategory: (cat: string) => void;
}

export const ArrearsAgingAndTrend: React.FC<ArrearsAgingAndTrendProps> = ({
  kpi,
  onSelectStudentByNis,
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
    <div className="space-y-5">
      {/* SECTION 1: Usia Tunggakan (Aging Analysis 4 Columns) */}
      <div
        id="card-arrears-aging-analysis"
        className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Analisis Usia Tunggakan (Aging Analysis)
              </h4>
              <p className="text-[10px] text-slate-500">
                Segmentasi piutang berdasarkan lamanya tunggakan tidak terselesaikan
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            4 Siklus Periode
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {kpi.agingAnalysis.map((item, idx) => {
            const isCritical = item.range === '> 90 Hari';
            const catQuery =
              item.range === '> 90 Hari'
                ? '> 3 Bulan'
                : item.range === '61–90 Hari'
                ? '2–3 Bulan'
                : item.range === '31–60 Hari'
                ? '1–2 Bulan'
                : '< 1 Bulan';

            return (
              <div
                key={item.range}
                onClick={() => onFilterCategory(catQuery)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs group flex flex-col justify-between ${
                  isCritical
                    ? 'bg-rose-50/50 hover:bg-rose-50 border-rose-300'
                    : 'bg-slate-50/50 hover:bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span
                      className={`font-black flex items-center gap-1.5 ${
                        isCritical ? 'text-rose-900' : 'text-slate-800'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.range}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-rose-200/80 text-rose-900'
                          : 'bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      {item.santriCount} Santri
                    </span>
                  </div>

                  <h5 className="text-base font-black text-slate-900 group-hover:text-[#064E3B] transition-colors">
                    {formatRupiah(item.nominal)}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-600 group-hover:text-[#064E3B]">
                  <span>Filter Santri</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2 & 3: Tren Tunggakan & Top 5 Santri Menunggak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Tren Penurunan Tunggakan Bulanan */}
        <div
          id="card-arrears-trend-chart"
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Tren Tunggakan Bulanan
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Progres penagihan dan penurunan saldo piutang berjalan
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Tren Positif (Menurun)
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {kpi.monthlyTrend.map((m) => {
                const maxVal = 250000000;
                const widthTunggakan = (m.totalTunggakan / maxVal) * 100;
                const widthTertagih = (m.tertagih / maxVal) * 100;

                return (
                  <div key={m.bulan} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{m.bulan}</span>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-rose-700 font-bold">
                          Sisa: {formatRupiah(m.totalTunggakan)}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="text-emerald-700 font-bold">
                          Tertagih: {formatRupiah(m.tertagih)}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                      <div
                        className="bg-emerald-600 h-full rounded-l-full"
                        style={{ width: `${widthTertagih}%` }}
                        title={`Tertagih: ${formatRupiah(m.tertagih)}`}
                      />
                      <div
                        className="bg-rose-500 h-full rounded-r-full"
                        style={{ width: `${widthTunggakan}%` }}
                        title={`Tunggakan: ${formatRupiah(m.totalTunggakan)}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-600 rounded-xs" /> Tertagih
              <span className="inline-block w-2.5 h-2.5 bg-rose-500 rounded-xs ml-2" /> Belum Lunas
            </span>
            <span className="font-bold text-emerald-800">
              Penurunan Piutang: -18.0%
            </span>
          </div>
        </div>

        {/* Right: Top 5 Santri Menunggak */}
        <div
          id="card-top-arrears-students"
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Top 5 Tunggakan Tertinggi
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Santri dengan akumulasi tagihan terbesar yang memerlukan atensi
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Prioritas Utama
              </span>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {kpi.topArrears.map((top) => (
                <div
                  key={top.id}
                  onClick={() => onSelectStudentByNis(top.nis)}
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        top.rank === 1
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : top.rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : top.rank === 3
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {top.rank}
                    </span>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#064E3B] transition-colors">
                          {top.namaSantri}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({top.nis})</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {top.unit} • {top.kelas}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2.5">
                    <div>
                      <div className="text-xs font-extrabold text-rose-700">
                        {formatRupiah(top.nominal)}
                      </div>
                      <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        {top.kategori}
                      </span>
                    </div>
                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-[#064E3B] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Total 5 Santri Teratas:</span>
            <span className="font-extrabold text-rose-800">
              Rp14.950.000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
