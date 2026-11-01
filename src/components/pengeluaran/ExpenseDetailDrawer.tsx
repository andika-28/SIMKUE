import React, { useState } from 'react';
import {
  X,
  Printer,
  Edit,
  Ban,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  ShieldCheck,
  Building2,
  Clock,
  Landmark,
  Layers,
  History,
  ArrowRight,
} from 'lucide-react';
import { ExpenseItem, ExpenseAttachment } from '../../types';

interface ExpenseDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseItem | null;
  onEditExpense: (expense: ExpenseItem) => void;
  onCancelExpense: (expense: ExpenseItem) => void;
  onPrintVoucher: (expense: ExpenseItem) => void;
  onUploadReceipt: (expense: ExpenseItem) => void;
}

export const ExpenseDetailDrawer: React.FC<ExpenseDetailDrawerProps> = ({
  isOpen,
  onClose,
  expense,
  onEditExpense,
  onCancelExpense,
  onPrintVoucher,
  onUploadReceipt,
}) => {
  const [previewAttachment, setPreviewAttachment] = useState<ExpenseAttachment | null>(null);

  if (!isOpen || !expense) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp ');
  };

  const isCancelled = expense.status === 'DIBATALKAN';

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div
        id="drawer-expense-detail"
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200"
      >
        {/* Drawer Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Detail Pengeluaran
                </h3>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    isCancelled
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-emerald-100 text-[#064E3B] border-emerald-200'
                  }`}
                >
                  {expense.status}
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-slate-500">
                {expense.transactionNo} • {expense.tanggal}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-drawer-detail"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Main Transaction Highlight */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                  Kategori Transaksi
                </span>
                <span className="text-base font-black text-emerald-400 block">
                  {expense.kategori} ({expense.kategoriCode})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                  Nominal Kas Keluar
                </span>
                <span className="text-2xl font-black text-rose-400 font-mono block">
                  {formatRupiah(expense.nominal)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Keterangan
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {expense.keterangan}
              </p>
            </div>

            {/* Financial Ledger Calculation */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Sumber Rekening</span>
                <span className="font-bold text-white text-[11px] truncate block">
                  {expense.rekening}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Saldo Sebelum</span>
                <span className="font-mono text-slate-300 text-[11px] block truncate">
                  {formatRupiah(expense.saldoSebelum)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 block font-bold">Saldo Setelah</span>
                <span className="font-mono text-emerald-400 text-[11px] font-black block truncate">
                  {formatRupiah(expense.saldoSetelah)}
                </span>
              </div>
            </div>
          </div>

          {/* Cancellation Notice if cancelled */}
          {isCancelled && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-rose-800 font-black text-xs">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Transaksi Ini Telah Dibatalkan</span>
              </div>
              <p className="text-xs text-rose-700">
                Alasan: {expense.alasanBatal || 'Penyesuaian transaksi internal bendahara.'}
              </p>
            </div>
          )}

          {/* INFORMASI PENGAJUAN (DOCUMENTATION) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
                Informasi Pengajuan & Otorisasi
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                Dokumentasi Sah
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Pengajuan Oleh
                </span>
                <span className="font-bold text-slate-900 block">
                  {expense.pengajuanOleh || '-'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Bagian / Unit
                </span>
                <span className="font-bold text-slate-900 block">
                  {expense.unit ? `Unit ${expense.unit}` : '-'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Disetujui Oleh
                </span>
                <span className="font-bold text-slate-900 block">
                  {expense.disetujuiOleh || '-'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Tanggal Persetujuan
                </span>
                <span className="font-bold text-slate-900 block">
                  {expense.tanggalPersetujuan || '-'}
                </span>
              </div>
            </div>

            {expense.catatan && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Catatan Tambahan
                </span>
                <p className="text-slate-600 italic">{expense.catatan}</p>
              </div>
            )}
          </div>

          {/* BUKTI TRANSAKSI & LAMPIRAN */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-emerald-700" />
                Bukti Transaksi ({expense.buktiList.length} Lampiran)
              </h4>
              <button
                type="button"
                onClick={() => onUploadReceipt(expense)}
                className="text-[10px] font-bold text-[#064E3B] hover:underline cursor-pointer flex items-center gap-1"
              >
                + Tambah Bukti
              </button>
            </div>

            {expense.buktiList.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto" />
                <div className="text-xs font-bold text-amber-900">
                  Belum Ada Lampiran Bukti
                </div>
                <p className="text-[11px] text-amber-700">
                  Transaksi berstatus <strong>Menunggu Nota</strong>. Silakan lampirkan foto struk, kwitansi, atau nota faktur.
                </p>
                <button
                  type="button"
                  onClick={() => onUploadReceipt(expense)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  Upload Nota Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {expense.buktiList.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-900 truncate block text-xs">
                          {att.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {att.size} • {att.uploadDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewAttachment(att)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Mengunduh file: ${att.name}`)}
                        className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Unduh Berkas"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIWAYAT AKTIVITAS & AUDIT TRAIL */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-600" />
                Riwayat Aktivitas & Audit Trail
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                Log Audit Imutabel
              </span>
            </div>

            <div className="space-y-3 pl-2 border-l-2 border-slate-200">
              {expense.riwayatAktivitas && expense.riwayatAktivitas.length > 0 ? (
                expense.riwayatAktivitas.map((log) => (
                  <div key={log.id} className="relative pl-3 space-y-0.5">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white" />
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="text-slate-400 font-mono">{log.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Oleh: <strong className="text-slate-800">{log.actor}</strong> ({log.role})
                    </div>
                    {log.note && (
                      <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 mt-1">
                        "{log.note}"
                      </p>
                    )}
                    {log.previousValue && log.newValue && (
                      <div className="text-[10px] bg-amber-50 text-amber-900 p-2 rounded-lg border border-amber-200 mt-1 font-mono">
                        <div>Semula: {log.previousValue}</div>
                        <div className="font-bold">Menjadi: {log.newValue}</div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs">
                  Transaksi dicatat oleh {expense.dicatatOleh} pada {expense.tanggal}.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-drawer-print-voucher"
              onClick={() => onPrintVoucher(expense)}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl border border-blue-200 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-blue-700" />
              <span>Cetak Voucher Kas (BPK)</span>
            </button>

            {!isCancelled && (
              <>
                <button
                  type="button"
                  id="btn-drawer-edit"
                  onClick={() => onEditExpense(expense)}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl border border-amber-200 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit className="w-4 h-4 text-amber-700" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  id="btn-drawer-cancel"
                  onClick={() => onCancelExpense(expense)}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl border border-rose-200 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>Batalkan</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <div>
                  <h4 className="font-bold text-slate-900">{previewAttachment.name}</h4>
                  <span className="text-slate-400 font-mono text-[10px]">{previewAttachment.size}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Mock Preview Canvas */}
            <div className="h-64 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <FileText className="w-12 h-12 text-slate-400" />
              <div className="font-bold text-slate-700">Preview Berkas Bukti</div>
              <p className="text-slate-400 text-[11px] max-w-xs">
                Dokumen bukti transaksi terotentikasi SIMKEU Pondok Modern Raudhatussalam Mahato.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => alert(`Mengunduh file: ${previewAttachment.name}`)}
                className="px-4 py-2 bg-[#064E3B] text-white rounded-xl font-bold hover:bg-[#047857] cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
