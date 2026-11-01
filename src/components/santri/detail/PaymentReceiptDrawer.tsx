import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Receipt,
  FileCheck,
  Building,
  User,
  Calendar,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { DetailedPayment, Student } from '../../../types';
import { formatRupiah } from '../../../data/initialData';

interface PaymentReceiptDrawerProps {
  payment: DetailedPayment | null;
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onOpenPrintModal: (payment: DetailedPayment) => void;
}

export const PaymentReceiptDrawer: React.FC<PaymentReceiptDrawerProps> = ({
  payment,
  student,
  isOpen,
  onClose,
  onOpenPrintModal,
}) => {
  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col transform transition ease-in-out duration-300 animate-in slide-in-from-right">
          
          {/* HEADER */}
          <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-[#064E3B] border border-emerald-100">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
                  Detail Pembayaran
                </h3>
                <p className="text-xs text-[#64748B]">
                  Kuitansi Pembayaran Terverifikasi
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

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            
            {/* Status Header */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Status Transaksi
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#064E3B] mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  BERHASIL
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Nominal Diterima
                </span>
                <span className="font-mono text-base font-extrabold text-[#064E3B]">
                  {formatRupiah(payment.nominal)}
                </span>
              </div>
            </div>

            {/* Payment Details Metadata List */}
            <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">No. Referensi</span>
                <span className="font-mono font-bold text-[#064E3B]">
                  {payment.noReferensi}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Tanggal Pembayaran</span>
                <span className="font-semibold text-[#1E293B]">
                  {payment.tanggal}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Nama Santri</span>
                <span className="font-semibold text-[#1E293B]">
                  {payment.namaSantri || student.nama}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">NIS</span>
                <span className="font-mono font-bold text-[#1E293B]">
                  {payment.nis || student.nis}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Jenis Pembayaran</span>
                <span className="font-semibold text-[#1E293B]">
                  {payment.jenisPembayaran}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-[#64748B]">Periode</span>
                <span className="font-semibold text-[#1E293B]">
                  {payment.periode}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Sumber / Metode</span>
                <span className="font-semibold text-[#064E3B]">
                  {payment.sumber}
                </span>
              </div>
            </div>

            {/* Note / Remarks */}
            {payment.catatan && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                  Keterangan Pembayaran
                </span>
                <p className="text-xs text-[#334155] mt-1 italic">
                  "{payment.catatan}"
                </p>
              </div>
            )}

            {/* Electronic verification tag */}
            <div className="p-3 bg-slate-100/70 rounded-lg text-[11px] text-[#64748B] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#064E3B] flex-shrink-0" />
              <span>
                Dokumen ini merupakan bukti sah transaksi keuangan PM. Raudhatussalam Mahato.
              </span>
            </div>

          </div>

          {/* FOOTER */}
          <div className="p-5 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
            <button
              id="btn-cetak-kwitansi"
              onClick={() => onOpenPrintModal(payment)}
              className="w-full py-2.5 rounded-lg bg-[#064E3B] hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kwitansi</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] transition"
            >
              Tutup
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
