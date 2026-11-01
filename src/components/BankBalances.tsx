import React, { useState } from 'react';
import {
  Landmark,
  Eye,
  EyeOff,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { BankAccount } from '../types';
import { formatRupiah } from '../data/initialData';

interface BankBalancesProps {
  accounts: BankAccount[];
}

export const BankBalances: React.FC<BankBalancesProps> = ({ accounts }) => {
  const [showBalance, setShowBalance] = useState<{ [key: string]: boolean }>({
    'rek-1': true,
    'rek-2': true,
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleVisibility = (id: string) => {
    setShowBalance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="bank-balances-section" className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
              Saldo Rekening
            </h3>
            <span className="text-[10px] font-bold bg-emerald-50 text-[#064E3B] px-2 py-0.5 rounded border border-emerald-100">
              Sinkronisasi BNI Direct
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Ringkasan saldo rekening aktif pesantren
          </p>
        </div>

        <button
          onClick={() => {
            const allVisible = Object.values(showBalance).every(Boolean);
            const newState = accounts.reduce((acc, accObj) => {
              acc[accObj.id] = !allVisible;
              return acc;
            }, {} as { [key: string]: boolean });
            setShowBalance(newState);
          }}
          className="text-xs font-semibold text-[#64748B] hover:text-[#1E293B] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition shadow-xs"
        >
          {Object.values(showBalance).every(Boolean) ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Sembunyikan Semua</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Tampilkan Semua</span>
            </>
          )}
        </button>
      </div>

      {/* Two Horizontal Bank Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => {
          const isVisible = showBalance[acc.id] ?? true;

          return (
            <div
              key={acc.id}
              id={`bank-card-${acc.id}`}
              className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-150 relative overflow-hidden group"
            >
              <div className="flex flex-col justify-between h-full space-y-4">
                {/* Bank Header & Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* BNI Bank Logo Emblem */}
                    <div className="w-10 h-10 rounded-lg bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      <div className="text-center leading-none">
                        <span className="font-extrabold tracking-tighter text-sm">BNI</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#1E293B]">
                          {acc.bankName}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#064E3B] border border-emerald-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
                          {acc.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] font-medium">
                        {acc.accountType}
                      </p>
                    </div>
                  </div>

                  {/* Masked Account Number & Copy */}
                  <div className="flex items-center gap-2 bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#E2E8F0] text-xs font-mono text-[#334155]">
                    <span>{acc.accountNumberMasked}</span>
                    <button
                      onClick={() => handleCopy(acc.id, `0892-01-000492-50-8 (${acc.accountType})`)}
                      className="text-[#94A3B8] hover:text-[#064E3B] transition"
                      title="Salin No. Rekening"
                    >
                      {copiedId === acc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Saldo & Visibility Toggle */}
                <div className="flex items-end justify-between pt-3 border-t border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                      Saldo Tersedia
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xl font-extrabold text-[#1E293B] font-sans tracking-tight">
                        {isVisible ? formatRupiah(acc.saldo) : 'Rp ••••••••••'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleVisibility(acc.id)}
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition"
                    title={isVisible ? 'Sembunyikan Saldo' : 'Tampilkan Saldo'}
                  >
                    {isVisible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
