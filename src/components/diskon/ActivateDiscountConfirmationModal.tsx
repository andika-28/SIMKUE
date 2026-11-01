import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { BillingDiscount } from '../../types';

interface ActivateDiscountConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  discountData: Partial<BillingDiscount> | null;
  onConfirm: () => void;
}

export const ActivateDiscountConfirmationModal: React.FC<
  ActivateDiscountConfirmationModalProps
> = ({ isOpen, onClose, discountData, onConfirm }) => {
  if (!isOpen || !discountData) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="modal-confirm-activate-discount"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Aktifkan Diskon?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Anda akan mengaktifkan diskon berikut:
          </p>

          {/* Highlight Recap Card */}
          <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-2.5">
            <div className="font-bold text-slate-900 text-sm">
              {discountData.namaDiskon}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Periode:</span>
                <span className="font-bold text-slate-800">
                  {discountData.periode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Target Diskon:</span>
                <span className="font-bold text-slate-800">
                  {discountData.targetDetail} ({discountData.santriTerdampakCount} Santri)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Diskon per Santri:</span>
                <span className="font-extrabold text-[#064E3B]">
                  - {formatRupiah(discountData.nominalDiskon || 0)}
                </span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">
                  Estimasi Total Diskon:
                </span>
                <span className="font-extrabold text-emerald-800 text-sm">
                  {formatRupiah(discountData.estimasiTotalDiskon || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <span>
              Diskon ini akan digunakan secara otomatis saat generate tagihan untuk periode {discountData.periode}.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="btn-cancel-activate-confirmation"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            id="btn-confirm-activate-discount-action"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#047857] rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ya, Aktifkan Diskon</span>
          </button>
        </div>
      </div>
    </div>
  );
};
