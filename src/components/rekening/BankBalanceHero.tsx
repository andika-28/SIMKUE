import React from 'react';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowLeftRight,
  Plus,
  FileCheck2,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { BankAccountItem } from '../../types';

interface BankBalanceHeroProps {
  totalBalance: number;
  totalIncomeMonth: number;
  totalExpenseMonth: number;
  netSurplusMonth: number;
  lastUpdated: string;
  activeAccountsCount: number;
  onOpenTransferModal: () => void;
  onOpenAdjustmentModal: () => void;
  onOpenAddAccountModal: () => void;
  onScrollToReconciliation: () => void;
}

export const BankBalanceHero: React.FC<BankBalanceHeroProps> = ({
  totalBalance,
  totalIncomeMonth,
  totalExpenseMonth,
  netSurplusMonth,
  lastUpdated,
  activeAccountsCount,
  onOpenTransferModal,
  onOpenAdjustmentModal,
  onOpenAddAccountModal,
  onScrollToReconciliation,
}) => {
  return (
    <div
      id="bank-balance-hero-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#065F46] text-white p-6 sm:p-8 shadow-xl border border-[#064E3B]/20"
    >
      {/* Subtle Background Pattern & Glow */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-teal-300/10 blur-2xl pointer-events-none" />

      {/* Decorative Wave lines in background */}
      <svg
        className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 pointer-events-none"
        viewBox="0 0 400 200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0,150 C100,190 200,80 300,120 C350,140 380,60 400,80 L400,200 L0,200 Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Main Balance & Meta */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-100 text-xs font-semibold tracking-wide backdrop-blur-xs border border-emerald-300/20">
              <Building2 className="w-3.5 h-3.5" />
              Sistem Saldo Terpusat BNI
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              {activeAccountsCount} Rekening Aktif
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-200/80 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              Update: {lastUpdated}
            </span>
          </div>

          <div>
            <p className="text-emerald-100 text-sm font-medium tracking-wide">
              Total Saldo Bank
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                {formatRupiah(totalBalance)}
              </h1>
            </div>
            <p className="text-xs text-emerald-200/90 mt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Akumulasi seluruh rekening aktif pesantren (Real-Time System Balance)
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-quick-transfer"
            onClick={onOpenTransferModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#064E3B] font-semibold text-sm hover:bg-emerald-50 transition-all shadow-md active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#064E3B]" />
            Transfer Antar Rekening
          </button>
          <button
            id="btn-quick-adjust"
            onClick={onOpenAdjustmentModal}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800/80 text-white font-medium text-sm border border-emerald-300/30 transition-all active:scale-95"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-300" />
            Penyesuaian Saldo
          </button>
          <button
            id="btn-quick-add-account"
            onClick={onOpenAddAccountModal}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/70 text-white font-medium text-sm border border-emerald-400/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            Tambah Rekening
          </button>
        </div>
      </div>

      {/* Bottom Mini Metrics Bar */}
      <div className="mt-6 pt-6 border-t border-emerald-400/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Total Masuk Bulan Ini */}
        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-100 font-medium">Total Masuk Bulan Ini</p>
            <p className="text-lg font-bold text-white mt-0.5">
              +{formatRupiah(totalIncomeMonth)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-400/20 flex items-center justify-center text-emerald-200">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Total Keluar Bulan Ini */}
        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-100 font-medium">Total Keluar Bulan Ini</p>
            <p className="text-lg font-bold text-rose-200 mt-0.5">
              -{formatRupiah(totalExpenseMonth)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-400/20 flex items-center justify-center text-rose-200">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Saldo Bertambah (Surplus) */}
        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-100 font-medium">Saldo Bertambah (Surplus)</p>
            <p className="text-lg font-bold text-amber-200 mt-0.5">
              +{formatRupiah(netSurplusMonth)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-200">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
