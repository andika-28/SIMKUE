import React, { useState } from 'react';
import {
  Landmark,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Info,
  ExternalLink,
} from 'lucide-react';
import { sampleBankReconciliations } from '../../data/importPaymentData';

export const BankReconciliationIndicator: React.FC = () => {
  const [reconciliations, setReconciliations] = useState(sampleBankReconciliations);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div
      id="bank-reconciliation-card"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Integrasi & Rekonsiliasi Mutasi Rekening Bank
            </h3>
            <p className="text-xs text-slate-500">
              Pencocokan saldo mutasi kas masuk perbankan dengan total file pembayaran terimpor
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-sync-bank-mutasi"
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#064E3B]' : 'text-slate-500'}`} />
          <span>Sinkronisasi Mutasi Bank</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reconciliations.map((bank) => {
          const isMatched = bank.status === 'SESUAI';

          return (
            <div
              key={bank.accountNumber}
              className={`p-4 rounded-xl border transition-all ${
                isMatched
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-amber-50/40 border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-900">
                      {bank.bankName}
                    </h4>
                    <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {bank.accountNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{bank.accountHolder}</p>
                </div>

                {isMatched ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>✓ SESUAI</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                    <AlertTriangle className="w-3 h-3 text-amber-700" />
                    <span>⚠ SELISIH</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-500 block">Total File Import:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(bank.totalImported)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Mutasi Bank:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(bank.bankMutationTotal)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Selisih:</span>
                  <span className={`font-black ${bank.difference === 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {formatRupiah(bank.difference)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Sinkronisasi terakhir: {bank.lastSyncTime}</span>
                <span className="font-mono text-emerald-800 font-bold">100% Reconciled</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
