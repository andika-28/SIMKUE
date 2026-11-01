import React from 'react';
import {
  X,
  Printer,
  Download,
  Building,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ExpenseItem } from '../../types';

interface VoucherReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseItem | null;
}

export const VoucherReceiptModal: React.FC<VoucherReceiptModalProps> = ({
  isOpen,
  onClose,
  expense,
}) => {
  if (!isOpen || !expense) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp ');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div
        id="modal-voucher-kas"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* Modal Action Bar (Hidden when printed) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-800">
              Voucher Pengeluaran Kas (Bukti Kas Keluar - BPK)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-print-voucher-action"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Voucher</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentic Printable Voucher Sheet */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-900 text-xs font-sans print:p-6 print:text-black">
          {/* Header Kop Pesantren */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <h2 className="text-base font-black uppercase tracking-wider">
              PONDOK MODERN RAUDHATUSSALAM MAHATO
            </h2>
            <p className="text-[11px] text-slate-600">
              Sistem Informasi Manajemen Keuangan (SIMKEU) Pesantren
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Mahato, Rokan Hulu, Riau • Telp: (0762) 88921 • www.raudhatussalam-mahato.sch.id
            </p>
          </div>

          {/* Title */}
          <div className="text-center space-y-0.5">
            <h3 className="text-sm font-black uppercase underline tracking-widest">
              BUKTI PENGELUARAN KAS (BPK)
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700">
              No. Voucher: {expense.transactionNo}
            </span>
          </div>

          {/* Details Table */}
          <div className="border border-slate-300 rounded-lg p-4 space-y-3 bg-slate-50/50 print:bg-transparent">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Tanggal Transaksi:</span>
              <span className="col-span-2 font-bold">{expense.tanggal}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Kategori / Akun:</span>
              <span className="col-span-2 font-bold text-[#064E3B]">
                {expense.kategori} ({expense.kategoriCode})
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Sumber Rekening / Kas:</span>
              <span className="col-span-2 font-bold">{expense.rekening}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Unit / Bagian:</span>
              <span className="col-span-2 font-bold">{expense.unit ? `Unit ${expense.unit}` : '-'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-500 font-medium">Keterangan Belanja:</span>
              <span className="col-span-2 text-slate-800 leading-relaxed">
                {expense.keterangan}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
              <span className="text-slate-700 font-black">Jumlah Kas Keluar:</span>
              <span className="col-span-2 text-base font-black font-mono text-rose-700">
                {formatRupiah(expense.nominal)}
              </span>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
            <div className="space-y-16">
              <span className="text-slate-500 font-medium block">Penerima Kas,</span>
              <div>
                <div className="border-b border-slate-900 w-32 mx-auto" />
                <span className="text-[10px] text-slate-600 block mt-1">
                  ( {expense.pengajuanOleh || '..........................'} )
                </span>
              </div>
            </div>

            <div className="space-y-16">
              <span className="text-slate-500 font-medium block">Bendahara Pesantren,</span>
              <div>
                <div className="border-b border-slate-900 w-32 mx-auto" />
                <span className="text-[10px] text-slate-600 block mt-1 font-bold">
                  ( {expense.dicatatOleh.split('(')[0].trim()} )
                </span>
              </div>
            </div>

            <div className="space-y-16">
              <span className="text-slate-500 font-medium block">Mengetahui / Pimpinan,</span>
              <div>
                <div className="border-b border-slate-900 w-32 mx-auto" />
                <span className="text-[10px] text-slate-600 block mt-1 font-bold">
                  ( KH. Abdullah Rasyid )
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Dicetak secara otomatis dari SIMKEU Pesantren</span>
            <span>Status Bukti: {expense.statusBukti}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
