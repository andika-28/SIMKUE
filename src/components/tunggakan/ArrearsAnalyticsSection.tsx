import React from 'react';
import {
  BarChart3,
  PieChart as PieIcon,
  Building2,
  GraduationCap,
  Percent,
  Receipt,
  Calendar,
} from 'lucide-react';
import { ArrearsKPIStats } from '../../types';

interface ArrearsAnalyticsSectionProps {
  kpi: ArrearsKPIStats;
}

export const ArrearsAnalyticsSection: React.FC<ArrearsAnalyticsSectionProps> = ({
  kpi,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const totalKomposisi = kpi.tunggakanBulanan + kpi.tunggakanTahunan;
  const persenBulanan = totalKomposisi > 0 ? (kpi.tunggakanBulanan / totalKomposisi) * 100 : 50;
  const persenTahunan = 100 - persenBulanan;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Tunggakan per Unit */}
      <div
        id="card-analytics-arrears-by-unit"
        className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Tunggakan per Unit
                </h4>
                <p className="text-[10px] text-slate-500">
                  Perbandingan beban piutang MTs dan MA
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {kpi.unitComparison.map((u) => {
              const barWidth = Math.min(100, Math.max(10, u.percentage));
              return (
                <div key={u.unit} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          u.unit === 'MTs' ? 'bg-blue-600' : 'bg-emerald-600'
                        }`}
                      />
                      {u.label}
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {formatRupiah(u.totalNominal)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        u.unit === 'MTs'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{u.santriMenunggak} Santri Menunggak</span>
                    <span className="font-bold text-slate-700">
                      {u.percentage.toFixed(1)}% dari Total
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Unit dengan piutang terbesar:</span>
          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            MA (54.3%)
          </span>
        </div>
      </div>

      {/* 2. Tunggakan per Kelas */}
      <div
        id="card-analytics-arrears-by-class"
        className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Tunggakan per Kelas
                </h4>
                <p className="text-[10px] text-slate-500">
                  Distribusi beban piutang santri Kelas 1 – 6
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {kpi.classComparison.map((c) => {
              const maxVal = 45000000;
              const widthPct = Math.min(100, Math.max(10, (c.totalNominal / maxVal) * 100));

              return (
                <div key={c.kelas} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">
                      {c.kelas} ({c.santriCount} santri)
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {formatRupiah(c.totalNominal)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-[#064E3B] h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tunggakan tertinggi di:</span>
          <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Kelas 1 (Rp42.000.000)
          </span>
        </div>
      </div>

      {/* 3. Komposisi Tunggakan (Donut / Visual Breakdown) */}
      <div
        id="card-analytics-arrears-composition"
        className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center border border-orange-200">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Komposisi Tunggakan
                </h4>
                <p className="text-[10px] text-slate-500">
                  Proporsi Tagihan Bulanan vs Tagihan Tahunan
                </p>
              </div>
            </div>
          </div>

          {/* Large Visual Bar Representation */}
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Total Piutang Berjalan:</span>
                <span className="font-black text-rose-950 text-sm">
                  {formatRupiah(totalKomposisi)}
                </span>
              </div>

              {/* Segmented Progress Bar */}
              <div className="w-full bg-slate-200 rounded-xl h-4 overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${persenBulanan}%` }}
                  className="bg-amber-500 h-full flex items-center justify-center text-[9px] font-black text-white"
                  title={`Bulanan: ${persenBulanan.toFixed(1)}%`}
                >
                  {persenBulanan > 20 ? `${persenBulanan.toFixed(0)}%` : ''}
                </div>
                <div
                  style={{ width: `${persenTahunan}%` }}
                  className="bg-orange-600 h-full flex items-center justify-center text-[9px] font-black text-white"
                  title={`Tahunan: ${persenTahunan.toFixed(1)}%`}
                >
                  {persenTahunan > 20 ? `${persenTahunan.toFixed(0)}%` : ''}
                </div>
              </div>

              {/* Legend & Breakdown */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-amber-200 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Bulanan</span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-xs">
                    {formatRupiah(kpi.tunggakanBulanan)}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {persenBulanan.toFixed(1)}% porsi
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-orange-200 space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-orange-800 text-[11px]">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                    <span>Tahunan</span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-xs">
                    {formatRupiah(kpi.tunggakanTahunan)}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {persenTahunan.toFixed(1)}% porsi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Struktur Arus Kas:</span>
          <span className="font-bold text-slate-700">
            Bulanan (SPP & Makan) mendominasi
          </span>
        </div>
      </div>
    </div>
  );
};
