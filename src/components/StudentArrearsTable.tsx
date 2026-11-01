import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Users,
  GraduationCap,
  ChevronRight,
  Phone,
  Send,
  Download,
  Search,
  X,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { classArrearsData, formatRupiah } from '../data/initialData';
import { ClassArrears } from '../types';
import { PrintClassArrearsModal } from './common/PrintClassArrearsModal';

interface StudentArrearsTableProps {
  onViewAll?: () => void;
  onSelectClass?: (classItem: ClassArrears) => void;
}

export const StudentArrearsTable: React.FC<StudentArrearsTableProps> = ({
  onViewAll,
  onSelectClass,
}) => {
  const [selectedClassForDetail, setSelectedClassForDetail] = useState<ClassArrears | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [classToPrint, setClassToPrint] = useState<ClassArrears | null>(null);
  const [reminderSent, setReminderSent] = useState<{ [key: string]: boolean }>({});

  const totalSantriMenunggak = classArrearsData.reduce((acc, item) => acc + item.santriMenunggak, 0);
  const totalNominalTunggakan = classArrearsData.reduce((acc, item) => acc + item.totalTunggakan, 0);

  const handleSendReminder = (nis: string, nama: string) => {
    setReminderSent((prev) => ({ ...prev, [nis]: true }));
    setTimeout(() => {
      // notification simulated
    }, 1500);
  };

  return (
    <section id="student-arrears-section" className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
              Tunggakan Santri
            </h3>
            <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100">
              {totalSantriMenunggak} Santri Menunggak
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Ringkasan tagihan santri yang belum diselesaikan
          </p>
        </div>

        <button
          id="btn-view-all-arrears"
          onClick={() => {
            if (onViewAll) {
              onViewAll();
            } else {
              setSelectedClassForDetail(classArrearsData[0]);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B] hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-lg border border-emerald-200 transition group self-start sm:self-auto"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 rounded-l-lg">Kelas</th>
              <th className="py-3 px-4">Jumlah Santri Menunggak</th>
              <th className="py-3 px-4">Total Tunggakan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-xs font-medium text-[#334155]">
            {classArrearsData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#94A3B8]">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    <p className="font-semibold text-[#1E293B] text-xs">
                      Tidak Ada Tunggakan Santri
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
                      Seluruh kewajiban pembayaran telah diselesaikan atau belum ada tagihan aktif.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              classArrearsData.map((row) => {
              const isAttention = row.status === 'Perlu Perhatian';

              return (
                <tr
                  key={row.id}
                  id={`row-arrears-${row.id}`}
                  onClick={() => {
                    if (onSelectClass) onSelectClass(row);
                    else setSelectedClassForDetail(row);
                  }}
                  className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                >
                  {/* Kelas */}
                  <td className="py-3.5 px-4 font-bold text-[#1E293B] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] text-[#334155] flex items-center justify-center font-bold text-xs border border-[#E2E8F0] group-hover:border-[#064E3B] group-hover:bg-emerald-50 group-hover:text-[#064E3B] transition">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <span>{row.kelas}</span>
                  </td>

                  {/* Jumlah Santri Menunggak */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span className="font-semibold text-[#1E293B]">
                        {row.santriMenunggak} Santri
                      </span>
                    </div>
                  </td>

                  {/* Total Tunggakan */}
                  <td className="py-3.5 px-4 font-extrabold">
                    <span className={isAttention ? 'text-red-600' : 'text-[#1E293B]'}>
                      {formatRupiah(row.totalTunggakan)}
                    </span>
                  </td>

                  {/* Status Badges */}
                  <td className="py-3.5 px-4">
                    {isAttention ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Perlu Perhatian
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-[#064E3B] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Normal
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] text-[#064E3B] font-semibold inline-flex items-center gap-1 group-hover:underline">
                      Rincian
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>

      {/* Summary Row */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1E293B]">Total Akumulasi Tunggakan Pesantren:</span>
          <span className="text-sm font-extrabold text-red-600 bg-white px-2.5 py-0.5 rounded border border-[#E2E8F0]">
            {formatRupiah(totalNominalTunggakan)}
          </span>
        </div>
        <span className="text-[10px] text-[#94A3B8]">
          *Terdiri atas tagihan SPP bulanan, Uang Makan, dan Uang Gedung
        </span>
      </div>

      {/* Class Arrears Detail Modal */}
      {selectedClassForDetail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[70] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Daftar Tunggakan - {selectedClassForDetail.kelas}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {selectedClassForDetail.santriMenunggak} Santri
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total tagihan belum terbayar:{' '}
                  <span className="font-bold text-rose-600">
                    {formatRupiah(selectedClassForDetail.totalTunggakan)}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedClassForDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of individual students */}
            <div className="mt-4 space-y-3">
              {selectedClassForDetail.detailSantri && selectedClassForDetail.detailSantri.length > 0 ? (
                selectedClassForDetail.detailSantri.map((santri) => (
                  <div
                    key={santri.nis}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {santri.nama}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          NIS: {santri.nis}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Wali: <span className="font-medium text-slate-800">{santri.wali}</span> ({santri.telepon})
                      </p>
                      <p className="text-[11px] text-amber-700 font-medium">
                        Periode: {santri.bulanTunggakan}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                      <span className="text-sm font-extrabold text-rose-600">
                        {formatRupiah(santri.nominal)}
                      </span>
                      <button
                        onClick={() => handleSendReminder(santri.nis, santri.nama)}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                          reminderSent[santri.nis]
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {reminderSent[santri.nis] ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Terkirim WA
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            Kirim WA Wali
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">
                  Tidak ada data rincian tambahan untuk kelas ini.
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedClassForDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Tutup
              </button>
              <button
                type="button"
                id="btn-print-class-arrears"
                onClick={() => {
                  setClassToPrint(selectedClassForDetail);
                  setIsPrintModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Surat Tagihan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Class Arrears Modal */}
      <PrintClassArrearsModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        classData={classToPrint}
      />
    </section>
  );
};
