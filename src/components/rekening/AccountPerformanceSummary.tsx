import React from 'react';
import {
  Trophy,
  ArrowDownLeft,
  ArrowUpRight,
  Activity,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';

interface AccountPerformanceSummaryProps {
  highestBalanceAccountName: string;
  highestBalanceAmount: number;
  incomeToday: number;
  expenseToday: number;
  totalTransactionsToday: number;
}

export const AccountPerformanceSummary: React.FC<AccountPerformanceSummaryProps> = ({
  highestBalanceAccountName,
  highestBalanceAmount,
  incomeToday,
  expenseToday,
  totalTransactionsToday,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Saldo Tertinggi */}
      <div
        id="kpi-saldo-tertinggi"
        className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex items-start justify-between"
      >
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-slate-500">Saldo Tertinggi</p>
          <h4 className="text-lg font-bold text-slate-800 truncate">
            {formatRupiah(highestBalanceAmount)}
          </h4>
          <p className="text-[11px] font-semibold text-emerald-700 truncate flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {highestBalanceAccountName}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 flex-shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
      </div>

      {/* Card 2: Pemasukan Hari Ini */}
      <div
        id="kpi-pemasukan-hari-ini"
        className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex items-start justify-between"
      >
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-slate-500">Pemasukan Hari Ini</p>
          <h4 className="text-lg font-bold text-emerald-700 truncate">
            +{formatRupiah(incomeToday)}
          </h4>
          <p className="text-[11px] font-medium text-slate-500">
            Dari pembayaran SPP & VA
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
          <ArrowDownLeft className="w-5 h-5" />
        </div>
      </div>

      {/* Card 3: Pengeluaran Hari Ini */}
      <div
        id="kpi-pengeluaran-hari-ini"
        className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-rose-300 transition-all flex items-start justify-between"
      >
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-slate-500">Pengeluaran Hari Ini</p>
          <h4 className="text-lg font-bold text-rose-600 truncate">
            -{formatRupiah(expenseToday)}
          </h4>
          <p className="text-[11px] font-medium text-slate-500">
            Dapur, operasional & logistik
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Card 4: Total Transaksi Hari Ini */}
      <div
        id="kpi-total-transaksi-hari-ini"
        className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all flex items-start justify-between"
      >
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-slate-500">Total Transaksi Hari Ini</p>
          <h4 className="text-lg font-bold text-slate-800">
            {totalTransactionsToday} Transaksi
          </h4>
          <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Tercatat & Terverifikasi
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 flex-shrink-0">
          <Activity className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
