import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Search,
  FileCheck2,
  Calendar,
  User,
  Paperclip,
  ArrowLeftRight,
} from 'lucide-react';
import { formatRupiah } from '../../data/initialData';
import { BankAdjustmentRecord } from '../../types';

interface BankAuditLogModalProps {
  isOpen: boolean;
  adjustments: BankAdjustmentRecord[];
  onClose: () => void;
}

export const BankAuditLogModal: React.FC<BankAuditLogModalProps> = ({
  isOpen,
  adjustments,
  onClose,
}) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = adjustments.filter(
    (a) =>
      a.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.bankAccountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Log Audit & Histori Penyesuaian Saldo Bank
              </h3>
              <p className="text-xs text-slate-500">
                Rekaman histori pembukuan transaksi koreksi dan otorisasi bank
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

        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ID audit, rekening, alasan, petugas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Tidak ada catatan audit yang sesuai.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isPlus = log.type === 'PENAMBAHAN';

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {log.id}
                      </span>
                      <span className="font-bold text-slate-800">
                        {log.bankAccountName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-extrabold text-xs ${
                          isPlus ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {isPlus ? '+' : '-'}
                        {formatRupiah(log.amount)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {log.createdDate}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-700 font-medium">
                    <span className="text-slate-400 font-normal">Alasan: </span>
                    {log.reason}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 text-slate-500 border-t border-slate-200/60">
                    <div>
                      <span>Saldo Sebelum: </span>
                      <span className="font-semibold text-slate-700">
                        {formatRupiah(log.previousBalance)}
                      </span>
                    </div>
                    <div>
                      <span>Saldo Sesudah: </span>
                      <span className="font-semibold text-slate-900">
                        {formatRupiah(log.newBalance)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{log.createdBy}</span>
                    </div>
                    {log.attachment && (
                      <div className="flex items-center gap-1 text-emerald-700 font-semibold truncate">
                        <Paperclip className="w-3 h-3" />
                        <span className="truncate">{log.attachment}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
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
