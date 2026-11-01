import React from 'react';
import { X, Printer, Download, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Student } from '../../../types';
import { formatRupiah } from '../../../data/initialData';

interface PrintStudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const PrintStudentProfileModal: React.FC<PrintStudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = '01 September 2026';

  return (
    <div className="fixed inset-0 z-[75] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div
        id="print-student-profile-modal"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-fade-in print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-[#064E3B] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-200" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Pratinjau Kartu Keuangan & Histori Pembayaran Santri
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="btn-print-student-profile-now"
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
            id="student-profile-print-content"
            className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs max-w-2xl mx-auto text-slate-800 space-y-6 text-xs print:border-none print:shadow-none print:p-0"
          >
            {/* Header Kop Surat Pesantren */}
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
                    Kartu Pembayaran & Status Keuangan Santri
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Jl. Lintas Mahato KM. 24, Kec. Tambusai Utara, Kab. Rokan Hulu, Riau 28558
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-slate-100 rounded text-[11px] font-mono font-bold text-slate-700 border border-slate-200">
                  NIS: {student.nis}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Dicetak: {currentDateFormatted}
                </p>
              </div>
            </div>

            {/* Student Biodata Summary */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-1.5">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Nama Lengkap Santri:</span>
                  <p className="text-xs font-bold text-slate-900">{student.nama}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Tingkat / Unit:</span>
                  <p className="text-xs font-bold text-[#064E3B]">{student.unit} ({student.kelas})</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Asrama / Kamar:</span>
                  <p className="text-xs font-medium text-slate-800">{student.asrama}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Nama Wali Santri:</span>
                  <p className="text-xs font-bold text-slate-900">{student.namaWali}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">No. Telepon / WhatsApp:</span>
                  <p className="text-xs font-mono text-slate-800">{student.teleponWali}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Kategori Tarif:</span>
                  <p className="text-xs font-medium text-slate-800">{student.kategoriBeasiswa || 'Reguler'}</p>
                </div>
              </div>
            </div>

            {/* Financial Summary Highlight */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-center avoid-break">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Kewajiban</span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">{formatRupiah(student.totalTagihan)}</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Disetor</span>
                <span className="text-sm font-black text-[#064E3B] mt-0.5 block">{formatRupiah(student.totalDibayar)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Sisa Tunggakan</span>
                <span className={`text-sm font-black mt-0.5 block ${student.sisaTunggakan > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {formatRupiah(student.sisaTunggakan)}
                </span>
              </div>
            </div>

            {/* Payment History Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Catatan Riwayat Pembayaran Sah
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <th className="p-2.5 w-24">No. Kuitansi</th>
                      <th className="p-2.5 w-24">Tanggal</th>
                      <th className="p-2.5">Uraian Pembayaran</th>
                      <th className="p-2.5 w-20">Metode</th>
                      <th className="p-2.5 w-28 text-right">Nominal</th>
                      <th className="p-2.5 w-20 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {student.riwayatPembayaran && student.riwayatPembayaran.length > 0 ? (
                      student.riwayatPembayaran.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="p-2.5 font-mono font-bold text-slate-700">{item.noReferensi}</td>
                          <td className="p-2.5 text-slate-600">{item.tanggal}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{item.keterangan}</td>
                          <td className="p-2.5 text-slate-600">{item.metode}</td>
                          <td className="p-2.5 text-right font-bold text-[#064E3B]">{formatRupiah(item.nominal)}</td>
                          <td className="p-2.5 text-center">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[9px] font-bold border border-emerald-200">
                              LUNAS
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-400">
                          Belum ada riwayat pembayaran yang tercatat.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs avoid-break">
              <div className="space-y-12">
                <div>
                  <p className="text-slate-500">Wali Santri,</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 underline">{student.namaWali}</p>
                  <p className="text-[10px] text-slate-500">Orang Tua / Wali</p>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-slate-500">Mahato, {currentDateFormatted}</p>
                  <p className="font-bold text-slate-800">Petugas Bendahara</p>
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
