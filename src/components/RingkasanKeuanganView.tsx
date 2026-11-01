import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Scale,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Filter,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  ExternalLink,
  Utensils,
  GraduationCap,
  Hammer,
  Users,
  Zap,
} from 'lucide-react';
import { formatRupiah } from '../data/initialData';
import { ringkasanPeriodsData } from '../data/ringkasanKeuanganData';
import { RingkasanKeuanganPrintModal } from './RingkasanKeuanganPrintModal';

interface RingkasanKeuanganViewProps {
  onNavigateToNav: (nav: string) => void;
}

export const RingkasanKeuanganView: React.FC<RingkasanKeuanganViewProps> = ({ onNavigateToNav }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'bulan_ini' | 'semester_ganjil' | 'tahunan'>('semester_ganjil');
  const [selectedUnit, setSelectedUnit] = useState<'all' | 'MTs' | 'MA'>('all');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Active period dataset
  const activePeriodKey = (selectedPeriod === 'bulan_ini' || selectedPeriod === 'tahunan') ? selectedPeriod : 'semester_ganjil';
  const currentPeriodData = ringkasanPeriodsData[activePeriodKey];

  // If unit filter is chosen (MTs or MA), calculate unit-specific metrics
  const selectedUnitItem = selectedUnit !== 'all' 
    ? currentPeriodData.unitComparison.find((u) => u.unit.includes(selectedUnit)) 
    : null;

  const totalIncome = selectedUnitItem ? selectedUnitItem.totalPemasukan : currentPeriodData.totalPemasukan;
  const totalExpense = selectedUnitItem ? selectedUnitItem.totalPengeluaran : currentPeriodData.totalPengeluaran;
  const totalSurplus = selectedUnitItem ? selectedUnitItem.surplus : currentPeriodData.surplus;
  const netMargin = ((totalSurplus / (totalIncome || 1)) * 100).toFixed(1);
  const totalKasBank = currentPeriodData.totalSaldoBank;
  const liquidityMonths = currentPeriodData.runwayMonths;
  const collectionRate = selectedUnitItem ? `${selectedUnitItem.collectionRate}%` : currentPeriodData.collectionRate;
  const totalSantri = selectedUnitItem ? selectedUnitItem.santriCount : currentPeriodData.totalSantri;
  const lunasCount = selectedUnitItem ? Math.round(selectedUnitItem.santriCount * (selectedUnitItem.collectionRate / 100)) : currentPeriodData.lunasCount;
  const totalTunggakan = selectedUnitItem ? selectedUnitItem.arrears : currentPeriodData.tunggakan;
  const oerPercentage = selectedUnitItem 
    ? `${((selectedUnitItem.totalPengeluaran / (selectedUnitItem.totalPemasukan || 1)) * 100).toFixed(1)}%` 
    : currentPeriodData.oerPercentage;

  const displayedUnits = selectedUnit === 'all' 
    ? currentPeriodData.unitComparison 
    : currentPeriodData.unitComparison.filter((u) => u.unit.includes(selectedUnit));

  // Cash flow trend for chart
  const cashFlowMetrics = currentPeriodData.trendArusKas.map((item) => {
    const factor = selectedUnit === 'MTs' ? 0.52 : selectedUnit === 'MA' ? 0.48 : 1;
    const pemasukan = Math.round(item.pemasukan * factor);
    const pengeluaran = Math.round(item.pengeluaran * factor);
    const surplus = pemasukan - pengeluaran;
    return {
      ...item,
      pemasukan,
      pengeluaran,
      surplus,
      marginPersen: Math.round((surplus / (pemasukan || 1)) * 100),
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Toolbar & Context Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-100 text-[#064E3B] rounded-lg">
              <Scale className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Ringkasan & Analisis Keuangan
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {currentPeriodData.periodBadge}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {currentPeriodData.periodSubtitle}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedPeriod('bulan_ini')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedPeriod === 'bulan_ini'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setSelectedPeriod('semester_ganjil')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedPeriod === 'semester_ganjil'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semester Ganjil
            </button>
            <button
              onClick={() => setSelectedPeriod('tahunan')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedPeriod === 'tahunan'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1 Tahun Ajaran
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Semua Unit (MTs & MA)</option>
              <option value="MTs">Khusus MTs</option>
              <option value="MA">Khusus MA</option>
            </select>

            <button
              type="button"
              id="btn-print-ringkasan-keuangan"
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer"
              title="Buka Pratinjau & Cetak Ringkasan Keuangan"
            >
              <Printer className="w-4 h-4 text-[#064E3B]" />
              <span>Cetak Ringkasan</span>
            </button>

            <button
              onClick={() => onNavigateToNav('Pusat Laporan')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Buka Laporan Lengkap</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Financial Health Ratio Indicators (4 Key Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Operating Surplus */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Surplus Operasional Bersih
              </span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {formatRupiah(totalSurplus)}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="font-bold text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {netMargin}% Margin
                </span>
                <span className="text-slate-400">• {currentPeriodData.periodLabel}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Penerimaan: {formatRupiah(totalIncome)}</span>
            <span className="text-rose-600">Beban: {formatRupiah(totalExpense)}</span>
          </div>
        </div>

        {/* Rasio Likuiditas / Cash Runway */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daya Tahan Kas (Runway)
              </span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {liquidityMonths} Bulan
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="font-bold text-blue-600 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {currentPeriodData.runwayStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Total Saldo Bank: {formatRupiah(totalKasBank)}</span>
          </div>
        </div>

        {/* Collection Efficiency Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Efektivitas Penagihan
              </span>
              <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <PercentIcon className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {collectionRate}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="font-bold text-teal-600">
                  {lunasCount} dari {totalSantri} Santri Lunas
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span className="text-amber-600 font-semibold">Tunggakan: {formatRupiah(totalTunggakan)}</span>
            <button
              onClick={() => onNavigateToNav('Tunggakan')}
              className="text-[#064E3B] font-bold hover:underline flex items-center gap-0.5"
            >
              Lihat
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Operating Expense Ratio (OER) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Rasio Beban Operasional
              </span>
              <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <BarChart3 className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {oerPercentage}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="font-bold text-emerald-600 flex items-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {currentPeriodData.oerStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Rata-rata: {formatRupiah(currentPeriodData.avgMonthlyExpense)}/bln</span>
          </div>
        </div>
      </div>

      {/* 3. Deep Analysis Section: Cash Flow Trend & Margin Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 cols): Interactive Cash Flow & Margin Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Tren Arus Kas & Surplus Bersih ({currentPeriodData.periodLabel})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentPeriodData.trendChartSubtitle}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <span className="w-3 h-3 rounded-xs bg-[#064E3B]" /> Pemasukan
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <span className="w-3 h-3 rounded-xs bg-rose-500" /> Pengeluaran
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                  <span className="w-3 h-1 bg-amber-500 rounded-full" /> Surplus
                </span>
              </div>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowMetrics} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} />
                  <YAxis
                    tickFormatter={(val) => `${(val / 1000000).toFixed(0)} Jt`}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatRupiah(Number(value)), '']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="pemasukan" name="Pemasukan" fill="#064E3B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#F43F5E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footnote Insight */}
          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#064E3B] shrink-0" />
              <span>
                {currentPeriodData.trendInsight}
              </span>
            </div>
          </div>
        </div>

        {/* Right (4 cols): Income vs Expense Structural Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Komposisi Pendapatan ({currentPeriodData.periodBadge})
                </h2>
                <p className="text-xs text-slate-500">Distribusi sumber penerimaan</p>
              </div>
              <span className="p-2 bg-slate-100 rounded-xl text-slate-700">
                <PieIcon className="w-4 h-4" />
              </span>
            </div>

            {/* Income Distribution List */}
            <div className="space-y-3 mt-4">
              {currentPeriodData.incomeCategories.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="font-black text-slate-900">{formatRupiah(item.nominal)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span>Porsi Anggaran</span>
                    <span className="font-bold text-slate-700">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action to Manage Tagihan */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateToNav('Tagihan Bulanan')}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Kelola Tarif & Pos Tagihan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Unit Comparison Section: MTs vs MA Performance */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Perbandingan Keuangan Berdasarkan Unit Madrasah
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis perputaran dana per unit untuk periode {currentPeriodData.periodLabel}
            </p>
          </div>
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-[#064E3B]">
            {displayedUnits.length} Unit Ditampilkan
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {displayedUnits.map((unit, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/50 to-white shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                      style={{ backgroundColor: unit.color }}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{unit.unit}</h3>
                      <p className="text-[11px] text-slate-500">{unit.santriCount} Santri Terdaftar</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                    {unit.collectionRate}% Tertagih
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Penerimaan</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                      {formatRupiah(unit.totalPemasukan)}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pengeluaran</span>
                    <span className="text-xs font-bold text-rose-600 mt-0.5 block">
                      {formatRupiah(unit.totalPengeluaran)}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Net Surplus</span>
                    <span className="text-xs font-black text-[#064E3B] mt-0.5 block">
                      {formatRupiah(unit.surplus)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Tunggakan Aktif: <strong className="text-amber-700">{formatRupiah(unit.arrears)}</strong>
                </span>
                <button
                  onClick={() => onNavigateToNav('Data Santri')}
                  className="text-[#064E3B] font-bold hover:underline flex items-center gap-1"
                >
                  Detail Santri
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Budget vs Actual Realization Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Realisasi Pos Anggaran vs Target (RAPBM)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluasi serapan anggaran operasional dan capaian target untuk {currentPeriodData.periodLabel}
            </p>
          </div>
          <button
            onClick={() => onNavigateToNav('Manajemen Pengeluaran')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Input Realisasi Kas</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">Pos Anggaran / Kategori</th>
                <th className="py-3 px-4">Tipe</th>
                <th className="py-3 px-4 text-right">Target RAPBM</th>
                <th className="py-3 px-4 text-right">Realisasi</th>
                <th className="py-3 px-4 text-center">Persentase</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {currentPeriodData.budgetVsRealization.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{item.kategori}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.jenis === 'pemasukan'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-600">
                    {formatRupiah(item.anggaran)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatRupiah(item.realisasi)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.persen > 100
                              ? 'bg-blue-600'
                              : item.persen >= 90
                              ? 'bg-emerald-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(item.persen, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-[11px] text-slate-800">{item.persen}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.persen >= 90 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sesuai Target
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <AlertTriangle className="w-3.5 h-3.5" /> Perlu Evaluasi
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Executive Summary Modal */}
      <RingkasanKeuanganPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        period={selectedPeriod}
        periodLabel={currentPeriodData.periodLabel}
        unit={selectedUnit === 'all' ? 'Semua Unit (MTs & MA)' : `Khusus ${selectedUnit}`}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        totalSurplus={totalSurplus}
        totalKasBank={totalKasBank}
        budgetItems={currentPeriodData.budgetVsRealization}
      />
    </div>
  );
};

function PercentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
