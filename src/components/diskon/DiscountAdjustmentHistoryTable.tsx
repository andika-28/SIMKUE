import React from 'react';
import { History, TrendingUp, TrendingDown, ShieldCheck, User } from 'lucide-react';
import { DiscountAdjustmentHistory } from '../../types';

interface DiscountAdjustmentHistoryTableProps {
  histories: DiscountAdjustmentHistory[];
}

export const DiscountAdjustmentHistoryTable: React.FC<
  DiscountAdjustmentHistoryTableProps
> = ({ histories }) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div
      id="card-discount-adjustment-history"
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200 shadow-2xs">
            <History className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Riwayat Penyesuaian Diskon
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Jejak audit resmi perubahan dan penyesuaian nominal diskon yang telah tercatat.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
          {histories.length} Catatan Audit
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50/80 border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3.5 min-w-[100px]">Tanggal</th>
              <th className="py-3 px-3.5 min-w-[110px]">Periode</th>
              <th className="py-3 px-3.5 min-w-[110px]">Jenis Tagihan</th>
              <th className="py-3 px-3.5 text-right min-w-[120px]">Diskon Sebelumnya</th>
              <th className="py-3 px-3.5 text-right min-w-[120px]">Diskon Baru</th>
              <th className="py-3 px-3.5 text-right min-w-[110px]">Perubahan</th>
              <th className="py-3 px-3.5 min-w-[240px]">Alasan Penyesuaian</th>
              <th className="py-3 px-3.5 min-w-[120px]">Dibuat Oleh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {histories.map((h) => (
              <tr
                key={h.id}
                id={`row-adjustment-${h.id}`}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Tanggal */}
                <td className="py-3.5 px-3.5 whitespace-nowrap font-bold text-slate-900">
                  {h.tanggal}
                </td>

                {/* Periode */}
                <td className="py-3.5 px-3.5 whitespace-nowrap">
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                    {h.periode}
                  </span>
                </td>

                {/* Jenis Tagihan */}
                <td className="py-3.5 px-3.5 whitespace-nowrap font-semibold text-slate-800">
                  {h.jenisTagihan}
                </td>

                {/* Diskon Sebelumnya */}
                <td className="py-3.5 px-3.5 text-right whitespace-nowrap text-slate-500">
                  {formatRupiah(h.diskonSebelumnya)}
                </td>

                {/* Diskon Baru */}
                <td className="py-3.5 px-3.5 text-right whitespace-nowrap font-bold text-slate-900">
                  {formatRupiah(h.diskonBaru)}
                </td>

                {/* Perubahan */}
                <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded-full text-[11px] ${
                      h.perubahan >= 0
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : 'text-rose-700 bg-rose-50 border border-rose-200'
                    }`}
                  >
                    {h.perubahan >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-rose-600" />
                    )}
                    {h.perubahan >= 0 ? '+' : ''}
                    {formatRupiah(h.perubahan)}
                  </span>
                </td>

                {/* Alasan */}
                <td className="py-3.5 px-3.5">
                  <div className="text-slate-800 font-medium leading-relaxed">
                    {h.alasan}
                  </div>
                  {h.keteranganTambahan && (
                    <div className="text-[10px] text-slate-500 italic mt-0.5">
                      Catatan: {h.keteranganTambahan}
                    </div>
                  )}
                </td>

                {/* Dibuat Oleh */}
                <td className="py-3.5 px-3.5 whitespace-nowrap text-slate-600 text-xs">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{h.dibuatOleh}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
