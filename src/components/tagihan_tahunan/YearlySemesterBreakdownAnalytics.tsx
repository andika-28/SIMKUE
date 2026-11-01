import React from 'react';
import {
  CalendarRange,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  School,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { YearlyBillingSummary } from '../../types';

interface YearlySemesterBreakdownAnalyticsProps {
  summary: YearlyBillingSummary;
  onFilterByStatus?: (status: string) => void;
  onFilterByUnit?: (unit: string) => void;
}

export const YearlySemesterBreakdownAnalytics: React.FC<
  YearlySemesterBreakdownAnalyticsProps
> = ({ summary, onFilterByStatus, onFilterByUnit }) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  // Donut chart calculations
  const totalStudents = summary.totalSantri || 300;
  const lunasPct = Math.round((summary.santriLunasCount / totalStudents) * 100);
  const sebagianPct = Math.round((summary.santriSebagianCount / totalStudents) * 100);
  const belumPct = 100 - lunasPct - sebagianPct;

  // Unit arrears calculations
  const totalTunggakanUnit = summary.tunggakanMTs + summary.tunggakanMA;
  const mtsPct = Math.round((summary.tunggakanMTs / totalTunggakanUnit) * 100);
  const maPct = 100 - mtsPct;

  return (
    <div className="space-y-6">
      {/* 1. SEMESTER PAYMENT BREAKDOWN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-[#064E3B]" />
              <span>Status Pembayaran per Semester</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Komparasi penyerapan dana tagihan tahunan antara Semester Ganjil dan Genap.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SEMESTER GANJIL */}
          <div
            id="card-semester-ganjil-analytics"
            className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-[#064E3B] text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                  Termin 1
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {summary.semesterGanjil.persen}% Terbayar
                </span>
              </div>

              <h4 className="text-lg font-extrabold text-[#0F172A] mt-2">
                SEMESTER GANJIL
              </h4>

              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">Total Tagihan:</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {formatRupiah(summary.semesterGanjil.total)}
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
                  <span className="text-[11px] text-emerald-700 font-medium">Sudah Dibayar:</span>
                  <p className="font-bold text-emerald-900 mt-0.5">
                    {formatRupiah(summary.semesterGanjil.terbayar)}
                  </p>
                </div>
                <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100">
                  <span className="text-[11px] text-rose-700 font-medium">Sisa Tagihan:</span>
                  <p className="font-bold text-rose-900 mt-0.5">
                    {formatRupiah(summary.semesterGanjil.sisa)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Payment Progress:</span>
                <span className="font-extrabold text-[#064E3B]">
                  {summary.semesterGanjil.persen}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
                <div
                  className="bg-[#064E3B] h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary.semesterGanjil.persen}%` }}
                />
              </div>
            </div>
          </div>

          {/* SEMESTER GENAP */}
          <div
            id="card-semester-genap-analytics"
            className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                  Termin 2
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {summary.semesterGenap.persen}% Terbayar
                </span>
              </div>

              <h4 className="text-lg font-extrabold text-[#0F172A] mt-2">
                SEMESTER GENAP
              </h4>

              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">Total Tagihan:</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {formatRupiah(summary.semesterGenap.total)}
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
                  <span className="text-[11px] text-emerald-700 font-medium">Sudah Dibayar:</span>
                  <p className="font-bold text-emerald-900 mt-0.5">
                    {formatRupiah(summary.semesterGenap.terbayar)}
                  </p>
                </div>
                <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100">
                  <span className="text-[11px] text-rose-700 font-medium">Sisa Tagihan:</span>
                  <p className="font-bold text-rose-900 mt-0.5">
                    {formatRupiah(summary.semesterGenap.sisa)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Payment Progress:</span>
                <span className="font-extrabold text-amber-700">
                  {summary.semesterGenap.persen}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/60">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary.semesterGenap.persen}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BILLING STATUS ANALYSIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: Status Pembayaran (Donut Chart representation) */}
        <div
          id="card-status-pembayaran-analysis"
          className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#064E3B]" />
              <span>Status Pembayaran</span>
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              Total {totalStudents} Santri
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* SVG Donut Chart */}
            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-100"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Lunas Segment (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#059669"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${(lunasPct / 100) * 238.76} 238.76`}
                  strokeDashoffset="0"
                />
                {/* Sebagian Segment (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${(sebagianPct / 100) * 238.76} 238.76`}
                  strokeDashoffset={`-${(lunasPct / 100) * 238.76}`}
                />
                {/* Belum Dibayar Segment (Rose) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#E11D48"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${(belumPct / 100) * 238.76} 238.76`}
                  strokeDashoffset={`-${((lunasPct + sebagianPct) / 100) * 238.76}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-slate-900">
                  {lunasPct}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Lunas
                </span>
              </div>
            </div>

            {/* Legend & Count */}
            <div className="flex-1 space-y-2.5 w-full">
              {/* Category 1: Lunas */}
              <div
                onClick={() => onFilterByStatus && onFilterByStatus('Lunas')}
                className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">Lunas</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-900">
                    {summary.santriLunasCount} Santri
                  </span>
                  <span className="text-[11px] text-emerald-700 ml-1.5 font-medium">
                    ({lunasPct}%)
                  </span>
                </div>
              </div>

              {/* Category 2: Sebagian */}
              <div
                onClick={() => onFilterByStatus && onFilterByStatus('Sebagian')}
                className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 hover:bg-amber-50 border border-amber-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-slate-800">Sebagian</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-900">
                    {summary.santriSebagianCount} Santri
                  </span>
                  <span className="text-[11px] text-amber-700 ml-1.5 font-medium">
                    ({sebagianPct}%)
                  </span>
                </div>
              </div>

              {/* Category 3: Belum Dibayar */}
              <div
                onClick={() => onFilterByStatus && onFilterByStatus('Belum Dibayar')}
                className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 hover:bg-rose-50 border border-rose-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600" />
                  <span className="text-xs font-semibold text-slate-800">Belum Dibayar</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-900">
                    {summary.santriBelumBayarCount} Santri
                  </span>
                  <span className="text-[11px] text-rose-700 ml-1.5 font-medium">
                    ({belumPct}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Tunggakan Berdasarkan Unit (Horizontal Bars) */}
        <div
          id="card-tunggakan-unit-analysis"
          className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs space-y-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <School className="w-4 h-4 text-[#064E3B]" />
                <span>Tunggakan Berdasarkan Unit</span>
              </h4>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Total: {formatRupiah(totalTunggakanUnit)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Perbandingan sisa piutang tagihan tahunan antara tingkatan madrasah.
            </p>
          </div>

          <div className="space-y-4 py-2">
            {/* Unit MTs */}
            <div
              onClick={() => onFilterByUnit && onFilterByUnit('MTs')}
              className="space-y-1.5 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Madrasah Tsanawiyah (MTs)
                </span>
                <span className="font-black text-slate-900">
                  {formatRupiah(summary.tunggakanMTs)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/60">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${mtsPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Porsi Tunggakan: {mtsPct}%</span>
                <span className="text-blue-700 font-semibold">Klik untuk filter MTs →</span>
              </div>
            </div>

            {/* Unit MA */}
            <div
              onClick={() => onFilterByUnit && onFilterByUnit('MA')}
              className="space-y-1.5 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Madrasah Aliyah (MA)
                </span>
                <span className="font-black text-slate-900">
                  {formatRupiah(summary.tunggakanMA)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/60">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${maPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Porsi Tunggakan: {maPct}%</span>
                <span className="text-emerald-700 font-semibold">Klik untuk filter MA →</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>Rata-rata sisa tunggakan: Rp1.875.000 / santri menunggak</span>
            <span className="font-bold text-slate-700">72 Santri</span>
          </div>
        </div>
      </div>
    </div>
  );
};
