import React from 'react';
import { X, Printer, Download, Building, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StudentArrearItem } from '../../types';

interface ArrearsInvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  arrear: StudentArrearItem | null;
}

export const ArrearsInvoicePrintModal: React.FC<ArrearsInvoicePrintModalProps> = ({
  isOpen,
  onClose,
  arrear,
}) => {
  if (!isOpen || !arrear) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const currentDateFormatted = '01 September 2026';

  return (
    <div className="fixed inset-0 z-[75] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div
        id="print-arrears-invoice-modal"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-fade-in print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-[#064E3B] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-200" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pratinjau Surat Pemberitahuan Tunggakan Santri
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-print-arrear-invoice-now"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 print:p-0 print:bg-white">
          <div
            id="arrears-invoice-print-content"
            className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs max-w-xl mx-auto text-slate-800 space-y-6 text-xs print:border-none print:shadow-none print:p-0"
          >
            {/* Header Pesantren */}
            <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                  R
                </div>
                <div>
                  <h1 className="text-base font-black uppercase tracking-wider text-[#064E3B] leading-tight">
                    Pondok Modern Raudhatussalam Mahato
                  </h1>
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    Bagian Administrasi Keuangan Pesantren (SIMKEU)
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Jl. Lintas Mahato KM. 24, Kec. Tambusai Utara, Rokan Hulu, Riau 28558
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-800 rounded text-[11px] font-mono font-bold">
                  SURAT TAGIHAN
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  No: ST/2026/09/{arrear.nis}
                </p>
              </div>
            </div>

            {/* Recipient Letter Section */}
            <div className="space-y-1.5 leading-relaxed text-xs">
              <p className="text-slate-600">
                Kepada Yth. Bapak/Ibu Wali Santri dari:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Nama Santri:</span>
                  <span className="col-span-2 font-black text-slate-900">{arrear.namaSantri}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">NIS:</span>
                  <span className="col-span-2 font-mono font-bold text-slate-800">{arrear.nis}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Kelas / Asrama:</span>
                  <span className="col-span-2 font-medium text-slate-800">{arrear.kelas} ({arrear.unit}) • {arrear.asrama}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Nama Wali / No. HP:</span>
                  <span className="col-span-2 font-medium text-slate-800">{arrear.namaWali} ({arrear.teleponWali})</span>
                </div>
              </div>
            </div>

            <p className="leading-relaxed text-slate-700">
              <em>Assalamu'alaikum Warahmatullahi Wabarakatuh.</em><br />
              Bersama surat ini kami sampaikan rekapitulasi kewajiban administrasi iuran pesantren yang belum terselesaikan hingga per <strong>{currentDateFormatted}</strong> sebagai berikut:
            </p>

            {/* Bill Details Breakdown */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <th className="p-2.5">Komponen Pembiayaan</th>
                    <th className="p-2.5 w-28">Keterangan / Bulan</th>
                    <th className="p-2.5 w-32 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {/* Monthly Unpaid Breakdown */}
                  {arrear.rincianBulanan && arrear.rincianBulanan.length > 0 ? (
                    arrear.rincianBulanan.map((rb, idx) => (
                      <tr key={`mb-${idx}`} className="hover:bg-slate-50">
                        <td className="p-2.5 font-medium text-slate-900">
                          <div>Tagihan Bulanan - {rb.periode}</div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            SPP: {formatRupiah(rb.spp)} • Makan: {formatRupiah(rb.uangMakan)} • Listrik/Air: {formatRupiah(rb.listrikAir)}
                          </div>
                        </td>
                        <td className="p-2.5 text-slate-600">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            {rb.periode}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-800">
                          {formatRupiah(rb.total)}
                        </td>
                      </tr>
                    ))
                  ) : arrear.tunggakanBulanan > 0 ? (
                    <tr>
                      <td className="p-2.5 font-medium text-slate-900">
                        Tunggakan SPP & Operasional Bulanan
                      </td>
                      <td className="p-2.5 text-slate-600">
                        {arrear.periodeTerlama} ({arrear.jumlahBulanMenunggak} bln)
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-800">
                        {formatRupiah(arrear.tunggakanBulanan)}
                      </td>
                    </tr>
                  ) : null}

                  {/* Yearly Fee Granular Breakdown */}
                  {arrear.rincianTahunan?.pembangunan?.sisa > 0 && (
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-medium text-slate-900">
                        <div>Iuran Tahunan: Uang Pembangunan</div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          Total: {formatRupiah(arrear.rincianTahunan.pembangunan.total)} • Dibayar: {formatRupiah(arrear.rincianTahunan.pembangunan.sudahDibayar)}
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-600">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-900">
                          Pembangunan
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-800">
                        {formatRupiah(arrear.rincianTahunan.pembangunan.sisa)}
                      </td>
                    </tr>
                  )}

                  {arrear.rincianTahunan?.kertas?.sisa > 0 && (
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-medium text-slate-900">
                        <div>Iuran Tahunan: Uang Kertas & Ujian</div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          Total: {formatRupiah(arrear.rincianTahunan.kertas.total)} • Dibayar: {formatRupiah(arrear.rincianTahunan.kertas.sudahDibayar)}
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-600">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-900">
                          Uang Kertas
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-800">
                        {formatRupiah(arrear.rincianTahunan.kertas.sisa)}
                      </td>
                    </tr>
                  )}

                  {arrear.rincianTahunan?.kegiatan?.sisa > 0 && (
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-medium text-slate-900">
                        <div>Iuran Tahunan: Uang Kegiatan Santri</div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          Total: {formatRupiah(arrear.rincianTahunan.kegiatan.total)} • Dibayar: {formatRupiah(arrear.rincianTahunan.kegiatan.sudahDibayar)}
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-600">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-900">
                          Uang Kegiatan
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-800">
                        {formatRupiah(arrear.rincianTahunan.kegiatan.sisa)}
                      </td>
                    </tr>
                  )}

                  {arrear.tunggakanBulanan === 0 && (!arrear.tunggakanTahunan || arrear.tunggakanTahunan === 0) && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-emerald-700 font-bold">
                        Seluruh kewajiban pembayaran telah lunas.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-red-50 border-t-2 border-red-200 text-red-950 font-bold text-xs">
                    <td colSpan={2} className="p-2.5 text-right uppercase">TOTAL TUNGGAKAN:</td>
                    <td className="p-2.5 text-right font-black text-sm text-red-700">{formatRupiah(arrear.totalTunggakan)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment Info */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 space-y-1 avoid-break">
              <p className="font-bold flex items-center gap-1.5 text-[#064E3B]">
                <Building className="w-3.5 h-3.5" />
                Rekening Resmi Pembayaran Pesantren:
              </p>
              <p>• <strong>Bank BNI</strong>: 0829-1028-47 (a.n. Pondok Modern Raudhatussalam Mahato)</p>
              <p>• Layanan Konfirmasi WhatsApp Bagian Keuangan: <strong>0812-3456-7890</strong></p>
            </div>

            {/* Closing & Signatures */}
            <div className="pt-4 grid grid-cols-2 gap-8 text-center text-xs avoid-break">
              <div className="space-y-12 text-left">
                <p className="text-slate-500 italic text-[11px]">
                  "Menunaikan amanah tepat waktu merupakan bagian dari kelancaran proses tarbiyah ananda tercinta."
                </p>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-slate-500">Mahato, {currentDateFormatted}</p>
                  <p className="font-bold text-slate-800">Bendahara Pesantren</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 underline">H. Ahmad Syarif, M.Pd.</p>
                  <p className="text-[10px] text-slate-500">NIP. 19850914 201101 1 004</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
