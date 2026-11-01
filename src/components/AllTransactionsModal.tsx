import React, { useState } from 'react';
import {
  X,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah } from '../data/initialData';
import { PrintCashBookModal } from './common/PrintCashBookModal';
import { downloadExcelSpreadsheet } from '../utils/fileDownloader';

interface AllTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const AllTransactionsModal: React.FC<AllTransactionsModalProps> = ({
  isOpen,
  onClose,
  transactions,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Pemasukan' | 'Pengeluaran'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  if (!isOpen) return null;

  const categories = Array.from(new Set(transactions.map((t) => t.kategori)));

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.keterangan.toLowerCase().includes(search.toLowerCase()) ||
      t.kategori.toLowerCase().includes(search.toLowerCase()) ||
      (t.santri && t.santri.toLowerCase().includes(search.toLowerCase()));

    const matchType = typeFilter === 'ALL' || t.jenis === typeFilter;
    const matchCat = categoryFilter === 'ALL' || t.kategori === categoryFilter;

    return matchSearch && matchType && matchCat;
  });

  const totalIn = filtered
    .filter((t) => t.jenis === 'Pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalOut = filtered
    .filter((t) => t.jenis === 'Pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[70] animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-5xl w-full p-6 shadow-2xl border border-[#E2E8F0] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#1E293B]">
                Buku Besar & Riwayat Transaksi Lengkap
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#064E3B] border border-emerald-200">
                {filtered.length} Transaksi
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Seluruh catatan arus kas masuk dan keluar PM. Raudhatussalam Mahato
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="py-4 border-b border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-12 gap-3 flex-shrink-0">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi, santri, atau pos anggaran..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B] text-[#1E293B]"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs outline-none text-[#1E293B]"
            >
              <option value="ALL">Semua Jenis (Masuk & Keluar)</option>
              <option value="Pemasukan">Pemasukan Saja</option>
              <option value="Pengeluaran">Pengeluaran Saja</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs outline-none text-[#1E293B]"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Export Actions */}
          <div className="sm:col-span-2 flex items-center gap-1.5 justify-end">
            <button
              onClick={() => {
                const headers = ['No', 'ID Transaksi', 'Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Santri', 'Jumlah', 'Metode Bayar'];
                const rows = filtered.map((trx, i) => [
                  i + 1,
                  trx.id,
                  trx.tanggal,
                  trx.jenis,
                  trx.kategori,
                  trx.keterangan,
                  trx.santri || '-',
                  formatRupiah(trx.nominal),
                  trx.metode,
                ]);

                downloadExcelSpreadsheet(`Daftar_Transaksi_${new Date().toISOString().slice(0, 10)}.xls`, {
                  title: 'BUKU KAS & MUTASI TRANSAKSI KEUANGAN PESANTREN',
                  subtitle: `Pondok Modern Raudhatussalam Mahato • Total: ${filtered.length} Transaksi`,
                  headers,
                  rows,
                  summary: [
                    { label: 'Total Pemasukan', value: formatRupiah(totalIn) },
                    { label: 'Total Pengeluaran', value: formatRupiah(totalOut) },
                  ],
                });
              }}
              className="p-2 rounded-lg border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] text-xs font-medium flex items-center gap-1 transition cursor-pointer"
              title="Ekspor Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#064E3B]" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              id="btn-print-cashbook"
              onClick={() => setIsPrintModalOpen(true)}
              className="p-2 rounded-lg border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] text-xs font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs"
              title="Cetak Buku Kas / Laporan Transaksi"
            >
              <Printer className="w-4 h-4 text-[#064E3B]" />
              <span className="font-bold text-[#064E3B]">Cetak</span>
            </button>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="py-2.5 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-xs flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[#64748B]">
              Total Inflow:{' '}
              <strong className="text-[#064E3B]">{formatRupiah(totalIn)}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[#64748B]">
              Total Outflow:{' '}
              <strong className="text-[#1E293B]">{formatRupiah(totalOut)}</strong>
            </span>
          </div>
          <span className="text-[#64748B] font-semibold">
            Net Kas:{' '}
            <strong className="text-[#064E3B]">{formatRupiah(totalIn - totalOut)}</strong>
          </span>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto mt-2">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-xs z-10">
              <tr className="border-b border-[#E2E8F0] text-[#64748B] text-[11px] font-bold uppercase tracking-wider bg-[#F8FAFC]">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Rekening</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs font-medium text-[#334155]">
              {filtered.length > 0 ? (
                filtered.map((trx) => {
                  const isIncome = trx.jenis === 'Pemasukan';
                  return (
                    <tr key={trx.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                        {trx.tanggal}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1E293B] block">{trx.keterangan}</span>
                        {trx.santri && (
                          <span className="text-[11px] text-[#94A3B8]">{trx.santri}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-[#F1F5F9] text-[#334155] px-2 py-0.5 rounded text-[11px]">
                          {trx.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#64748B] text-[11px]">
                        {trx.rekening || 'BNI Operasional'}
                      </td>
                      <td className="py-3 px-4">
                        {isIncome ? (
                          <span className="text-[#064E3B] font-bold text-[11px] flex items-center gap-1">
                            <ArrowDownLeft className="w-3 h-3" /> Pemasukan
                          </span>
                        ) : (
                          <span className="text-[#334155] font-bold text-[11px] flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> Pengeluaran
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold whitespace-nowrap">
                        <span className={isIncome ? 'text-[#064E3B]' : 'text-[#1E293B]'}>
                          {isIncome ? `+${formatRupiah(trx.nominal)}` : `-${formatRupiah(trx.nominal)}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5 text-[#064E3B]" />
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#94A3B8]">
                    Tidak ditemukan data transaksi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] flex-shrink-0">
          <span>Menampilkan {filtered.length} dari total {transactions.length} transaksi</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E293B] text-white font-semibold rounded-lg hover:bg-slate-900 transition"
          >
            Tutup Buku Kas
          </button>
        </div>
      </div>

      {/* Printable Cash Book Modal */}
      <PrintCashBookModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        transactions={filtered}
        filterCategory={categoryFilter === 'ALL' ? 'Semua Kategori' : categoryFilter}
        totalIn={totalIn}
        totalOut={totalOut}
      />
    </div>
  );
};
