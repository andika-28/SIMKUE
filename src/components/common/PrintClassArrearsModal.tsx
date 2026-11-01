import React from 'react';
import { X, Printer, CheckCircle2, Building, AlertTriangle } from 'lucide-react';
import { ClassArrears } from '../../types';
import { formatRupiah } from '../../data/initialData';

interface PrintClassArrearsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassArrears | null;
}

export const PrintClassArrearsModal: React.FC<PrintClassArrearsModalProps> = ({
  isOpen,
  onClose,
  classData,
}) => {
  if (!isOpen || !classData) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = '01 September 2026';

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div
        id="print-class-arrears-modal"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-fade-in print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-[#064E3B] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-200" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pratinjau Surat Tagihan & Rekap Tunggakan Kelas {classData.kelas}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-print-class-arrears-now"
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
            id="class-arrears-print-content"
            className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs max-w-2xl mx-auto text-slate-800 space-y-6 text-xs print:border-none print:shadow-none print:p-0"
          >
            {/* Header Kop Surat */}
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
                    Sistem Informasi Manajemen Keuangan (SIMKEU) Pesantren
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Kec. Tambusai Utara, Kab. Rokan Hulu, Riau 28558 • Telp: (0762) 891234
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[11px] font-mono font-bold">
                  SURAT TAGIHAN KELAS
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Dicetak: {currentDateFormatted}
                </p>
              </div>
            </div>

            {/* Document Title & Meta */}
            <div className="text-center space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 underline underline-offset-4">
                DAFTAR TUNGGAKAN IURAN PENDIDIKAN SANTRI
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Tingkat/Kelas: <strong>{classData.kelas}</strong> • Wali Kelas: <strong>{classData.waliKelas}</strong>
              </p>
            </div>

            {/* Class Arrears Highlight Cards */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center avoid-break">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Jumlah Santri Menunggak</span>
                <span className="text-sm font-black text-amber-700 mt-0.5 block">{classData.santriMenunggak} Santri</span>
              </div>
              <div className="border-l border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Nominal Tunggakan</span>
                <span className="text-sm font-black text-rose-700 mt-0.5 block">{formatRupiah(classData.totalTunggakan)}</span>
              </div>
            </div>

            {/* Student Breakdown Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <th className="p-2.5 w-10 text-center">No</th>
                    <th className="p-2.5 w-24">NIS</th>
                    <th className="p-2.5">Nama Santri</th>
                    <th className="p-2.5 w-28">Nama Wali</th>
                    <th className="p-2.5 w-24">Bulan Menunggak</th>
                    <th className="p-2.5 w-28 text-right">Nominal Tagihan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {classData.santriList && classData.santriList.length > 0 ? (
                    classData.santriList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/60">
                        <td className="p-2.5 text-center text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-700">{item.nis}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{item.nama}</td>
                        <td className="p-2.5 text-slate-600">{item.wali}</td>
                        <td className="p-2.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                            {item.bulan}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-bold text-rose-700">
                          {formatRupiah(item.nominal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400">
                        Tidak ada rincian santri untuk kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-[11px]">
                    <td colSpan={5} className="p-2.5 text-right uppercase">Total Tunggakan Kelas:</td>
                    <td className="p-2.5 text-right font-black text-rose-700">{formatRupiah(classData.totalTunggakan)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Transfer Instructions & Bank Info */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 space-y-1 avoid-break">
              <p className="font-bold flex items-center gap-1.5 text-[#064E3B]">
                <Building className="w-3.5 h-3.5" />
                Rekening Resmi Pembayaran Pesantren:
              </p>
              <p>• <strong>Bank BNI</strong>: 0829-1028-47 (a.n. Pondok Modern Raudhatussalam Mahato)</p>
              <p>• Mohon konfirmasi bukti transfer melalui Bendahara Pesantren: 0812-3456-7890</p>
            </div>

            {/* Official Signatures */}
            <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs avoid-break">
              <div className="space-y-12">
                <div>
                  <p className="text-slate-500">Wali Kelas {classData.kelas},</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 underline">{classData.waliKelas}</p>
                  <p className="text-[10px] text-slate-500">Ustadz / Ustadzah Pengampu</p>
                </div>
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
