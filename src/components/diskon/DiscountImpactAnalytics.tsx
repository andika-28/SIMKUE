import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Users, Sparkles } from 'lucide-react';

export const DiscountImpactAnalytics: React.FC = () => {
  // Chart 1 data: Diskon Berdasarkan Jenis Tagihan
  const pieData = [
    { name: 'Uang Makan', value: 35000000, color: '#F59E0B' }, // amber-500
    { name: 'SPP', value: 5000000, color: '#059669' }, // emerald-600
    { name: 'Listrik & Air', value: 2750000, color: '#06B6D4' }, // cyan-500
  ];

  // Chart 2 data: Diskon per Bulan
  const barData = [
    { bulan: 'Jun', nominal: 2.25, fullBulan: 'Juni 2026', total: 'Rp 2,25 Jt' },
    { bulan: 'Jul', nominal: 26.5, fullBulan: 'Juli 2026', total: 'Rp 26,50 Jt' },
    { bulan: 'Agu', nominal: 12.5, fullBulan: 'Agustus 2026', total: 'Rp 12,50 Jt' },
    { bulan: 'Sep', nominal: 1.5, fullBulan: 'September 2026', total: 'Rp 1,50 Jt' },
  ];

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* CARD 1: Diskon Berdasarkan Jenis Tagihan (Donut Chart) */}
      <div
        id="card-analytics-discount-by-type"
        className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Diskon Menurut Jenis Tagihan
              </h4>
              <p className="text-[10px] text-slate-500">Komposisi alokasi anggaran</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            T.A 2026/2027
          </span>
        </div>

        <div className="h-44 w-full my-2 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatRupiah(value), 'Total Diskon']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '11px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
          {pieData.map((item) => (
            <div key={item.name} className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800">
                {formatRupiah(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CARD 2: Diskon per Bulan (Bar Chart) */}
      <div
        id="card-analytics-discount-by-month"
        className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Tren Diskon Bulanan
              </h4>
              <p className="text-[10px] text-slate-500">Dalam juta rupiah (Jt)</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            4 Bulan Terakhir
          </span>
        </div>

        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
              <Tooltip
                formatter={(value: number) => [`Rp ${value} Juta`, 'Nominal Diskon']}
                labelFormatter={(label) => `Bulan: ${label}`}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="nominal" fill="#064E3B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Puncak Alokasi Diskon:</span>
          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Juli 2026 (Rp 26,5 Jt)
          </span>
        </div>
      </div>

      {/* CARD 3: Distribusi Santri Terdampak */}
      <div
        id="card-analytics-student-distribution"
        className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Distribusi Santri Penerima
              </h4>
              <p className="text-[10px] text-slate-500">Berdasarkan paket & unit</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            265 Total Santri
          </span>
        </div>

        {/* Progress meters */}
        <div className="space-y-3.5 my-3 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Paket C (3x Makan)</span>
              <span className="font-bold text-slate-900">200 Santri (75.5%)</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '75.5%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Paket B (2x Makan)</span>
              <span className="font-bold text-slate-900">65 Santri (24.5%)</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '24.5%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">MTs / MA (Pemeliharaan Listrik)</span>
              <span className="font-bold text-slate-900">140 Santri (52.8%)</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-600 rounded-full" style={{ width: '52.8%' }} />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Cakupan Tertinggi:</span>
          <span className="font-bold text-slate-800">Paket Makan C Asrama</span>
        </div>
      </div>
    </div>
  );
};
