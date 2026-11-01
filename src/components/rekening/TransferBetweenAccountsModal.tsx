import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeftRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Landmark,
  Building,
  Info,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { BankAccountItem } from '../../types';

interface TransferBetweenAccountsModalProps {
  isOpen: boolean;
  accounts: BankAccountItem[];
  defaultSourceAccountId?: string;
  onClose: () => void;
  onConfirmTransfer: (data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    date: string;
    notes: string;
  }) => void;
}

export const TransferBetweenAccountsModal: React.FC<TransferBetweenAccountsModalProps> = ({
  isOpen,
  accounts,
  defaultSourceAccountId,
  onClose,
  onConfirmTransfer,
}) => {
  if (!isOpen) return null;

  const [fromAccountId, setFromAccountId] = useState<string>(
    defaultSourceAccountId || accounts[0]?.id || ''
  );
  const [toAccountId, setToAccountId] = useState<string>(
    accounts.find((a) => a.id !== (defaultSourceAccountId || accounts[0]?.id))?.id || ''
  );
  const [amountStr, setAmountStr] = useState<string>('50000000');
  const [transferDate, setTransferDate] = useState<string>('2026-09-01');
  const [notes, setNotes] = useState<string>('Transfer alokasi dana operasional bulanan');
  const [isConfirmationStep, setIsConfirmationStep] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (defaultSourceAccountId) {
      setFromAccountId(defaultSourceAccountId);
      const target = accounts.find((a) => a.id !== defaultSourceAccountId);
      if (target) setToAccountId(target.id);
    }
  }, [defaultSourceAccountId, accounts]);

  const sourceAccount = accounts.find((a) => a.id === fromAccountId);
  const targetAccount = accounts.find((a) => a.id === toAccountId);
  const amountNumber = Number(amountStr) || 0;

  // Validation
  const validateForm = () => {
    if (!fromAccountId || !toAccountId) {
      setErrorMsg('Pilih rekening asal dan rekening tujuan.');
      return false;
    }
    if (fromAccountId === toAccountId) {
      setErrorMsg('Rekening asal dan tujuan tidak boleh sama.');
      return false;
    }
    if (amountNumber <= 0) {
      setErrorMsg('Nominal transfer harus lebih dari Rp 0.');
      return false;
    }
    if (sourceAccount && amountNumber > sourceAccount.saldo) {
      setErrorMsg(
        `Saldo rekening asal tidak mencukupi (${formatRupiah(sourceAccount.saldo)}).`
      );
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNextToConfirm = () => {
    if (validateForm()) {
      setIsConfirmationStep(true);
    }
  };

  const handleFinalSubmit = () => {
    if (validateForm()) {
      onConfirmTransfer({
        fromAccountId,
        toAccountId,
        amount: amountNumber,
        date: transferDate,
        notes,
      });
      setIsConfirmationStep(false);
      onClose();
    }
  };

  // Calculations for before / after
  const totalBefore = (sourceAccount?.saldo || 0) + (targetAccount?.saldo || 0);
  const sourceAfter = (sourceAccount?.saldo || 0) - amountNumber;
  const targetAfter = (targetAccount?.saldo || 0) + amountNumber;
  const totalAfter = sourceAfter + targetAfter;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isConfirmationStep
                  ? 'Konfirmasi Transfer Antar Rekening'
                  : 'Transfer Antar Rekening Bank'}
              </h3>
              <p className="text-xs text-slate-500">
                {isConfirmationStep
                  ? 'Periksa kembali rincian pemindahan dana internal'
                  : 'Pencatatan pemindahan dana internal antar rekening pesantren'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsConfirmationStep(false);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isConfirmationStep ? (
            /* STEP 1: FORM INPUT */
            <div className="space-y-4">
              {/* From Account & To Account Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From Account */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    DARI REKENING (SUMBER)
                  </label>
                  <select
                    value={fromAccountId}
                    onChange={(e) => {
                      setFromAccountId(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountName} ({formatRupiah(acc.saldo)})
                      </option>
                    ))}
                  </select>
                  {sourceAccount && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Saldo tersedia: <span className="font-bold text-slate-800">{formatRupiah(sourceAccount.saldo)}</span>
                    </p>
                  )}
                </div>

                {/* To Account */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    KE REKENING (TUJUAN)
                  </label>
                  <select
                    value={toAccountId}
                    onChange={(e) => {
                      setToAccountId(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountName} ({formatRupiah(acc.saldo)})
                      </option>
                    ))}
                  </select>
                  {targetAccount && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Saldo saat ini: <span className="font-bold text-slate-800">{formatRupiah(targetAccount.saldo)}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Amount & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nominal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    NOMINAL TRANSFER (RP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={amountStr}
                      onChange={(e) => {
                        setAmountStr(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full pl-10 pr-3 py-2.5 text-sm font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    {['10000000', '25000000', '50000000', '100000000'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmountStr(preset)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-600"
                      >
                        {formatRupiah(Number(preset)).replace(',00', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    TANGGAL TRANSFER
                  </label>
                  <input
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  KETERANGAN / KEPERLUAN TRANSFER
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Pemindahan dana cadangan untuk operasional belanja dapur santri..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Business Rule Banner */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#064E3B] flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  Prinsip Saldo Terpadu Pesantren
                </p>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Transfer antar rekening bank hanyalah perpindahan alokasi dana internal. Total saldo keseluruhan pesantren tidak akan bertambah atau berkurang.
                </p>
              </div>
            </div>
          ) : (
            /* STEP 2: CONFIRMATION VIEW */
            <div className="space-y-4">
              {/* Transfer Overview Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Nominal Transfer:</span>
                  <span className="text-base font-extrabold text-[#064E3B]">
                    {formatRupiah(amountNumber)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      DARI (SUMBER)
                    </span>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">
                      {sourceAccount?.accountName}
                    </p>
                    <p className="text-[11px] text-rose-600 font-semibold">
                      -{formatRupiah(amountNumber)}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      KE (TUJUAN)
                    </span>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">
                      {targetAccount?.accountName}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      +{formatRupiah(amountNumber)}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-400">Keterangan: </span>
                  <span className="text-slate-700 font-medium">{notes}</span>
                </div>
              </div>

              {/* Before / After Breakdown Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Rekening</th>
                      <th className="py-2.5 px-3 text-right">Sebelum</th>
                      <th className="py-2.5 px-3 text-right">Sesudah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-2 px-3 text-slate-700">{sourceAccount?.accountName}</td>
                      <td className="py-2 px-3 text-right text-slate-500">{formatRupiah(sourceAccount?.saldo || 0)}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">{formatRupiah(sourceAfter)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-slate-700">{targetAccount?.accountName}</td>
                      <td className="py-2 px-3 text-right text-slate-500">{formatRupiah(targetAccount?.saldo || 0)}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">{formatRupiah(targetAfter)}</td>
                    </tr>
                    <tr className="bg-emerald-50/60 font-bold text-emerald-900">
                      <td className="py-2.5 px-3">TOTAL SALDO PESANTREN</td>
                      <td className="py-2.5 px-3 text-right">{formatRupiah(totalBefore)}</td>
                      <td className="py-2.5 px-3 text-right text-[#064E3B]">{formatRupiah(totalAfter)} (Tetap Sama)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Warning Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Perpindahan dana akan langsung tercatat ke dalam mutasi kedua rekening dan diverifikasi pada sesi rekonsiliasi.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {!isConfirmationStep ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleNextToConfirm}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                Lanjut ke Konfirmasi
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsConfirmationStep(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Kembali Edit
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Konfirmasi Transfer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
