import React, { useState } from 'react';
import {
  X,
  Ban,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { ExpenseItem } from '../../types';

interface CancelExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseItem | null;
  onConfirmCancel: (expense: ExpenseItem, reason: string) => void;
}

export const CancelExpenseModal: React.FC<CancelExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onConfirmCancel,
}) => {
  const [alasanBatal, setAlasanBatal] = useState<string>('');

  if (!isOpen || !expense) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp ');
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alasanBatal.trim()) {
      alert('Wajib memasukkan alasan pembatalan transaksi!');
      return;
    }
    onConfirmCancel(expense, alasanBatal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="modal-cancel-expense"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 text-xs"
      >
        <div className="p-5 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-300">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Batalkan Transaksi Pengeluaran
              </h3>
              <p className="text-slate-500 font-mono text-[11px]">
                {expense.transactionNo}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-rose-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCancel} className="p-6 space-y-4">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-900">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[11px]">
                Perhatian: Transaksi tidak dihapus permanen.
              </p>
              <p className="text-[10px] text-rose-700 leading-relaxed">
                Status transaksi akan diubah menjadi <strong className="font-black">DIBATALKAN</strong> dan saldo rekening sebesar <strong className="font-mono">{formatRupiah(expense.nominal)}</strong> akan otomatis dikembalikan ke <strong>{expense.rekening}</strong>.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Kategori:</span>
              <span className="font-bold text-slate-900">{expense.kategori}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nominal:</span>
              <span className="font-black text-rose-600 font-mono">
                {formatRupiah(expense.nominal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Keterangan:</span>
              <span className="text-slate-700 truncate max-w-[200px]">
                {expense.keterangan}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="cancel-exp-reason" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Alasan Pembatalan <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="cancel-exp-reason"
              required
              rows={3}
              value={alasanBatal}
              onChange={(e) => setAlasanBatal(e.target.value)}
              placeholder="Contoh: Transaksi salah input / nota dibatalkan oleh pihak toko supplier."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="submit"
              id="btn-confirm-cancel-expense"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Ban className="w-4 h-4" />
              <span>Ya, Batalkan Transaksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
