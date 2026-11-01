import React, { useState } from 'react';
import {
  X,
  Plus,
  Landmark,
  Building,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { BankAccountItem } from '../../types';

interface AddBankAccountModalProps {
  isOpen: boolean;
  editAccount?: BankAccountItem | null;
  onClose: () => void;
  onSaveAccount: (accountData: Partial<BankAccountItem>) => void;
}

export const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  isOpen,
  editAccount,
  onClose,
  onSaveAccount,
}) => {
  if (!isOpen) return null;

  const [bankName, setBankName] = useState(editAccount?.bankName || 'BNI');
  const [accountName, setAccountName] = useState(editAccount?.accountName || '');
  const [accountNumber, setAccountNumber] = useState(editAccount?.accountNumber || '');
  const [atasNama, setAtasNama] = useState(
    editAccount?.atasNama || 'Yayasan PM. Raudhatussalam Mahato'
  );
  const [accountTypeLabel, setAccountTypeLabel] = useState(
    editAccount?.accountTypeLabel || 'Rekening Operasional Harian Pesantren'
  );
  const [minThresholdStr, setMinThresholdStr] = useState(
    editAccount ? String(editAccount.minBalanceThreshold) : '50000000'
  );
  const [initialBalanceStr, setInitialBalanceStr] = useState(
    editAccount ? String(editAccount.saldo) : '0'
  );
  const [status, setStatus] = useState<'AKTIF' | 'NONAKTIF'>(
    editAccount?.status || 'AKTIF'
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim()) {
      setErrorMsg('Nama rekening wajib diisi.');
      return;
    }
    if (!accountNumber.trim()) {
      setErrorMsg('Nomor rekening bank wajib diisi.');
      return;
    }

    const masked =
      accountNumber.length > 4
        ? `**** **** **** ${accountNumber.slice(-4)}`
        : accountNumber;

    onSaveAccount({
      bankName,
      accountName,
      accountNumber,
      accountNumberMasked: masked,
      atasNama,
      accountTypeLabel,
      minBalanceThreshold: Number(minThresholdStr) || 0,
      saldo: editAccount ? editAccount.saldo : Number(initialBalanceStr) || 0,
      saldoAwal: editAccount ? editAccount.saldoAwal : Number(initialBalanceStr) || 0,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editAccount ? 'Edit Rekening Bank' : 'Tambah Rekening Bank Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Konfigurasi rekening resmi perbankan pesantren
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

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NAMA BANK
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="BNI">Bank Negara Indonesia (BNI)</option>
                <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                <option value="Bank Mandiri">Bank Mandiri</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                STATUS REKENING
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="AKTIF">Aktif (Digunakan Transaksi)</option>
                <option value="NONAKTIF">Non-Aktif (Arsip)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              NAMA REKENING / PERUNTUKAN
            </label>
            <input
              type="text"
              required
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Contoh: BNI Rekening Pembangunan Gedung"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                NOMOR REKENING (ASLI)
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Contoh: 0845123984"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ATAS NAMA (PEMILIK)
              </label>
              <input
                type="text"
                required
                value={atasNama}
                onChange={(e) => setAtasNama(e.target.value)}
                placeholder="Yayasan PM. Raudhatussalam Mahato"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              TIPE / DESKRIPSI REKENING
            </label>
            <input
              type="text"
              value={accountTypeLabel}
              onChange={(e) => setAccountTypeLabel(e.target.value)}
              placeholder="Contoh: Rekening Giro Penampungan Pembayaran Santri"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                BATAS MINIMUM SALDO (RP)
              </label>
              <input
                type="number"
                value={minThresholdStr}
                onChange={(e) => setMinThresholdStr(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Peringatan otomatis jika saldo dibawah nominal ini
              </p>
            </div>

            {!editAccount && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  SALDO AWAL PEMBUKAAN (RP)
                </label>
                <input
                  type="number"
                  value={initialBalanceStr}
                  onChange={(e) => setInitialBalanceStr(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-[11px] text-emerald-900 leading-relaxed flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              Nomor rekening akan otomatis disensor (masking) pada tampilan umum demi keamanan data perbankan yayasan.
            </span>
          </div>

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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              {editAccount ? 'Perbarui Rekening' : 'Simpan Rekening Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
