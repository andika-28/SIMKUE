import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  BarChart3,
  LineChart as LineChartIcon,
  ShieldAlert,
} from 'lucide-react';
import { formatRupiah, monthlyTrendData, initialKpiSummary } from '../data/initialData';

export const MainFinancialChart: React.FC = () => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const pemasukanBulanIni = initialKpiSummary.totalPemasukan;
  const pengeluaranBulanIni = initialKpiSummary.totalPengeluaran;
  const surplusBulanIni = pemasukanBulanIni - pengeluaranBulanIni;
  const persenPengeluaran = pemasukanBulanIni > 0 ? ((pengeluaranBulanIni / pemasukanBulanIni) * 100).toFixed(1) : '0';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pemasukan = payload.find((p: any) => p.dataKey === 'pemasukan')?.value || 0;
      const pengeluaran = payload.find((p: any) => p.dataKey === 'pengeluaran')?.value || 0;
      const surplus = pemasukan - pengeluaran;

      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs font-sans space-y-1.5 min-w-[200px] z-50">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>Bulan {label} 2026</span>
            <span className="text-[10px] text-emerald-400 font-normal">Terverifikasi</span>
          </p>
          <div className="flex items-center justify-between gap-4 text-emerald-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Pemasukan:
            </span>
            <span className="font-bold">{formatRupiah(pemasukan)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              Pengeluaran:
            </span>
            <span className="font-bold">{formatRupiah(pengeluaran)}</span>
          </div>
          <div className="pt-1.5 mt-1 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Surplus Kas:</span>
            <span className={surplus >= 0 ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold'}>
              {formatRupiah(surplus)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="main-financial-section" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* LEFT SECTION: 6-Month Trend Chart (8 cols on lg) */}
      <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
        <div>
          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
                  Tren Pemasukan & Pengeluaran
                </h3>
                <span className="text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded">
                  6 Bulan Terakhir
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Perbandingan arus kas selama 6 bulan terakhir
              </p>
            </div>

            {/* Chart Type Toggle & Controls */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0] self-start sm:self-auto">
              <button
                onClick={() => setChartType('area')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  chartType === 'area'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
                title="Tampilan Area & Garis"
              >
                <LineChartIcon className="w-3.5 h-3.5" />
                <span>Area</span>
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  chartType === 'bar'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
                title="Tampilan Diagram Batang"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Batang</span>
              </button>
            </div>
          </div>

          {/* Quick legend info */}
          <div className="flex items-center gap-5 mt-4 text-xs font-medium text-[#64748B]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#064E3B]" />
              <span>Pemasukan (SPP, Uang Makan, Infaq)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#94A3B8]" />
              <span>Pengeluaran (Operasional, Dapur, Gaji)</span>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-[280px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart
                data={monthlyTrendData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#064E3B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#064E3B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="bulan"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickFormatter={(val) => `${val / 1000000} jt`}
                  dx={-8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="pemasukan"
                  name="Pemasukan"
                  stroke="#064E3B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPemasukan)"
                  activeDot={{ r: 6, fill: '#064E3B', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="pengeluaran"
                  name="Pengeluaran"
                  stroke="#94A3B8"
                  strokeWidth={2.2}
                  fillOpacity={1}
                  fill="url(#colorPengeluaran)"
                  activeDot={{ r: 6, fill: '#64748B', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={monthlyTrendData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="bulan"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickFormatter={(val) => `${val / 1000000} jt`}
                  dx={-8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pemasukan" name="Pemasukan" fill="#064E3B" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* RIGHT SECTION: Financial Summary Card (4 cols on lg) */}
      <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
                Ringkasan Bulan Ini
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Performa buku kas Agustus 2026
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-100">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          {/* Metric Breakdown */}
          <div className="mt-4 space-y-3">
            {/* Pemasukan */}
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-100">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Pemasukan
                  </span>
                  <p className="text-sm font-bold text-[#1E293B]">
                    {formatRupiah(pemasukanBulanIni)}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {pemasukanBulanIni > 0 ? '100% Realisasi' : '0% Realisasi'}
              </span>
            </div>

            {/* Pengeluaran */}
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-slate-100 text-[#64748B] flex items-center justify-center border border-[#E2E8F0]">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Pengeluaran
                  </span>
                  <p className="text-sm font-bold text-[#1E293B]">
                    {formatRupiah(pengeluaranBulanIni)}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded border border-[#E2E8F0]">
                {persenPengeluaran}% dari Inflow
              </span>
            </div>

            {/* Selisih / Surplus */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                  Selisih (Surplus Kas)
                </span>
                <span className="text-[10px] font-bold text-[#064E3B] bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {surplusBulanIni >= 0 ? 'Surplus Bersih' : 'Defisit Kas'}
                </span>
              </div>
              <p className="text-2xl font-black text-[#064E3B] mt-1 font-sans">
                {formatRupiah(surplusBulanIni)}
              </p>
              <p className="text-[11px] text-emerald-800 mt-1 font-medium">
                {surplusBulanIni !== 0 ? 'Kondisi arus kas pesantren tercatat' : 'Belum ada transaksi pada periode ini'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom subtle progress indicator */}
        <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#334155] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#064E3B]" />
              Pertumbuhan Saldo
            </span>
            <span className="font-bold text-[#064E3B]">+0%</span>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden border border-[#E2E8F0]">
            <div
              className="bg-[#064E3B] h-full rounded-full transition-all duration-500"
              style={{ width: '0%' }}
            />
          </div>

          <p className="text-[10px] text-[#94A3B8] mt-2 font-medium">
            Saldo kas pesantren siap untuk pencatatan transaksi baru.
          </p>
        </div>
      </div>
    </section>
  );
};
