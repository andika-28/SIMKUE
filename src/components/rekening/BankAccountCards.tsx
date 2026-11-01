import React, { useState } from 'react';
import {
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Building,
  Receipt,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { BankAccountItem, BankManagementRole } from '../../types';

interface BankAccountCardsProps {
  accounts: BankAccountItem[];
  totalBalance: number;
  currentRole: BankManagementRole;
  onSelectAccountDetail: (account: BankAccountItem) => void;
  onSelectAccountMutation: (account: BankAccountItem) => void;
  onOpenTransferModal: (defaultSourceAccountId?: string) => void;
}

export const BankAccountCards: React.FC<BankAccountCardsProps> = ({
  accounts,
  totalBalance,
  currentRole,
  onSelectAccountDetail,
  onSelectAccountMutation,
  onOpenTransferModal,
}) => {
  // State to track if account numbers are unmasked
  const [unmaskedAccounts, setUnmaskedAccounts] = useState<Record<string, boolean>>({});

  const toggleMask = (id: string) => {
    setUnmaskedAccounts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#064E3B]" />
            Rekening Bank Aktif Pesantren
          </h2>
          <p className="text-xs text-slate-500">
            Dua rekening BNI resmi penampungan seluruh dana operasional dan pembangunan santri.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Real-Time Sync Terhubung ke Server BNI
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((acc, index) => {
          const isUnmasked = unmaskedAccounts[acc.id] || false;
          const displayAccNo = isUnmasked ? acc.accountNumber : acc.accountNumberMasked;
          const percentageOfTotal = totalBalance > 0 ? ((acc.saldo / totalBalance) * 100).toFixed(1) : '0';
          const isWarning = acc.saldo < acc.minBalanceThreshold;

          const isAccount1 = index === 0;

          return (
            <div
              key={acc.id}
              id={`bank-account-card-${acc.id}`}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isAccount1
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-500'
                }`}
              />

              {/* Header: Logo, Account Name, Number & Status Badge */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* BNI Brand Badge */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#005E6A] to-[#F15A24] p-0.5 shadow-xs flex-shrink-0 flex items-center justify-center">
                      <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                        <span className="font-black text-sm tracking-tight text-[#005E6A]">
                          BNI
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-800">
                          {acc.accountName}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {acc.accountTypeLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {acc.status}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {percentageOfTotal}% Total Saldo
                    </span>
                  </div>
                </div>

                {/* Account Number & Mask Toggle */}
                <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-[11px]">No. Rek:</span>
                    <span className="font-mono font-semibold text-slate-700 tracking-wider">
                      {displayAccNo}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleMask(acc.id)}
                    title={isUnmasked ? 'Sembunyikan nomor rekening' : 'Tampilkan nomor rekening'}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {isUnmasked ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Sensor</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Buka</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Balance Hero within card */}
                <div className="pt-2">
                  <p className="text-xs font-medium text-slate-500">SALDO SAAT INI</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {formatRupiah(acc.saldo)}
                    </span>
                  </div>
                </div>

                {/* Monthly Movement Progress & Numbers */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 flex-shrink-0">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-500">Masuk Bulan Ini</p>
                      <p className="text-xs font-bold text-emerald-700 truncate">
                        +{formatRupiah(acc.totalMasukBulanIni)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-100/80 flex items-center justify-center text-rose-700 flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-500">Keluar Bulan Ini</p>
                      <p className="text-xs font-bold text-rose-700 truncate">
                        -{formatRupiah(acc.totalKeluarBulanIni)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last Transaction Bar */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Transaksi Terakhir
                    </span>
                    <span>{acc.lastTransactionTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="font-semibold text-slate-700 truncate mr-2">
                      {acc.lastTransactionDesc}
                    </span>
                    <span
                      className={`font-bold whitespace-nowrap ${
                        acc.lastTransactionType === 'MASUK'
                          ? 'text-emerald-700'
                          : 'text-rose-600'
                      }`}
                    >
                      {acc.lastTransactionType === 'MASUK' ? '+' : '-'}
                      {formatRupiah(acc.lastTransactionAmount)}
                    </span>
                  </div>
                </div>

                {/* Warning if low balance */}
                {isWarning && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Saldo mendekati batas minimum operasional ({formatRupiah(acc.minBalanceThreshold)})</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  id={`btn-transfer-from-${acc.id}`}
                  onClick={() => onOpenTransferModal(acc.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Transfer
                </button>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-mutasi-${acc.id}`}
                    onClick={() => onSelectAccountMutation(acc)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Mutasi
                  </button>

                  <button
                    id={`btn-detail-${acc.id}`}
                    onClick={() => onSelectAccountDetail(acc)}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    Lihat Detail
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
