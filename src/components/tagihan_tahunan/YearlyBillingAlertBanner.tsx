import React from 'react';
import { AlertTriangle, ArrowRight, Clock, Users } from 'lucide-react';

interface YearlyBillingAlertBannerProps {
  unpaidCount: number;
  remainingNominal: number;
  onFilterArrears: () => void;
}

export const YearlyBillingAlertBanner: React.FC<YearlyBillingAlertBannerProps> = ({
  unpaidCount,
  remainingNominal,
  onFilterArrears,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div
      id="yearly-billing-alert-banner"
      className="p-4 md:p-5 bg-amber-50/90 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-amber-800" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
              Perhatian
            </span>
            <span className="text-xs font-bold text-amber-900">
              Monitoring Piutang Tagihan Tahunan
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong className="font-bold text-amber-950">{unpaidCount} Santri</strong> masih memiliki sisa tagihan tahunan yang belum diselesaikan. Total piutang tertunggak:{' '}
            <strong className="font-extrabold text-amber-950">{formatRupiah(remainingNominal)}</strong>.
          </p>
        </div>
      </div>

      <button
        type="button"
        id="btn-lihat-tunggakan-tahunan"
        onClick={onFilterArrears}
        className="self-stretch sm:self-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex-shrink-0"
      >
        <span>Lihat Daftar Tunggakan</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
