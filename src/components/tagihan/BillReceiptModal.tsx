import React from 'react';
import { X, Printer, Download, CheckCircle2, AlertCircle, Building2, ShieldCheck } from 'lucide-react';
import { MonthlyBillRow } from '../../types';

interface BillReceiptModalProps {
  bill: MonthlyBillRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BillReceiptModal: React.FC<BillReceiptModalProps> = ({
  bill,
  isOpen,
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

  const isLunas = bill.status === 'LUNAS';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div
          id="bill-receipt-modal"
          className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header Action Bar */}
          <div className="px-6 py-4 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#064E3B]"></span>
              <h3 className="text-sm font-bold text-[#0F172A]">
                {isLunas ? 'Kuitansi Resmi Pembayaran' : 'Lembar Tagihan Bulanan'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Area */}
          <div className="p-8 bg-white text-slate-800 space-y-6 print:p-0">
            {/* Pesantren Official Kop */}
            <div className="border-b-2 border-[#064E3B] pb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-extrabold text-2xl flex-shrink-0 shadow-xs">
                  R
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#064E3B] tracking-tight uppercase leading-tight">
                    PONDOK MODERN RAUDHATUSSALAM MAHATO
                  </h2>
                  <p className="text-xs font-medium text-slate-600">
                    Kec. Tambusai Utara, Kab. Rokan Hulu, Riau | Telp: (0762) 887-219
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Sistem Informasi Manajemen Keuangan (SIMKEU) - Bagian Bendahara
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-100 rounded text-xs font-mono font-bold text-slate-700">
                  {bill.noReferensi || `TAG-${bill.nis}-0826`}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Dicetak: 01 September 2026
                </p>
              </div>
            </div>

            {/* Title & Status Watermark */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#64748B] tracking-wider">
                  Bukti Tagihan & Pembayaran
                </span>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Tagihan Bulanan ({bill.periode})
                </h3>
              </div>
              <div>
                {isLunas ? (
                  <div className="px-4 py-1.5 bg-emerald-100 border-2 border-emerald-600 rounded-lg text-emerald-800 font-extrabold text-sm tracking-wider uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    LUNAS
                  </div>
                ) : (
                  <div className="px-4 py-1.5 bg-rose-100 border-2 border-rose-600 rounded-lg text-rose-800 font-extrabold text-sm tracking-wider uppercase flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-700" />
                    BELUM LUNAS
                  </div>
                )}
              </div>
            </div>

            {/* Student Info Table */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="space-y-1.5">
                <div className="flex">
                  <span className="w-28 text-slate-500">Nama Santri:</span>
                  <strong className="text-slate-900">{bill.namaSantri}</strong>
                </div>
                <div className="flex">
                  <span className="w-28 text-slate-500">NIS:</span>
                  <span className="font-mono font-semibold">{bill.nis}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-slate-500">Unit / Jenjang:</span>
                  <span className="font-medium">{bill.unit}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex">
                  <span className="w-28 text-slate-500">Kelas:</span>
                  <strong className="text-slate-900">{bill.kelas}</strong>
                </div>
                <div className="flex">
                  <span className="w-28 text-slate-500">Paket Makan:</span>
                  <span className="font-medium">{bill.paketMakan}</span>
                </div>
                <div className="flex">
                  <span className="w-28 text-slate-500">Wali Santri:</span>
                  <span>{bill.namaWali || '-'}</span>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">No</th>
                  <th className="p-2.5">Komponen Tagihan</th>
                  <th className="p-2.5">Keterangan</th>
                  <th className="p-2.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-mono">1</td>
                  <td className="p-2.5 font-bold">SPP Bulanan</td>
                  <td className="p-2.5 text-slate-500">Iuran pendidikan operasional pondok</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{formatRupiah(bill.spp)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono">2</td>
                  <td className="p-2.5 font-bold">Uang Makan Dapur Santri</td>
                  <td className="p-2.5 text-slate-500">{bill.paketMakan} (30 hari)</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{formatRupiah(bill.uangMakan)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono">3</td>
                  <td className="p-2.5 font-bold">Iuran Listrik & Air Asrama</td>
                  <td className="p-2.5 text-slate-500">Fasilitas kamar & asrama santri</td>
                  <td className="p-2.5 text-right font-mono font-semibold">{formatRupiah(bill.listrikAir)}</td>
                </tr>
                {bill.diskon > 0 && (
                  <tr className="bg-emerald-50/50">
                    <td className="p-2.5 font-mono text-emerald-700">4</td>
                    <td className="p-2.5 font-bold text-emerald-800">Potongan / Diskon</td>
                    <td className="p-2.5 text-emerald-700">{bill.diskonKeterangan || 'Keringanan khusus'}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-800">
                      -{formatRupiah(bill.diskon)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={3} className="p-3 text-right uppercase text-slate-700">
                    Total Wajib Bayar:
                  </td>
                  <td className="p-3 text-right text-[#064E3B] text-sm font-black font-mono">
                    {formatRupiah(bill.totalTagihan)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Signature & Seal */}
            <div className="pt-4 flex items-end justify-between text-xs text-slate-600">
              <div>
                <p className="text-[11px] text-slate-400">
                  Catatan: Tagihan bulanan bersifat mengikat dan wajib dilunasi penuh.
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-emerald-800 text-[11px] font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dokumen Sah SIMKEU PM. Raudhatussalam Mahato</span>
                </div>
              </div>
              <div className="text-center w-48">
                <p className="text-slate-500">Mahato, Rokan Hulu</p>
                <p className="font-semibold text-slate-800 mt-1">Bendahara Pesantren</p>
                <div className="h-14 flex items-center justify-center">
                  <span className="text-[10px] text-emerald-700 font-serif italic border border-emerald-300 px-2 py-0.5 rounded bg-emerald-50/50">
                    [ Tanda Tangan & Cap Digital ]
                  </span>
                </div>
                <p className="font-bold text-slate-900 underline">Ust. Ahmad Fauzan, S.E.</p>
                <p className="text-[10px] text-slate-400">NIP: 19850412 201201 1 003</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
