import React from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  ShieldCheck,
  Building2,
  Hash,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';
import { ImportHistoryItem } from '../../types';

interface ImportHistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItem: ImportHistoryItem | null;
  onDownloadPdf: () => void;
}

export const ImportHistoryDetailModal: React.FC<ImportHistoryDetailModalProps> = ({
  isOpen,
  onClose,
  historyItem,
  onDownloadPdf,
}) => {
  if (!isOpen || !historyItem) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="modal-history-detail"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Detail Berita Acara Import
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                  {historyItem.importId}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono truncate max-w-md">
                Hash: {historyItem.fileHash}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-history-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Nama File Sumber</span>
              <span className="font-bold text-slate-900 truncate block font-mono">{historyItem.namaFile}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Waktu Eksekusi</span>
              <span className="font-bold text-slate-900 block">{historyItem.tanggalImport}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Petugas Keuangan</span>
              <span className="font-bold text-slate-900 block">{historyItem.diimportOleh} ({historyItem.role})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Rekening Tujuan</span>
              <span className="font-bold text-slate-900 block">{historyItem.bankRekening}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Status Import</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded">
                ✓ {historyItem.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Metode Integrasi</span>
              <span className="font-semibold text-slate-700 block">Excel Auto-Reconciliation</span>
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-4 gap-2.5 text-center">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Baris</span>
              <span className="text-base font-black text-slate-900">{historyItem.totalData.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Berhasil</span>
              <span className="text-base font-black text-[#064E3B]">{historyItem.berhasil.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Bermasalah</span>
              <span className="text-base font-black text-amber-900">{historyItem.bermasalah}</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-900 uppercase block">Total Nominal</span>
              <span className="text-xs sm:text-sm font-black text-[#064E3B] truncate block">{formatRupiah(historyItem.totalNominal)}</span>
            </div>
          </div>

          {/* Detailed Audit Notes */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
              Catatan Audit & Jurnal Keuangan
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Batch import ini telah mendebit Kas Bank BNI dan mengkredit Piutang Tagihan Santri sebesar{' '}
              <strong className="text-slate-900">{formatRupiah(historyItem.totalNominal)}</strong>. Semua transaksi tercatat dengan stempel waktu otentik dan tanda tangan digital Bendahara Keuangan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <button
            type="button"
            id="btn-download-pdf-from-modal"
            onClick={onDownloadPdf}
            className="px-5 py-2 bg-[#064E3B] hover:bg-[#047857] text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berita Acara (.PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
