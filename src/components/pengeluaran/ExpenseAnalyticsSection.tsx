import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  PieChart as PieIcon,
  Layers,
  Building,
  Landmark,
  ArrowUpRight,
  Upload,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import {
  ExpenseItem,
} from '../../types';

export interface DynamicCategoryStat {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface DynamicTrendPoint {
  month: string;
  amount: number;
}

export interface DynamicUnitStat {
  unit: string;
  count: number;
  total: number;
}

interface ExpenseAnalyticsSectionProps {
  categoryStats: DynamicCategoryStat[];
  trendData: DynamicTrendPoint[];
  unitStats: DynamicUnitStat[];
  incompleteReceipts: ExpenseItem[];
  onQuickUploadReceipt: (item: ExpenseItem) => void;
  onFilterCategory: (categoryName: string) => void;
  bni1Total: number;
  bni2Total: number;
}

export const ExpenseAnalyticsSection: React.FC<ExpenseAnalyticsSectionProps> = ({
  categoryStats,
  trendData,
  unitStats,
  incompleteReceipts,
  onQuickUploadReceipt,
  onFilterCategory,
  bni1Total,
  bni2Total,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp ');
  };

  const formatShortRupiah = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)} M`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)} Jt`;
    return num.toLocaleString('id-ID');
  };

  // Prepare Donut Chart Data
  const accountData = [
    { name: 'BNI Rekening 1 (Operasional)', value: bni1Total, color: '#064E3B' },
    { name: 'BNI Rekening 2 (Pembangunan)', value: bni2Total, color: '#0D9488' },
  ];

  // Top 5 Categories
  const topCategories = [...categoryStats].sort((a, b) => b.total - a.total).slice(0, 5);

  const totalIncompleteAmount = incompleteReceipts.reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div id="expense-analytics-section" className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-[#064E3B]" />
            Analisis & Visualisasi Pengeluaran
          </h3>
          <p className="text-xs text-slate-500">
            Monitoring proporsi kas keluar, tren bulanan, alokasi per unit, dan audit kepatuhan bukti transaksi.
          </p>
        </div>
      </div>

      {/* Row 1: 3 Analytic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Pengeluaran per Kategori (Bar Chart) - 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Pengeluaran per Kategori
              </h4>
              <span className="text-[11px] text-slate-500">
                13 Kategori Pengeluaran Pesantren
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Bulan Berjalan
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryStats.slice(0, 7)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  tickFormatter={formatShortRupiah}
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }}
                  width={90}
                />
                <Tooltip
                  formatter={(value: any) => [formatRupiah(Number(value)), 'Total Pengeluaran']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="total" fill="#064E3B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Trend Pengeluaran (Area Chart) - 4 cols */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Trend Pengeluaran
              </h4>
              <span className="text-[11px] text-slate-500">
                Pergerakan Kas Keluar (Jun - Sep)
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Tren Stabil
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#064E3B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#064E3B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <YAxis
                  tickFormatter={formatShortRupiah}
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <Tooltip
                  formatter={(val: any) => [formatRupiah(Number(val)), 'Pengeluaran']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#064E3B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Pengeluaran per Rekening (Donut Chart) - 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Per Rekening
              </h4>
              <span className="text-[11px] text-slate-500">
                Proporsi Kas Bank
              </span>
            </div>
            <Landmark className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accountData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {accountData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatRupiah(Number(val)), 'Total']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#064E3B]" />
                BNI 1 (Operasional)
              </span>
              <span className="font-bold text-slate-900">
                {formatShortRupiah(bni1Total)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
                BNI 2 (Pembangunan)
              </span>
              <span className="font-bold text-slate-900">
                {formatShortRupiah(bni2Total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Top Expense Ranking + Unit Breakdown + Missing Receipts Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top 5 Categories Ranking (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Kategori Pengeluaran Terbesar
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Top 5</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {topCategories.map((cat, idx) => (
              <div
                key={cat.category}
                onClick={() => onFilterCategory(cat.category)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-slate-800 group-hover:text-[#064E3B]">
                      {cat.category}
                    </span>
                  </div>
                  <span className="font-black text-slate-900 font-mono">
                    {formatShortRupiah(cat.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pl-7">
                  <span>{cat.count} Transaksi</span>
                  <span>{cat.percentage}% dari total</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Unit / Bagian (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Pengeluaran Berdasarkan Unit
            </h4>
            <Building className="w-4 h-4 text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {unitStats.map((u) => (
              <div key={u.unit} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Unit {u.unit}</span>
                  <span className="text-[10px] text-slate-400">{u.count} Transaksi</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 font-mono block">
                    {formatShortRupiah(u.total)}
                  </span>
                  <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden ml-auto mt-1">
                    <div
                      className="bg-emerald-700 h-full rounded-full"
                      style={{ width: `${Math.min(100, (u.total / 60_000_000) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Card: Bukti Transaksi Belum Lengkap (4 cols) */}
        <div
          id="card-missing-receipts-warning"
          className="lg:col-span-4 bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    Bukti Transaksi Belum Lengkap
                  </h4>
                  <span className="text-[11px] text-amber-700 font-medium">
                    {incompleteReceipts.length} transaksi perlu lampiran nota
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-white/90 rounded-xl border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Total Nominal Belum Berdokumen
              </span>
              <div className="text-xl font-black text-amber-900 font-mono">
                {formatRupiah(totalIncompleteAmount)}
              </div>
            </div>

            {/* Incomplete items preview */}
            <div className="mt-3 space-y-2 max-h-36 overflow-y-auto">
              {incompleteReceipts.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-2 bg-white rounded-lg border border-amber-200 flex items-center justify-between text-[11px]"
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-slate-800 block truncate">
                      {item.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.transactionNo} • {formatRupiah(item.nominal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onQuickUploadReceipt(item)}
                    className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded text-[10px] transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-amber-800 font-semibold italic border-t border-amber-200">
            * Seluruh nota wajib dilengkapi sebelum tutup buku kas bulanan.
          </div>
        </div>
      </div>
    </div>
  );
};
