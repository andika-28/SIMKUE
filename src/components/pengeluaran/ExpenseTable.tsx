import React, { useState } from 'react';
import {
  Eye,
  Edit,
  MoreVertical,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Download,
  Printer,
  Upload,
  Ban,
  ArrowUpDown,
  Tag,
  Landmark,
  FileText,
  User,
  Plus,
} from 'lucide-react';
import { ExpenseItem } from '../../types';

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  onViewDetail: (item: ExpenseItem) => void;
  onEditExpense: (item: ExpenseItem) => void;
  onCancelExpense: (item: ExpenseItem) => void;
  onUploadReceipt: (item: ExpenseItem) => void;
  onPrintVoucher: (item: ExpenseItem) => void;
  onExportExcel: () => void;
  onAddNewExpense: () => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  onViewDetail,
  onEditExpense,
  onCancelExpense,
  onUploadReceipt,
  onPrintVoucher,
  onExportExcel,
  onAddNewExpense,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp ');
  };

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case 'Belanja Dapur':
        return 'bg-emerald-100 text-[#064E3B] border-emerald-200';
      case 'Gaji Guru':
        return 'bg-teal-100 text-teal-900 border-teal-200';
      case 'Gaji Karyawan':
        return 'bg-cyan-100 text-cyan-900 border-cyan-200';
      case 'Listrik':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Air':
        return 'bg-sky-100 text-sky-900 border-sky-200';
      case 'Internet':
        return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      case 'ATK':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Perawatan Pembangunan':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'Kegiatan Santri':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Transportasi':
        return 'bg-lime-100 text-lime-900 border-lime-200';
      case 'Kesehatan':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      case 'Pembelian Aset':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const renderStatusBadge = (item: ExpenseItem) => {
    if (item.status === 'DIBATALKAN') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
          <XCircle className="w-3 h-3" />
          <span>DIBATALKAN</span>
        </span>
      );
    }

    switch (item.statusBukti) {
      case 'LENGKAP':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-[#064E3B] border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>✓ Bukti Lengkap</span>
          </span>
        );
      case 'MENUNGGU_NOTA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            <span>⚠ Bukti Belum Lengkap</span>
          </span>
        );
      case 'PERLU_PERBAIKAN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>✕ Perlu Pemeriksaan</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="main-expense-table-card"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900">
              Daftar Pengeluaran
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {expenses.length} Transaksi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Seluruh transaksi pengeluaran pesantren dan status kelengkapan nota.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-table-export-excel"
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            id="btn-table-add-new"
            onClick={onAddNewExpense}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Baru</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto min-h-[340px]">
        {expenses.length === 0 ? (
          /* Empty State */
          <div id="expense-empty-state" className="py-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200 shadow-2xs">
              <FileText className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-800">
                Belum Ada Pengeluaran
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Belum ada transaksi pengeluaran pada filter atau periode yang dipilih.
              </p>
            </div>
            <button
              type="button"
              id="btn-empty-catat"
              onClick={onAddNewExpense}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pengeluaran Pertama</span>
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3.5 px-3 text-center w-12">No</th>
                <th className="py-3.5 px-3.5 whitespace-nowrap">Tanggal</th>
                <th className="py-3.5 px-3.5 whitespace-nowrap">No. Transaksi</th>
                <th className="py-3.5 px-3.5 whitespace-nowrap">Kategori</th>
                <th className="py-3.5 px-4 min-w-[220px]">Keterangan</th>
                <th className="py-3.5 px-3.5 whitespace-nowrap">Rekening</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Nominal</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Bukti</th>
                <th className="py-3.5 px-3.5 whitespace-nowrap">Dicatat Oleh</th>
                <th className="py-3.5 px-3.5 text-center whitespace-nowrap">Status</th>
                <th className="py-3.5 px-3 text-center w-24 whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((row, idx) => {
                const isCancelled = row.status === 'DIBATALKAN';
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isCancelled ? 'bg-rose-50/20 opacity-70' : ''
                    }`}
                  >
                    {/* No */}
                    <td className="py-3.5 px-3 text-center text-slate-400 font-semibold">
                      {idx + 1}
                    </td>

                    {/* Tanggal */}
                    <td className="py-3.5 px-3.5 font-medium text-slate-600 whitespace-nowrap">
                      {row.tanggal}
                    </td>

                    {/* No. Transaksi */}
                    <td className="py-3.5 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <span
                        onClick={() => onViewDetail(row)}
                        className="hover:text-[#064E3B] hover:underline cursor-pointer"
                      >
                        {row.transactionNo}
                      </span>
                    </td>

                    {/* Kategori */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${getCategoryColor(
                          row.kategori
                        )}`}
                      >
                        {row.kategori}
                      </span>
                    </td>

                    {/* Keterangan */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <p className={`font-medium line-clamp-1 ${isCancelled ? 'line-through text-slate-400' : ''}`}>
                        {row.keterangan}
                      </p>
                      {row.unit && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Unit: {row.unit}
                        </span>
                      )}
                    </td>

                    {/* Rekening */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-700 text-[11px]">
                          {row.rekening}
                        </span>
                      </div>
                    </td>

                    {/* Nominal */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-mono font-black text-sm ${
                          isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'
                        }`}
                      >
                        {formatRupiah(row.nominal)}
                      </span>
                    </td>

                    {/* Bukti */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {row.buktiList && row.buktiList.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => onViewDetail(row)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors cursor-pointer"
                          title="Klik untuk melihat lampiran"
                        >
                          <Paperclip className="w-3 h-3 text-emerald-700" />
                          <span>{row.buktiList.length} Bukti</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUploadReceipt(row)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 transition-colors cursor-pointer"
                          title="Upload bukti nota sekarang"
                        >
                          <span>Belum Ada</span>
                          <Upload className="w-2.5 h-2.5 text-amber-700" />
                        </button>
                      )}
                    </td>

                    {/* Dicatat Oleh */}
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="text-slate-700 text-xs font-semibold">
                        {row.dicatatOleh.split('(')[0].trim()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {row.rolePelaksana}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                      {renderStatusBadge(row)}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap relative">
                      <div className="flex items-center justify-center gap-1">
                        {/* Detail Eye */}
                        <button
                          type="button"
                          id={`btn-view-detail-${row.id}`}
                          onClick={() => onViewDetail(row)}
                          className="p-1.5 text-slate-400 hover:text-[#064E3B] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Detail Transaksi"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        {!isCancelled && (
                          <button
                            type="button"
                            id={`btn-edit-expense-${row.id}`}
                            onClick={() => onEditExpense(row)}
                            className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Transaksi (dengan audit log)"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {/* More Menu Toggle */}
                        <div className="relative">
                          <button
                            type="button"
                            id={`btn-more-menu-${row.id}`}
                            onClick={() =>
                              setOpenDropdownId(openDropdownId === row.id ? null : row.id)
                            }
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Menu Lainnya"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === row.id && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 text-left text-xs animate-in fade-in zoom-in-95 duration-150">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    onViewDetail(row);
                                  }}
                                  className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Detail Lengkap</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    onUploadReceipt(row);
                                  }}
                                  className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Upload / Tambah Bukti</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    onPrintVoucher(row);
                                  }}
                                  className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Cetak Voucher Kas (BPK)</span>
                                </button>

                                {!isCancelled && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenDropdownId(null);
                                      onCancelExpense(row);
                                    }}
                                    className="w-full px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium border-t border-slate-100"
                                  >
                                    <Ban className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Batalkan Transaksi</span>
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
