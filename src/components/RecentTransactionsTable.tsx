import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  FileText,
  Search,
  Download,
  Receipt,
  X,
  CreditCard,
  Building,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { formatRupiah } from '../data/initialData';
import { Transaction } from '../types';
import { PrintCashBookModal } from './common/PrintCashBookModal';

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({
  transactions,
  onViewAll,
}) => {
  const [filterType, setFilterType] = useState<'Semua' | 'Pemasukan' | 'Pengeluaran'>('Semua');
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [showPrintSlip, setShowPrintSlip] = useState(false);
  const [showPrintCashBook, setShowPrintCashBook] = useState(false);

  const filteredTransactions = transactions.filter((trx) => {
    if (filterType === 'Semua') return true;
    return trx.jenis === filterType;
  });

  return (
    <section id="recent-transactions-section" className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
              Transaksi Terbaru
            </h3>
            <span className="text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded">
              Buku Kas Terkini
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Daftar mutasi arus kas masuk dan keluar terakhir
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Quick Filter Pill Buttons */}
          <div className="flex items-center bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0] text-xs">
            {(['Semua', 'Pemasukan', 'Pengeluaran'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  filterType === type
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Quick Print Cash Book (BKU) Button */}
          <button
            type="button"
            id="btn-print-buku-kas-recent"
            onClick={() => setShowPrintCashBook(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#064E3B] hover:bg-emerald-800 px-3.5 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
            title="Cetak Rekapitulasi Buku Kas Umum (BKU)"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-200" />
            <span>Cetak Buku Kas</span>
          </button>

          <button
            id="btn-view-all-transactions"
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-lg border border-emerald-200 transition group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 rounded-l-lg">Tanggal</th>
              <th className="py-3 px-4">Keterangan</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Jenis</th>
              <th className="py-3 px-4">Nominal</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Kwitansi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-xs font-medium text-[#334155]">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                    <span className="font-semibold text-slate-500">Belum ada transaksi tercatat</span>
                    <span className="text-[11px] text-slate-400">Gunakan tombol Catat Transaksi untuk menambahkan transaksi baru</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.slice(0, 6).map((trx) => {
              const isIncome = trx.jenis === 'Pemasukan';

              return (
                <tr
                  key={trx.id}
                  id={`row-trx-${trx.id}`}
                  onClick={() => setSelectedTrx(trx)}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                >
                  {/* Tanggal */}
                  <td className="py-3.5 px-4 text-[#64748B] font-mono text-[11px] whitespace-nowrap">
                    {trx.tanggal}
                  </td>

                  {/* Keterangan */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1E293B] group-hover:text-[#064E3B] transition-colors">
                      {trx.keterangan}
                    </div>
                    {trx.santri && (
                      <div className="text-[11px] text-[#94A3B8] font-normal">
                        {trx.santri}
                      </div>
                    )}
                  </td>

                  {/* Kategori */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block bg-[#F8FAFC] text-[#334155] px-2 py-0.5 rounded text-[11px] font-medium border border-[#E2E8F0]">
                      {trx.kategori}
                    </span>
                  </td>

                  {/* Jenis (Colored Indicator) */}
                  <td className="py-3.5 px-4">
                    {isIncome ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ArrowDownLeft className="w-3 h-3" />
                        Pemasukan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded border border-[#E2E8F0]">
                        <ArrowUpRight className="w-3 h-3" />
                        Pengeluaran
                      </span>
                    )}
                  </td>

                  {/* Nominal */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-extrabold text-sm">
                    <span className={isIncome ? 'text-[#064E3B]' : 'text-[#1E293B]'}>
                      {isIncome ? `+${formatRupiah(trx.nominal)}` : `-${formatRupiah(trx.nominal)}`}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {trx.status}
                    </span>
                  </td>

                  {/* Kwitansi Aksi */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrx(trx);
                      }}
                      className="p-1.5 rounded-md text-[#94A3B8] hover:text-[#064E3B] hover:bg-emerald-50 transition"
                      title="Lihat Bukti Kwitansi"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTrx && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[70] animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0]">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Kwitansi Digital Sah
                </span>
                <h4 className="text-base font-bold text-[#1E293B] mt-1">
                  Detail Transaksi Keuangan
                </h4>
                <p className="text-xs text-[#64748B] font-mono">
                  ID: {selectedTrx.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedTrx(null)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="mt-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex justify-between text-[#64748B]">
                  <span>Pesantren:</span>
                  <span className="font-semibold text-[#1E293B]">PM. Raudhatussalam Mahato</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Tanggal Transaksi:</span>
                  <span className="font-semibold text-[#1E293B]">{selectedTrx.tanggal}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Kategori:</span>
                  <span className="font-semibold text-[#1E293B]">{selectedTrx.kategori}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Rekening Terkait:</span>
                  <span className="font-semibold text-[#1E293B]">{selectedTrx.rekening || 'BNI Operasional'}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Keterangan:</span>
                  <span className="font-semibold text-[#1E293B] text-right max-w-[200px]">{selectedTrx.keterangan}</span>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-sm font-bold">
                  <span className="text-[#334155]">Total Nominal:</span>
                  <span className={selectedTrx.jenis === 'Pemasukan' ? 'text-[#064E3B] text-base font-extrabold' : 'text-[#1E293B] text-base font-extrabold'}>
                    {formatRupiah(selectedTrx.nominal)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#064E3B] bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>Transaksi telah diverifikasi sistem buku kas dan saldo rekening.</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  setSelectedTrx(null);
                  setShowPrintSlip(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition"
              >
                Tutup
              </button>
              <button
                type="button"
                id="btn-print-recent-trx"
                onClick={() => {
                  setShowPrintSlip(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-emerald-900 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Pratinjau Kwitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Kwitansi Slip Modal */}
      {selectedTrx && showPrintSlip && (
        <div className="fixed inset-0 z-[80] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in print:max-h-none print:shadow-none print:border-none print:rounded-none">
            {/* Top Control */}
            <div className="p-4 bg-[#064E3B] text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-200" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Kwitansi Transaksi Resmi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Sekarang</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintSlip(false)}
                  className="p-1 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slip Paper */}
            <div className="p-8 space-y-6 text-slate-800 text-xs print:p-0 print:text-black">
              {/* Kop Surat */}
              <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-black text-xl flex-shrink-0">
                    R
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[#064E3B] uppercase tracking-tight">
                      Pondok Modern Raudhatussalam Mahato
                    </h2>
                    <p className="text-[10px] text-slate-600">
                      Sistem Informasi Keuangan (SIMKEU) Pesantren
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Tambusai Utara, Rokan Hulu, Riau • Telp: (0762) 891234
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 block">
                    {selectedTrx.id}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">{selectedTrx.tanggal}</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h3 className="text-xs font-black uppercase tracking-wider underline underline-offset-4">
                  {selectedTrx.jenis === 'Pemasukan' ? 'BUKTI PENERIMAAN KAS (KWITANSI)' : 'BUKTI PENGELUARAN KAS'}
                </h3>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-2.5 print:bg-transparent">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Uraian Transaksi:</span>
                  <span className="col-span-2 font-bold text-slate-900">{selectedTrx.keterangan}</span>
                </div>
                {selectedTrx.santri && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 font-medium">Atas Nama Santri:</span>
                    <span className="col-span-2 font-semibold text-[#064E3B]">{selectedTrx.santri}</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Pos / Kategori:</span>
                  <span className="col-span-2 font-medium text-slate-800">{selectedTrx.kategori}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Rekening Pembayaran:</span>
                  <span className="col-span-2 font-medium text-slate-800">{selectedTrx.rekening || 'BNI Giro Operasional'}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Jumlah Nominal:</span>
                  <span className="text-sm font-black text-[#064E3B]">{formatRupiah(selectedTrx.nominal)}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-4 grid grid-cols-2 gap-6 text-center text-xs avoid-break">
                <div className="space-y-10">
                  <p className="text-slate-500">Penyetor / Penerima,</p>
                  <p className="font-bold text-slate-900 underline">{selectedTrx.santri || 'Pihak Terkait'}</p>
                </div>
                <div className="space-y-10">
                  <p className="text-slate-500">Kasir / Bendahara,</p>
                  <p className="font-bold text-slate-900 underline">H. Ahmad Syarif, M.Pd.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-400 text-center">
                Dicetak secara otomatis melalui SIMKEU Pondok Modern Raudhatussalam Mahato
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Cash Book Modal */}
      <PrintCashBookModal
        isOpen={showPrintCashBook}
        onClose={() => setShowPrintCashBook(false)}
        transactions={transactions}
      />
    </section>
  );
};
