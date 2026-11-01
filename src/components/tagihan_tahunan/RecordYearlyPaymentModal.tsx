import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Building2,
  FileText,
  CalendarDays,
  Receipt,
  Wallet,
} from 'lucide-react';
import { YearlyBillRow } from '../../types';

interface RecordYearlyPaymentModalProps {
  isOpen: boolean;
  bill: YearlyBillRow | null;
  onClose: () => void;
  onSuccessPayment: (billId: string, paidAmount: number, paymentMethod: string) => void;
}

export const RecordYearlyPaymentModal: React.FC<RecordYearlyPaymentModalProps> = ({
  isOpen,
  bill,
  onClose,
  onSuccessPayment,
}) => {
  if (!isOpen || !bill) return null;

  const [paymentAmount, setPaymentAmount] = useState<number>(bill.sisaTagihan);
  const [metode, setMetode] = useState<string>('Transfer Bank BSI');
  const [catatan, setCatatan] = useState<string>('Pembayaran termin tagihan tahunan santri');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessPayment(bill.id, Math.min(paymentAmount, bill.sisaTagihan), metode);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          id="modal-record-yearly-payment"
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E2E8F0] bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
                <CreditCard className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  Catat Pembayaran Tagihan Tahunan
                </h3>
                <p className="text-xs text-slate-500">
                  {bill.namaSantri} ({bill.nis})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Summary info */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Sisa Tagihan Tertunggak:</span>
                <span className="font-extrabold text-rose-700 text-sm">
                  {formatRupiah(bill.sisaTagihan)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Total Tagihan:</span>
                <span className="font-bold text-slate-800">
                  {formatRupiah(bill.totalTagihan)}
                </span>
              </div>
            </div>

            {/* Quick Amount Options */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Pilih Opsi Pembayaran:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentAmount(bill.sisaTagihan)}
                  className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                    paymentAmount === bill.sisaTagihan
                      ? 'bg-emerald-50 border-emerald-400 text-[#064E3B] ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-[10px] text-slate-500">Pelunasan Penuh</span>
                  <span className="font-bold">{formatRupiah(bill.sisaTagihan)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentAmount(Math.round(bill.sisaTagihan / 2))}
                  className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                    paymentAmount === Math.round(bill.sisaTagihan / 2)
                      ? 'bg-emerald-50 border-emerald-400 text-[#064E3B] ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-[10px] text-slate-500">Cicilan 50%</span>
                  <span className="font-bold">{formatRupiah(Math.round(bill.sisaTagihan / 2))}</span>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Nominal Yang Dibayar (Rp):
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                max={bill.sisaTagihan}
                min={10000}
                required
                className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#064E3B]"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Metode Pembayaran:
              </label>
              <select
                value={metode}
                onChange={(e) => setMetode(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#064E3B]"
              >
                <option value="Transfer Bank BSI">Transfer Bank Syariah Indonesia (BSI)</option>
                <option value="Transfer Bank Muamalat">Transfer Bank Muamalat</option>
                <option value="Tunai / Kasir Pesantren">Tunai / Loket Kasir Pesantren</option>
                <option value="QRIS Pesantren">QRIS Pesantren</option>
              </select>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Catatan / Keterangan:
              </label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white font-bold rounded-xl shadow-xs"
              >
                {isSubmitting ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pembayaran</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
