import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Info,
  Calendar,
  User,
  CreditCard,
  Building2,
  FileText,
  ShieldAlert,
  ArrowRight,
  Check,
  Ban,
  BookmarkPlus,
} from 'lucide-react';
import { ImportPaymentRecord } from '../../types';

interface ErrorDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: ImportPaymentRecord | null;
  onUpdateAction?: (recordId: string, action: 'PROSES' | 'LEWATI' | 'TANDAI') => void;
}

export const ErrorDetailDrawer: React.FC<ErrorDetailDrawerProps> = ({
  isOpen,
  onClose,
  record,
  onUpdateAction,
}) => {
  if (!isOpen || !record) return null;

  const formatRupiah = (num?: number) => {
    if (num === undefined || num === null) return 'Rp0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const isDuplicate = record.statusValidasi === 'DUPLIKAT';
  const isInvalid = record.statusValidasi === 'PERLU_VALIDASI';
  const isValid = record.statusValidasi === 'VALID';

  const handleAction = (action: 'PROSES' | 'LEWATI' | 'TANDAI') => {
    if (onUpdateAction) {
      onUpdateAction(record.id, action);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="drawer-error-detail"
          className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200"
        >
          {/* Header */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                  isDuplicate
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : isInvalid
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-[#064E3B] border border-emerald-300'
                }`}
              >
                {isDuplicate ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : isInvalid ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Detail Validasi Transaksi
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Ref: {record.nomorReferensi}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-error-drawer"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {/* Status Banner */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isDuplicate
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : isInvalid
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              {isDuplicate ? (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              ) : isInvalid ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-black text-xs uppercase tracking-wider block">
                  {isDuplicate
                    ? '⛔ Transaksi Terdeteksi Duplikat'
                    : isInvalid
                    ? '⚠ Nominal Pembayaran Tidak Sesuai Tagihan'
                    : '✓ Data Transaksi Valid'}
                </span>
                <p className="text-xs leading-relaxed opacity-90">
                  {record.validationErrorNote ||
                    'Transaksi ini telah lolos seluruh aturan validasi sistem keuangan dan siap diproses ke buku kas.'}
                </p>
              </div>
            </div>

            {/* TRANSACTION DATA CARD */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Data Transaksi Terimpor
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Nomor Referensi</span>
                  <span className="font-mono font-bold text-slate-900">{record.nomorReferensi}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Tanggal Pembayaran</span>
                  <span className="font-bold text-slate-800">{record.tanggal}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">NIS Santri</span>
                  <span className="font-mono font-bold text-slate-900">{record.nis}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Nama Santri</span>
                  <span className="font-bold text-slate-900">{record.namaSantri}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Unit & Kelas</span>
                  <span className="font-bold text-slate-800">{record.unit} • {record.kelas}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Metode Pembayaran</span>
                  <span className="font-bold text-slate-800">{record.metodePembayaran}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Nominal Ditransfer:</span>
                  <span className="text-sm font-black text-slate-900">
                    {formatRupiah(record.nominal)}
                  </span>
                </div>
              </div>
            </div>

            {/* MATCHING RESULT & COMPARISON (Expected vs Received) */}
            {isInvalid && (
              <div className="bg-amber-50/50 rounded-xl border border-amber-200 p-4 space-y-3">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  Pencocokan Nilai Tagihan
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60">
                    <span className="text-slate-600">Tagihan Bulanan Seharusnya:</span>
                    <span className="font-bold text-slate-900">{formatRupiah(record.expectedNominal || 850000)}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60">
                    <span className="text-slate-600">Nominal Diterima di File:</span>
                    <span className="font-bold text-amber-900">{formatRupiah(record.receivedNominal || 500000)}</span>
                  </div>
                  <div className="flex items-center justify-between font-black text-rose-700 pt-1">
                    <span>Selisih Kurang Bayar:</span>
                    <span>{formatRupiah(Math.abs(record.nominalDifference || 350000))}</span>
                  </div>
                </div>
              </div>
            )}

            {/* DUPLICATE AUDIT INFORMATION */}
            {isDuplicate && (
              <div className="bg-rose-50/50 rounded-xl border border-rose-200 p-4 space-y-2.5">
                <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
                  Catatan Riwayat Duplikasi
                </span>
                <p className="text-xs text-rose-800 leading-snug">
                  Nomor referensi <strong className="font-mono">{record.nomorReferensi}</strong> sudah pernah diproses sebelumnya pada:
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Waktu Proses:</span>
                    <span className="font-bold text-slate-800">{record.duplicateReferenceDate || '31 Agustus 2026'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Import Batch ID:</span>
                    <span className="font-mono font-bold text-slate-800">{record.duplicateImportId || 'IMP-20260831-001'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SYSTEM RULE CARD */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Info className="w-4 h-4 text-[#064E3B]" />
                <span>Aturan Sistem SIMKEU</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {record.systemRule ||
                  'Tagihan bulanan terdiri dari paket SPP + Uang Makan + Listrik & Air dan harus dibayarkan utuh satu kali. Tagihan tahunan dapat diangsur sesuai progres pembayaran.'}
              </p>
            </div>
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-drawer-mark-review"
                onClick={() => handleAction('TANDAI')}
                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl border border-amber-300 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Tandai Pemeriksaan</span>
              </button>

              <button
                type="button"
                id="btn-drawer-skip-tx"
                onClick={() => handleAction('LEWATI')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5 text-slate-500" />
                <span>Lewati Transaksi</span>
              </button>
            </div>

            <button
              type="button"
              id="btn-drawer-close"
              onClick={onClose}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs transition-colors cursor-pointer"
            >
              Tutup Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
