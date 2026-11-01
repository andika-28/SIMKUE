import React from 'react';
import {
  X,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Tag,
  Printer,
  MessageSquare,
  Building,
  User,
  CreditCard,
  Layers,
} from 'lucide-react';
import { DetailedBill, Student } from '../../../types';
import { formatRupiah } from '../../../data/initialData';

interface BillDetailDrawerProps {
  bill: DetailedBill | null;
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSendWhatsApp: (bill: DetailedBill) => void;
  onPrintBill: (bill: DetailedBill) => void;
}

export const BillDetailDrawer: React.FC<BillDetailDrawerProps> = ({
  bill,
  student,
  isOpen,
  onClose,
  onSendWhatsApp,
  onPrintBill,
}) => {
  if (!isOpen || !bill) return null;

  const isLunas = bill.status === 'LUNAS';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col transform transition ease-in-out duration-300 animate-in slide-in-from-right">
          
          {/* DRAWER HEADER */}
          <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-[#064E3B] border border-emerald-100">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
                  Detail Tagihan
                </h3>
                <p className="text-xs text-[#64748B]">
                  {bill.jenisTagihan} • {bill.periode}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* DRAWER CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            
            {/* Student identity banner */}
            <div className="bg-slate-50 rounded-xl p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#1E293B]">
                    {student.nama}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    NIS: <span className="font-mono text-[#1E293B] font-semibold">{student.nis}</span> • {student.kelas} {student.unit}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {student.paketMakan}
                </span>
              </div>
            </div>

            {/* Status card */}
            <div
              className={`rounded-xl p-4 border ${
                isLunas
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-rose-50/60 border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Status Tagihan
                  </span>
                  <div className="mt-1">
                    {isLunas ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#064E3B]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        LUNAS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-700">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        BELUM LUNAS
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Jatuh Tempo
                  </span>
                  <p className="text-xs font-semibold text-[#1E293B] mt-0.5">
                    {bill.jatuhTempo || '10 September 2026'}
                  </p>
                </div>
              </div>
            </div>

            {/* Itemized breakdown (Rincian Tagihan) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#1E293B]">
                  Rincian Tagihan
                </h4>
                <span className="text-[10px] text-[#64748B]">
                  Komponen Biaya
                </span>
              </div>

              <div className="space-y-2.5">
                {bill.breakdown && bill.breakdown.length > 0 ? (
                  bill.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between py-1.5 border-b border-slate-100 last:border-0"
                    >
                      <div>
                        <span className="font-semibold text-[#1E293B] block">
                          {item.label}
                        </span>
                        {item.subLabel && (
                          <span className="text-[10px] text-[#64748B] block">
                            {item.subLabel}
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-[#334155]">
                        {formatRupiah(item.nominal)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start justify-between py-1.5">
                    <span className="font-semibold text-[#1E293B]">{bill.rincian}</span>
                    <span className="font-mono font-bold text-[#334155]">{formatRupiah(bill.nominal)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Calculations: Subtotal, Diskon, Total Akhir */}
            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] space-y-2 font-medium">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono">{formatRupiah(bill.nominal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-600" />
                  Diskon
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  {bill.diskon > 0 ? `-${formatRupiah(bill.diskon)}` : 'Rp0'}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-sm font-extrabold text-[#1E293B]">
                <span className="uppercase text-xs tracking-wider text-[#064E3B]">
                  TOTAL TAGIHAN
                </span>
                <span className="font-mono text-base text-[#064E3B]">
                  {formatRupiah(bill.totalAkhir)}
                </span>
              </div>
            </div>

            {/* Arrears note if unpaid */}
            {!isLunas && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  Sesuai ketentuan, tagihan bulanan harus dibayar penuh senilai <strong className="font-mono">{formatRupiah(bill.totalAkhir)}</strong>.
                </p>
              </div>
            )}

          </div>

          {/* DRAWER FOOTER / ACTIONS */}
          <div className="p-5 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSendWhatsApp(bill)}
                className="px-3 py-2 rounded-lg border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Kirim WA</span>
              </button>

              <button
                onClick={() => onPrintBill(bill)}
                className="px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#334155] font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
              >
                <Printer className="w-3.5 h-3.5 text-[#064E3B]" />
                <span>Cetak Slip</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] transition"
            >
              Tutup Rincian
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
