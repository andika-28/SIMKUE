import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  AlertTriangle,
  Upload,
  Paperclip,
  CheckCircle2,
  ShieldCheck,
  Building,
  FileText,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { BankAccountItem, BankManagementRole } from '../../types';

interface BalanceAdjustmentModalProps {
  isOpen: boolean;
  accounts: BankAccountItem[];
  defaultAccountId?: string;
  defaultAmount?: number;
  defaultReason?: string;
  currentRole: BankManagementRole;
  onClose: () => void;
  onSubmitAdjustment: (data: {
    accountId: string;
    type: 'PENAMBAHAN' | 'PENGURANGAN';
    amount: number;
    reason: string;
    attachmentName: string;
    date: string;
  }) => void;
}

export const BalanceAdjustmentModal: React.FC<BalanceAdjustmentModalProps> = ({
  isOpen,
  accounts,
  defaultAccountId,
  defaultAmount,
  defaultReason,
  currentRole,
  onClose,
  onSubmitAdjustment,
}) => {
  if (!isOpen) return null;

  const [accountId, setAccountId] = useState<string>(
    defaultAccountId || accounts[0]?.id || ''
  );
  const [adjustType, setAdjustType] = useState<'PENAMBAHAN' | 'PENGURANGAN'>('PENAMBAHAN');
  const [amountStr, setAmountStr] = useState<string>(
    defaultAmount ? String(defaultAmount) : '150000'
  );
  const [reason, setReason] = useState<string>(
    defaultReason || 'Koreksi penyesuaian biaya administrasi bank giro BNI'
  );
  const [attachmentName, setAttachmentName] = useState<string>('bukti_nota_koreksi_bni.pdf');
  const [adjustDate, setAdjustDate] = useState<string>('2026-09-01');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const selectedAccount = accounts.find((a) => a.id === accountId);
  const amountNumber = Number(amountStr) || 0;

  const balanceBefore = selectedAccount?.saldo || 0;
  const balanceAfter =
    adjustType === 'PENAMBAHAN'
      ? balanceBefore + amountNumber
      : balanceBefore - amountNumber;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) {
      setErrorMsg('Pilih rekening bank.');
      return;
    }
    if (amountNumber <= 0) {
      setErrorMsg('Nominal penyesuaian harus lebih dari Rp 0.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Alasan penyesuaian wajib diisi untuk audit keuangan.');
      return;
    }
    if (!attachmentName) {
      setErrorMsg('Wajib mengunggah lampiran bukti pendukung.');
      return;
    }
    if (adjustType === 'PENGURANGAN' && amountNumber > balanceBefore) {
      setErrorMsg('Nominal pengurangan melebihi saldo rekening saat ini.');
      return;
    }

    onSubmitAdjustment({
      accountId,
      type: adjustType,
      amount: amountNumber,
      reason,
      attachmentName,
      date: adjustDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Penyesuaian Saldo Rekening (Jurnal Koreksi)
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan koreksi saldo dengan rekaman audit log imutabel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Rekening Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              REKENING BANK YANG DISESUAIKAN
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountName} - Saldo: {formatRupiah(acc.saldo)}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Penyesuaian */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              JENIS PENYESUAIAN
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdjustType('PENAMBAHAN')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  adjustType === 'PENAMBAHAN'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                + Penambahan (Kredit)
              </button>

              <button
                type="button"
                onClick={() => setAdjustType('PENGURANGAN')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  adjustType === 'PENGURANGAN'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                - Pengurangan (Debit)
              </button>
            </div>
          </div>

          {/* Nominal & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NOMINAL PENYESUAIAN (RP)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                TANGGAL PENYESUAIAN
              </label>
              <input
                type="date"
                value={adjustDate}
                onChange={(e) => setAdjustDate(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Alasan Penyesuaian */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ALASAN PENYESUAIAN <span className="text-rose-500">* (Wajib Diisi)</span>
            </label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan dasar penyebab perbedaan saldo / keperluan koreksi..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Lampiran Bukti File Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              LAMPIRAN BUKTI PENDUKUNG <span className="text-rose-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-3.5 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Paperclip className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-800">{attachmentName}</p>
                  <p className="text-[10px] text-slate-400">PDF / JPG Rekening Koran / Nota Bank</p>
                </div>
              </div>
              <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700">
                Ganti
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachmentName(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Live Balance Impact Preview */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-500">
              <span>Saldo Sebelum:</span>
              <span className="font-semibold text-slate-700">{formatRupiah(balanceBefore)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5">
              <span>Saldo Baru Setelah Koreksi:</span>
              <span className="text-amber-800 font-extrabold">{formatRupiah(balanceAfter)}</span>
            </div>
          </div>

          {/* Audit Rule Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <span>
              Koreksi saldo tidak menghapus riwayat masa lalu. Sistem akan menerbitkan nomor jurnal penyesuaian khusus dan merekam nama petugas ({currentRole}) secara permanen.
            </span>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Penyesuaian Saldo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
