import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, QrCode } from 'lucide-react';
import { DetailedPayment, Student } from '../../../types';
import { formatRupiah } from '../../../data/initialData';

interface OfficialReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: DetailedPayment | null;
  student: Student;
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  student,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  // Convert numbers to Indonesian words for receipt
  const numberToWords = (num: number): string => {
    if (num === 850000) return 'Delapan Ratus Lima Puluh Ribu Rupiah';
    if (num === 250000) return 'Dua Ratus Lima Puluh Ribu Rupiah';
    if (num === 200000) return 'Dua Ratus Ribu Rupiah';
    if (num === 400000) return 'Empat Ratus Ribu Rupiah';
    return `${formatRupiah(num)} Rupiah`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Control Bar */}
        <div className="bg-[#064E3B] text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-200" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pratinjau Kuitansi Pembayaran Resmi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Document */}
        <div ref={printRef} className="p-8 space-y-6 text-slate-800 bg-white">
          
          {/* Header Pesantren */}
          <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-black text-2xl border-2 border-emerald-800 flex-shrink-0">
                R
              </div>
              <div>
                <h2 className="text-base font-black text-[#064E3B] tracking-tight uppercase leading-tight">
                  Pondok Modern Raudhatussalam Mahato
                </h2>
                <p className="text-[11px] text-slate-600 font-medium">
                  Sistem Informasi Keuangan (SIMKEU) & Administrasi Santri Terpadu
                </p>
                <p className="text-[10px] text-slate-500">
                  Jl. Pesantren No. 01, Mahato, Kec. Tambusai Utara, Kab. Rokan Hulu, Riau
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-[#064E3B] border-b border-[#064E3B] pb-0.5 block">
                KUITANSI PEMBAYARAN
              </span>
              <p className="font-mono text-xs font-bold text-slate-800 mt-1">
                {payment.noReferensi}
              </p>
            </div>
          </div>

          {/* Receipt Body Table */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
              <span className="col-span-3 text-slate-500 font-medium">Telah Terima Dari</span>
              <span className="col-span-1 text-slate-400">:</span>
              <span className="col-span-8 font-bold text-slate-900">
                {student.namaWali} (Wali dari {payment.namaSantri || student.nama})
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
              <span className="col-span-3 text-slate-500 font-medium">NIS / Kelas / Unit</span>
              <span className="col-span-1 text-slate-400">:</span>
              <span className="col-span-8 font-mono text-slate-900 font-semibold">
                {student.nis} / {student.kelas} / {student.unit}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
              <span className="col-span-3 text-slate-500 font-medium">Uang Sejumlah</span>
              <span className="col-span-1 text-slate-400">:</span>
              <span className="col-span-8 italic font-semibold text-[#064E3B] bg-emerald-50/70 p-2 rounded border border-emerald-200">
                "{numberToWords(payment.nominal)}"
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
              <span className="col-span-3 text-slate-500 font-medium">Untuk Pembayaran</span>
              <span className="col-span-1 text-slate-400">:</span>
              <span className="col-span-8 font-semibold text-slate-900">
                {payment.jenisPembayaran} - Periode {payment.periode} ({payment.catatan || 'Lunas'})
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
              <span className="col-span-3 text-slate-500 font-medium">Metode & Sumber</span>
              <span className="col-span-1 text-slate-400">:</span>
              <span className="col-span-8 text-slate-700">
                {payment.metode || payment.sumber}
              </span>
            </div>
          </div>

          {/* Amount Box + Signature */}
          <div className="pt-4 flex items-end justify-between gap-6">
            <div className="p-4 bg-slate-50 border-2 border-slate-300 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Jumlah Terbayar
              </span>
              <span className="text-2xl font-black font-mono text-[#064E3B]">
                {formatRupiah(payment.nominal)}
              </span>
              <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                STATUS: LUNAS & TERVERIFIKASI
              </div>
            </div>

            {/* Official Stamp & Sign */}
            <div className="text-center text-xs space-y-1">
              <p className="text-[11px] text-slate-500">
                Mahato, {payment.tanggal}
              </p>
              <p className="text-[11px] font-bold text-slate-700">
                Bendahara Keuangan Pesantren
              </p>
              <div className="h-14 flex items-center justify-center relative">
                <div className="w-20 h-10 border border-dashed border-emerald-400 rounded-full flex items-center justify-center text-[9px] font-black text-emerald-700 uppercase transform -rotate-6">
                  TERBAYAR
                </div>
              </div>
              <p className="font-bold underline text-slate-900">
                {payment.petugas || 'Ust. Hendra, S.E.'}
              </p>
              <p className="text-[10px] text-slate-400">NIP. 20180901004</p>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:bg-slate-100 transition"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-[#064E3B] hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-2 transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kuitansi Resmi</span>
          </button>
        </div>

      </div>
    </div>
  );
};
