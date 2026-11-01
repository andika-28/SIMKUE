import React from 'react';
import { AlertTriangle, ArrowRight, BellRing, PhoneCall } from 'lucide-react';

interface QuickAlertBannerProps {
  unpaidCount: number;
  unpaidNominal: number;
  periode: string;
  onFilterUnpaid: () => void;
  onSendReminders?: () => void;
}

export const QuickAlertBanner: React.FC<QuickAlertBannerProps> = ({
  unpaidCount,
  unpaidNominal,
  periode,
  onFilterUnpaid,
  onSendReminders,
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
      id="quick-alert-banner"
      className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 md:p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300/80 flex items-center justify-center text-amber-800 flex-shrink-0 mt-0.5 md:mt-0">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-amber-900">Perhatian</h4>
            <span className="bg-amber-200/70 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
              Prioritas Follow-up
            </span>
          </div>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            <strong className="font-semibold">{unpaidCount} Santri</strong> masih memiliki tagihan bulan <strong>{periode}</strong> yang belum lunas. Total tunggakan:{' '}
            <strong className="font-bold text-rose-700">{formatRupiah(unpaidNominal)}</strong>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center w-full md:w-auto justify-end">
        {onSendReminders && (
          <button
            type="button"
            onClick={onSendReminders}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-800" />
            <span>Kirim Notifikasi WA</span>
          </button>
        )}
        <button
          type="button"
          id="btn-lihat-tunggakan"
          onClick={onFilterUnpaid}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors"
        >
          <span>Lihat Tunggakan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
