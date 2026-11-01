import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Upload,
  HelpCircle,
  Clock,
  ShieldCheck,
  Building,
  Check,
  X,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { BankReconciliationItem, UnreconciledItem } from '../../types';

interface BankReconciliationSectionProps {
  reconciliations: BankReconciliationItem[];
  onOpenResolveMismatch: (recon: BankReconciliationItem) => void;
  onOpenAdjustmentModal: (accountId?: string, initialAmount?: number, initialReason?: string) => void;
  onShowToast: (msg: string) => void;
}

export const BankReconciliationSection: React.FC<BankReconciliationSectionProps> = ({
  reconciliations,
  onOpenResolveMismatch,
  onOpenAdjustmentModal,
  onShowToast,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncBank = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onShowToast('Sinkronisasi mutasi rekening BNI berhasil diperbarui.');
    }, 1000);
  };

  return (
    <div
      id="bank-reconciliation-section"
      className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rekonsiliasi Rekening Bank
            </h3>
            <p className="text-xs text-slate-500">
              Bandingkan saldo sistem dengan saldo rekening bank (Rekening Koran) secara berkala.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncBank}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
            Sinkronkan Saldo Bank
          </button>
        </div>
      </div>

      {/* Reconciliation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reconciliations.map((recon) => {
          const isMatched = recon.status === 'SESUAI';

          return (
            <div
              key={recon.id}
              id={`recon-card-${recon.id}`}
              className={`rounded-xl p-5 border transition-all ${
                isMatched
                  ? 'bg-gradient-to-b from-white to-emerald-50/30 border-emerald-200 shadow-xs'
                  : 'bg-gradient-to-b from-white to-amber-50/30 border-amber-200 shadow-xs'
              }`}
            >
              {/* Account Title & Status Badge */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {recon.bankAccountName}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Periode: {recon.period} • Update: {recon.lastReconciliationDate}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isMatched
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {isMatched ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      SESUAI
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      PERLU REKONSILIASI
                    </>
                  )}
                </span>
              </div>

              {/* Balance Comparison Details */}
              <div className="grid grid-cols-3 gap-2 py-4 text-center">
                {/* Saldo Sistem */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-500">Saldo Sistem</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {formatRupiah(recon.systemBalance)}
                  </p>
                </div>

                {/* Saldo Bank */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-500">Saldo Bank (Koran)</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {formatRupiah(recon.bankStatementBalance)}
                  </p>
                </div>

                {/* Selisih */}
                <div
                  className={`p-2.5 rounded-lg border ${
                    isMatched
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-amber-50/70 border-amber-200'
                  }`}
                >
                  <p className="text-[11px] font-medium text-slate-500">Selisih</p>
                  <p
                    className={`text-xs font-extrabold mt-1 ${
                      isMatched ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {formatRupiah(recon.difference)}
                  </p>
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  {isMatched ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Semua transaksi sistem cocok dengan rekening koran
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Terdapat {recon.unreconciledItems.length} transaksi belum seimbang
                    </span>
                  )}
                </div>

                {!isMatched && (
                  <button
                    id={`btn-periksa-selisih-${recon.id}`}
                    onClick={() => onOpenResolveMismatch(recon)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    Periksa Selisih
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Workflow Steps: Rekonsiliasi Workflow */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Alur Kerja Rekonsiliasi Keuangan Pesantren
          </p>
          <span className="text-[11px] text-slate-500">Prosedur Audit Standar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
          {/* Step 1 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center mb-1">
              1
            </span>
            <span className="font-semibold text-slate-800 text-[11px]">Saldo Sistem vs Bank</span>
            <span className="text-[10px] text-slate-400">Tarik data mutasi BNI</span>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center mb-1">
              2
            </span>
            <span className="font-semibold text-slate-800 text-[11px]">Identifikasi Selisih</span>
            <span className="text-[10px] text-slate-400">Deteksi selisih nominal</span>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center mb-1">
              3
            </span>
            <span className="font-semibold text-slate-800 text-[11px]">Periksa Transaksi</span>
            <span className="text-[10px] text-slate-400">Cek kliring / biaya admin</span>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center mb-1">
              4
            </span>
            <span className="font-semibold text-slate-800 text-[11px]">Buat Penyesuaian</span>
            <span className="text-[10px] text-slate-400">Jurnal penyesuaian + nota</span>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-3 rounded-lg border border-emerald-300 bg-emerald-50/40 shadow-2xs flex flex-col items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center mb-1">
              ✓
            </span>
            <span className="font-semibold text-emerald-900 text-[11px]">Rekonsiliasi Selesai</span>
            <span className="text-[10px] text-emerald-700">Saldo 100% seimbang</span>
          </div>
        </div>
      </div>
    </div>
  );
};
