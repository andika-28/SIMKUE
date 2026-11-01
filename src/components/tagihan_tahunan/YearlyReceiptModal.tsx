import React from 'react';
import { X, Printer, Download, CheckCircle2, Building2 } from 'lucide-react';
import { YearlyBillRow } from '../../types';

interface YearlyReceiptModalProps {
  isOpen: boolean;
  bill: YearlyBillRow | null;
  onClose: () => void;
}

export const YearlyReceiptModal: React.FC<YearlyReceiptModalProps> = ({
  isOpen,
  bill,
  onClose,
}) => {
  if (!isOpen || !bill) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          id="modal-yearly-receipt"
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95"
        >
          {/* Header Controls (Non-printable) */}
          <div className="p-4 border-b border-[#E2E8F0] bg-slate-50/80 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pratinjau Kuitansi Tagihan Tahunan
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="p-8 bg-white space-y-6 text-slate-900 text-xs">
            {/* Kop Surat */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-extrabold text-2xl">
                  R
                </div>
                <div>
                  <h2 className="text-base font-extrabold uppercase tracking-tight text-[#064E3B]">
                    PM. Raudhatussalam Mahato
                  </h2>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Sistem Informasi Pengelolaan Keuangan & Tagihan Santri
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Jl. Pesantren No. 01, Mahato, Riau | Telp: (0761) 889211
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[10px] font-mono font-bold rounded border border-slate-200">
                  {bill.noReferensiTerakhir || `INV-YRB-${bill.nis}`}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Tahun Ajaran: <strong className="text-slate-800">{bill.tahunAjaran}</strong>
                </p>
              </div>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Nama Santri:</span>
                  <p className="font-bold text-sm text-[#0F172A]">{bill.namaSantri}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">NIS:</span>
                  <p className="font-mono font-bold text-slate-700">{bill.nis}</p>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Unit & Kelas:</span>
                  <p className="font-bold text-slate-800">{bill.unit} - {bill.kelas}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Status Santri:</span>
                  <p className="font-bold text-slate-800">{bill.statusSantri}</p>
                </div>
              </div>
            </div>

            {/* Billing Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100/80 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Komponen Biaya</th>
                    <th className="py-2.5 px-3">Keterangan Termin</th>
                    <th className="py-2.5 px-3 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">1</td>
                    <td className="py-2.5 px-3 font-semibold">Uang Pembangunan</td>
                    <td className="py-2.5 px-3 text-slate-600">{bill.statusSantri}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {formatRupiah(bill.uangPembangunan)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">2</td>
                    <td className="py-2.5 px-3 font-semibold">Uang Kertas (Semester Ganjil)</td>
                    <td className="py-2.5 px-3 text-slate-600">Termin 1 (Juli - Des)</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {formatRupiah(bill.uangKertasGanjil.nominal)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">3</td>
                    <td className="py-2.5 px-3 font-semibold">Uang Kertas (Semester Genap)</td>
                    <td className="py-2.5 px-3 text-slate-600">Termin 2 (Jan - Juni)</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {formatRupiah(bill.uangKertasGenap.nominal)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">4</td>
                    <td className="py-2.5 px-3 font-semibold">Uang Kegiatan (Semester Ganjil)</td>
                    <td className="py-2.5 px-3 text-slate-600">Termin 1 (Juli - Des)</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {formatRupiah(bill.uangKegiatanGanjil.nominal)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">5</td>
                    <td className="py-2.5 px-3 font-semibold">Uang Kegiatan (Semester Genap)</td>
                    <td className="py-2.5 px-3 text-slate-600">Termin 2 (Jan - Juni)</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {formatRupiah(bill.uangKegiatanGenap.nominal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals & Status */}
            <div className="flex justify-end">
              <div className="w-72 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Total Tagihan:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(bill.totalTagihan)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Sudah Dibayar:</span>
                  <span className="font-bold">{formatRupiah(bill.sudahDibayar)}</span>
                </div>
                <div className="flex justify-between text-rose-700 pt-1.5 border-t border-slate-200 font-extrabold text-sm">
                  <span>Sisa Tagihan:</span>
                  <span>{formatRupiah(bill.sisaTagihan)}</span>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-8 grid grid-cols-2 text-center text-xs">
              <div>
                <p className="text-slate-500">Wali Santri,</p>
                <div className="h-14" />
                <p className="font-bold text-slate-900 border-t border-slate-300 inline-block px-8 pt-1">
                  ( {bill.namaWali || '................................'} )
                </p>
              </div>
              <div>
                <p className="text-slate-500">Bendahara Pesantren,</p>
                <div className="h-14 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    TERVERIFIKASI SISTEM
                  </span>
                </div>
                <p className="font-bold text-slate-900 border-t border-slate-300 inline-block px-8 pt-1">
                  ( Ust. Ahmad Syafii, S.E. )
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
