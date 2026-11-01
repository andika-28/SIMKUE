import React from 'react';
import {
  X,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Landmark,
  FileText,
  Building,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { BankReconciliationItem, UnreconciledItem } from '../../types';

interface ReconciliationMismatchModalProps {
  recon: BankReconciliationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onResolveItem: (reconId: string, itemId: string) => void;
  onOpenAdjustmentModal: (accountId?: string, initialAmount?: number, initialReason?: string) => void;
}

export const ReconciliationMismatchModal: React.FC<ReconciliationMismatchModalProps> = ({
  recon,
  isOpen,
  onClose,
  onResolveItem,
  onOpenAdjustmentModal,
}) => {
  if (!isOpen || !recon) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pemeriksaan Selisih Rekonsiliasi Bank
              </h3>
              <p className="text-xs text-slate-500">
                {recon.bankAccountName} • Periode: {recon.period}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Comparison Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 block">Saldo Sistem</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                {formatRupiah(recon.systemBalance)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 block">Saldo Rek. Koran</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                {formatRupiah(recon.bankStatementBalance)}
              </span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[11px] font-medium text-amber-700 block">Total Selisih</span>
              <span className="text-sm font-extrabold text-amber-800 mt-0.5 block">
                {formatRupiah(recon.difference)}
              </span>
            </div>
          </div>

          {/* Unreconciled Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Daftar Item Belum Seimbang ({recon.unreconciledItems.length} Transaksi)
              </h4>
              <span className="text-[11px] text-slate-400">Pilih tindakan untuk menyelesaikan</span>
            </div>

            <div className="space-y-2.5">
              {recon.unreconciledItems.length === 0 ? (
                <div className="p-6 text-center bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  Semua transaksi telah selesai direkonsiliasi.
                </div>
              ) : (
                recon.unreconciledItems.map((item: UnreconciledItem) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.description}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {item.date} • No. Ref: <span className="font-mono text-slate-700">{item.referenceNo}</span>
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Nominal:{' '}
                        <span className="font-bold text-slate-900">
                          {formatRupiah(item.amount)}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          onOpenAdjustmentModal(
                            recon.bankAccountId,
                            item.amount,
                            `Penyesuaian atas: ${item.description} (${item.referenceNo})`
                          );
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] shadow-2xs transition-colors"
                      >
                        Buat Penyesuaian
                      </button>
                      <button
                        onClick={() => onResolveItem(recon.id, item.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-2xs transition-colors"
                      >
                        Tandai Selesai
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Petunjuk Penyelesaian Rekonsiliasi:</p>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-500">
              <li>Untuk dana yang masih dalam proses kliring bank, pantau mutasi koran H+1.</li>
              <li>Untuk potongan administrasi bank bulanan, buat jurnal koreksi melalui menu Penyesuaian Saldo.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
