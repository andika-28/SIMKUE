import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  PieChart as PieIcon,
  TrendingDown,
  ChevronRight,
  ArrowDownRight,
  Layers,
  Utensils,
  GraduationCap,
  Zap,
  Hammer,
  Users,
} from 'lucide-react';
import { formatRupiah, incomeCategoriesData, topExpensesData } from '../data/initialData';

export const IncomeExpenseAnalysis: React.FC = () => {
  // Total Pemasukan calculation
  const totalIncome = incomeCategoriesData.reduce((sum, item) => sum + item.nominal, 0);
  const totalExpense = topExpensesData.reduce((sum, item) => sum + item.nominal, 0);

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200">{data.name}</p>
          <p className="text-emerald-400 font-extrabold">{formatRupiah(data.nominal)}</p>
          <p className="text-[10px] text-slate-400 font-medium">{data.percentage}% dari total pemasukan</p>
        </div>
      );
    }
    return null;
  };

  const getExpenseIcon = (nama: string) => {
    if (nama.includes('Dapur')) return <Utensils className="w-3.5 h-3.5 text-amber-600" />;
    if (nama.includes('Guru')) return <GraduationCap className="w-3.5 h-3.5 text-blue-600" />;
    if (nama.includes('Pembangunan')) return <Hammer className="w-3.5 h-3.5 text-emerald-600" />;
    return <Users className="w-3.5 h-3.5 text-purple-600" />;
  };

  return (
    <section id="income-expense-analysis" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* CARD LEFT: Pemasukan Berdasarkan Jenis */}
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
                Pemasukan Berdasarkan Jenis
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Distribusi pos pemasukan santri & pesantren Agustus 2026
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-100">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Chart & Legend Grid */}
          {incomeCategoriesData.length === 0 ? (
            <div className="py-12 text-center text-[#94A3B8] text-xs">
              <p className="font-semibold text-[#64748B]">Belum ada pos pemasukan tercatat</p>
              <p className="text-[11px] text-[#94A3B8] mt-1">Data akan muncul otomatis setelah penerimaan kas dicatat.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-4">
              {/* Donut Chart with Center Summary */}
              <div className="sm:col-span-5 relative h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={incomeCategoriesData}
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="nominal"
                    >
                      {incomeCategoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Text inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-tight">
                    Total
                  </span>
                  <span className="text-xs font-black text-[#1E293B]">
                    {formatRupiah(totalIncome)}
                  </span>
                  <span className="text-[9px] text-[#064E3B] font-semibold">
                    {incomeCategoriesData.length} Pos
                  </span>
                </div>
              </div>

              {/* Legend Breakdown */}
              <div className="sm:col-span-7 space-y-2">
                {incomeCategoriesData.map((item) => (
                  <div
                    key={item.name}
                    className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1E293B] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] font-semibold text-[#64748B]">
                          {formatRupiah(item.nominal)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-[#1E293B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>Kolektibilitas Pembayaran SPP:</span>
          <span className="font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            0% Tercatat
          </span>
        </div>
      </div>

      {/* CARD RIGHT: Pengeluaran Terbesar */}
      <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
                Pengeluaran Terbesar
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Urutan pos anggaran pengeluaran utama pesantren bulan ini
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          {/* Ranked List with Progress Bars */}
          {topExpensesData.length === 0 ? (
            <div className="py-12 text-center text-[#94A3B8] text-xs">
              <p className="font-semibold text-[#64748B]">Belum ada pos pengeluaran tercatat</p>
              <p className="text-[11px] text-[#94A3B8] mt-1">Data akan muncul otomatis setelah pengeluaran kas dicatat.</p>
            </div>
          ) : (
            <div className="space-y-3.5 mt-4">
              {topExpensesData.map((item) => {
                const proportionOfTotal = totalExpense > 0 ? ((item.nominal / totalExpense) * 100).toFixed(1) : '0';

                return (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#F1F5F9] text-[#334155] font-bold text-[10px] flex items-center justify-center border border-[#E2E8F0]">
                          {item.rank}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {getExpenseIcon(item.nama)}
                          <span className="font-bold text-[#1E293B]">{item.nama}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1E293B]">
                          {formatRupiah(item.nominal)}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] font-medium">
                          ({proportionOfTotal}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden border border-[#E2E8F0]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.rank === 1
                            ? 'bg-amber-500'
                            : item.rank === 2
                            ? 'bg-blue-600'
                            : item.rank === 3
                            ? 'bg-[#064E3B]'
                            : 'bg-[#64748B]'
                        }`}
                        style={{ width: `${Math.min(100, (item.nominal / 30000000) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>Efisiensi Realisasi Anggaran:</span>
          <span className="font-bold text-[#334155] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
            Sesuai Rencana Anggaran (RAPBP)
          </span>
        </div>
      </div>
    </section>
  );
};
