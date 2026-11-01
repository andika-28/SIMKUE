import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Landmark,
  FileSpreadsheet,
  Receipt,
  Layers,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { BankAnalyticsCashFlow, BankAccountItem, BankMutationItem } from '../../types';

interface BankAnalyticsSectionProps {
  cashFlowHistory: BankAnalyticsCashFlow[];
  accounts: BankAccountItem[];
  recentActivities: BankMutationItem[];
  incomeToday: number;
  expenseToday: number;
}

export const BankAnalyticsSection: React.FC<BankAnalyticsSectionProps> = ({
  cashFlowHistory,
  accounts,
  recentActivities,
  incomeToday,
  expenseToday,
}) => {
  // Pie chart data for Saldo Distribution
  const pieData = accounts.map((acc, idx) => ({
    name: acc.accountName,
    value: acc.saldo,
    color: idx === 0 ? '#059669' : '#0D9488',
  }));

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.saldo, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#064E3B]" />
            Analisis Saldo & Aktivitas Rekening
          </h3>
          <p className="text-xs text-slate-500">
            Visualisasi arus kas masuk/keluar multi-bulan, distribusi saldo rekening, dan timeline transaksi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: Cash Flow Per Month (Bar Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Arus Kas Bulanan (Cash Flow Per Month)
              </h4>
              <p className="text-xs text-slate-400">
                Komparasi total pemasukan dan pengeluaran pesantren (Juni - Agustus 2026)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded-xs bg-[#059669]" />
                Pemasukan
              </div>
              <div className="flex items-center gap-1.5 text-rose-600">
                <span className="w-3 h-3 rounded-xs bg-[#E11D48]" />
                Pengeluaran
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `Rp${val / 1000000}Jt`}
                />
                <Tooltip
                  formatter={(value: any) => [formatRupiah(Number(value)), '']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="pemasukan" name="Pemasukan" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#E11D48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            {cashFlowHistory.map((item) => (
              <div key={item.month} className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-500 font-medium">{item.month}: </span>
                <span className="font-bold text-emerald-800">
                  Surplus +{formatRupiah(item.surplus)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: Distribusi Saldo (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-800">
                Distribusi Saldo Bank
              </h4>
              <PieChartIcon className="w-4 h-4 text-[#064E3B]" />
            </div>
            <p className="text-xs text-slate-400">
              Proporsi dana pada masing-masing rekening
            </p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatRupiah(Number(val)), 'Saldo']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label in Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-semibold text-slate-400">Total Saldo</span>
              <span className="text-xs font-black text-slate-800">
                {formatRupiah(totalBalance)}
              </span>
            </div>
          </div>

          {/* Account Breakdown Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {accounts.map((acc, index) => {
              const pct = totalBalance > 0 ? ((acc.saldo / totalBalance) * 100).toFixed(0) : '0';
              return (
                <div
                  key={acc.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: index === 0 ? '#059669' : '#0D9488' }}
                    />
                    <span className="font-semibold text-slate-700 truncate max-w-[130px]">
                      {acc.accountName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">
                      {formatRupiah(acc.saldo)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{pct}% Total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Transaksi Masuk vs Keluar Hari Ini & Timeline Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 3: Transaksi Masuk vs Keluar Hari Ini */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Transaksi Masuk vs Keluar Hari Ini
            </h4>
            <p className="text-xs text-slate-400">
              Perbandingan pergerakan dana masuk & keluar hari ini
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Masuk Progress */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700 flex items-center gap-1">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  Pemasukan Hari Ini
                </span>
                <span className="text-emerald-800 font-bold">
                  +{formatRupiah(incomeToday)}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[69%]" />
              </div>
            </div>

            {/* Keluar Progress */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-rose-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Pengeluaran Hari Ini
                </span>
                <span className="text-rose-700 font-bold">
                  -{formatRupiah(expenseToday)}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full w-[31%]" />
              </div>
            </div>

            {/* Net Today Summary */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-emerald-800">Net Flow Hari Ini</span>
                <p className="text-sm font-extrabold text-emerald-900">
                  +{formatRupiah(incomeToday - expenseToday)}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                Surplus Harian
              </span>
            </div>
          </div>
        </div>

        {/* TIMELINE: Aktivitas Rekening Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#064E3B]" />
                Aktivitas Rekening Terbaru
              </h4>
              <p className="text-xs text-slate-400">
                Log kronologis transaksi rekening bank dan mutasi terkini
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Live Stream
            </span>
          </div>

          <div className="space-y-3">
            {recentActivities.slice(0, 4).map((act, index) => {
              const isIncome = act.type === 'MASUK';
              const isTransfer = act.type === 'TRANSFER';

              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isIncome
                          ? 'bg-emerald-100 text-emerald-700'
                          : isTransfer
                          ? 'bg-cyan-100 text-cyan-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : isTransfer ? (
                        <Activity className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">{act.description}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{act.date}, {act.time}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600">{act.bankAccountName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-extrabold text-xs ${
                        isIncome
                          ? 'text-emerald-700'
                          : isTransfer
                          ? 'text-cyan-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatRupiah(act.amount)}
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                      {act.sourceLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
