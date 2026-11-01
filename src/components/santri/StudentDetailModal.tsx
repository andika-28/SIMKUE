import React, { useState } from 'react';
import {
  X,
  User,
  CreditCard,
  Receipt,
  AlertTriangle,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Printer,
  Download,
  MessageCircle,
  FileSpreadsheet,
  Clock,
  ArrowDownLeft,
  Trophy,
  Award,
  BookOpen,
  HeartHandshake,
} from 'lucide-react';
import { Student } from '../../types';
import { formatRupiah } from '../../data/initialData';
import { MEAL_PACKAGES_INFO, SCHOLARSHIP_PACKAGES_INFO } from '../../data/studentsData';
import { PrintStudentProfileModal } from './detail/PrintStudentProfileModal';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEditStudent?: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onEditStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'tagihan' | 'pembayaran' | 'tunggakan'>('profil');
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  if (!isOpen || !student) return null;

  const mealInfo = MEAL_PACKAGES_INFO[student.paketMakan] || MEAL_PACKAGES_INFO['Paket C'];
  const scholarshipInfo = SCHOLARSHIP_PACKAGES_INFO[student.kategoriBeasiswa || 'Reguler'] || SCHOLARSHIP_PACKAGES_INFO['Reguler'];
  const baseSpp = 500000;
  const netSpp = Math.max(0, baseSpp - (student.potonganSPP ?? scholarshipInfo.discountAmount));

  const tagihanList = student.tagihanDetail || [
    { id: 'b-01', bulan: 'Juli', tahun: '2026', spp: netSpp, uangMakan: mealInfo.price, total: netSpp + mealInfo.price, terbayar: netSpp + mealInfo.price, tunggakan: 0, status: 'Lunas' as const, jatuhTempo: '10 Juli 2026' },
    { id: 'b-02', bulan: 'Agustus', tahun: '2026', spp: netSpp, uangMakan: mealInfo.price, total: netSpp + mealInfo.price, terbayar: Math.max(0, netSpp + mealInfo.price - student.totalTunggakan), tunggakan: student.totalTunggakan, status: (student.totalTunggakan > 0 ? (student.totalDibayar > 0 ? 'Sebagian' : 'Belum Lunas') : 'Lunas') as any, jatuhTempo: '10 Agustus 2026' },
  ];

  const paymentList = student.riwayatPembayaran || [
    { id: 'pay-01', tanggal: '15 Jul 2026', keterangan: `Pembayaran SPP (${student.kategoriBeasiswa || 'Reguler'}) & Konsumsi Juli 2026`, nominal: netSpp + mealInfo.price, metode: 'Virtual Account BNI', noReferensi: `VA-882100${student.nis}`, status: 'Berhasil' as const },
    { id: 'pay-02', tanggal: '10 Agu 2026', keterangan: `Pembayaran SPP & Konsumsi Sebagian Agustus 2026`, nominal: Math.max(250000, student.totalDibayar - netSpp - mealInfo.price), metode: 'Tunai Kasir', noReferensi: `CSH-${student.nis}-002`, status: 'Berhasil' as const },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl border border-[#E2E8F0] my-8 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {student.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-[#1E293B]">
                  {student.nama}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
                  {student.status}
                </span>
                {student.kategoriBeasiswa && student.kategoriBeasiswa !== 'Reguler' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    <Trophy className="w-3 h-3 text-purple-600" />
                    {student.kategoriBeasiswa}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-2">
                <span>NIS: <strong className="text-[#1E293B] font-mono">{student.nis}</strong></span>
                <span>•</span>
                <span>Unit: <strong className="text-[#064E3B]">{student.unit}</strong> ({student.kelas})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPrintOpen(true)}
              className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:text-[#064E3B] hover:bg-[#F8FAFC] transition cursor-pointer"
              title="Cetak Profil & Kartu Keuangan Santri"
              id="btn-print-student-profile"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Financial Summary Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 flex-shrink-0">
          {/* Total Tagihan */}
          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              Total Tagihan
            </span>
            <p className="text-base font-extrabold text-[#1E293B] mt-0.5">
              {formatRupiah(student.totalTagihan)}
            </p>
          </div>

          {/* Total Dibayar */}
          <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Total Dibayar
            </span>
            <p className="text-base font-extrabold text-[#064E3B] mt-0.5">
              {formatRupiah(student.totalDibayar)}
            </p>
          </div>

          {/* Total Tunggakan */}
          <div className={`p-3 rounded-xl border ${
            student.totalTunggakan > 0
              ? 'bg-amber-50/60 border-amber-200'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Total Tunggakan
            </span>
            <p className={`text-base font-extrabold mt-0.5 ${
              student.totalTunggakan > 0 ? 'text-amber-800' : 'text-slate-500'
            }`}>
              {formatRupiah(student.totalTunggakan)}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#E2E8F0] text-xs font-semibold flex-shrink-0">
          <button
            onClick={() => setActiveTab('profil')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'profil'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Profil & Wali
          </button>
          <button
            onClick={() => setActiveTab('tagihan')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'tagihan'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Tagihan Santri ({tagihanList.length})
          </button>
          <button
            onClick={() => setActiveTab('pembayaran')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'pembayaran'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Riwayat Pembayaran ({paymentList.length})
          </button>
          <button
            onClick={() => setActiveTab('tunggakan')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'tunggakan'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Tunggakan {student.totalTunggakan > 0 && <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">1</span>}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 text-xs space-y-4">
          {/* TAB 1: PROFIL */}
          {activeTab === 'profil' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                  <span className="font-bold text-[#1E293B] block">Data Akademik & Katering:</span>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Jenjang / Unit:</span>
                    <span className="font-bold text-[#1E293B]">{student.unit} ({student.kelas})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Paket Makan:</span>
                    <span className="font-bold text-[#064E3B]">{student.paketMakan} ({mealInfo.label})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Biaya Makan:</span>
                    <span className="font-bold text-[#1E293B]">{mealInfo.priceFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Tanggal Terdaftar:</span>
                    <span className="font-medium text-[#1E293B]">{student.tanggalMasuk}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                  <span className="font-bold text-[#1E293B] block">Kontak Orang Tua / Wali:</span>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Nama Wali:</span>
                    <span className="font-bold text-[#1E293B]">{student.namaWali}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">No. Handphone:</span>
                    <a
                      href={`https://wa.me/${student.noHpWali.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-bold text-[#064E3B] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {student.noHpWali}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#64748B] block mb-0.5">Alamat Domisili:</span>
                    <p className="font-medium text-[#1E293B] text-[11px] leading-relaxed">
                      {student.alamat || 'Tambusai Utara, Rokan Hulu, Riau'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Beasiswa Card */}
              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                    <Trophy className="w-4 h-4 text-purple-600" />
                    Kategori SPP & Beasiswa Santri:
                  </span>
                  <span className="font-bold text-xs text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                    {student.kategoriBeasiswa || 'Reguler'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-purple-200/60 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Skema Potongan SPP:</span>
                    <span className="font-bold text-purple-700">{scholarshipInfo.discountFormatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Tagihan SPP Bersih:</span>
                    <span className="font-extrabold text-[#064E3B]">{formatRupiah(netSpp)} / bln</span>
                  </div>
                </div>
                {student.catatanBeasiswa && (
                  <p className="text-[11px] text-purple-900 bg-white/80 p-2 rounded-lg border border-purple-200">
                    <strong className="text-purple-950">Catatan Prestasi: </strong>
                    {student.catatanBeasiswa}
                  </p>
                )}
              </div>

              {/* Quick Action Button for WhatsApp */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-900 font-medium">
                    Kirim rincian tagihan atau konfirmasi pembayaran ke wali santri via WhatsApp
                  </span>
                </div>
                <a
                  href={`https://wa.me/${student.noHpWali.replace(/[^0-9]/g, '')}?text=Assalamu'alaikum%20Bpk/Ibu%20${encodeURIComponent(student.namaWali)},%20informasi%20administrasi%20keuangan%20santri%20${encodeURIComponent(student.nama)}%20(NIS%20${student.nis})`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#064E3B] hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chat WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: TAGIHAN */}
          {activeTab === 'tagihan' && (
            <div className="space-y-3">
              <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Periode</th>
                      <th className="p-3">SPP Net</th>
                      <th className="p-3">Makan ({student.paketMakan})</th>
                      <th className="p-3">Total Tagihan</th>
                      <th className="p-3">Terbayar</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
                    {tagihanList.map((t) => (
                      <tr key={t.id} className="hover:bg-[#F8FAFC]">
                        <td className="p-3 font-semibold text-[#1E293B]">{t.bulan} {t.tahun}</td>
                        <td className="p-3 font-semibold text-purple-700">{formatRupiah(t.spp)}</td>
                        <td className="p-3">{formatRupiah(t.uangMakan)}</td>
                        <td className="p-3 font-bold text-[#1E293B]">{formatRupiah(t.total)}</td>
                        <td className="p-3 font-semibold text-[#064E3B]">{formatRupiah(t.terbayar)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'Lunas'
                              ? 'bg-emerald-50 text-[#064E3B] border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RIWAYAT PEMBAYARAN */}
          {activeTab === 'pembayaran' && (
            <div className="space-y-3">
              <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Keterangan</th>
                      <th className="p-3">Metode</th>
                      <th className="p-3">No. Referensi</th>
                      <th className="p-3 text-right">Nominal</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
                    {paymentList.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F8FAFC]">
                        <td className="p-3 font-mono text-[11px] text-[#64748B]">{p.tanggal}</td>
                        <td className="p-3 font-semibold text-[#1E293B]">{p.keterangan}</td>
                        <td className="p-3 text-[#64748B]">{p.metode}</td>
                        <td className="p-3 font-mono text-[11px] text-[#64748B]">{p.noReferensi}</td>
                        <td className="p-3 text-right font-extrabold text-[#064E3B]">{formatRupiah(p.nominal)}</td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#064E3B]" />
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TUNGGAKAN */}
          {activeTab === 'tunggakan' && (
            <div className="space-y-3">
              {student.totalTunggakan > 0 ? (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      Rincian Tunggakan Aktif
                    </span>
                    <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Total: {formatRupiah(student.totalTunggakan)}
                    </span>
                  </div>
                  <p className="text-[#64748B] text-xs">
                    Santri memiliki kewajiban pembayaran yang belum diselesaikan pada periode berjalan:
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1E293B]">Tagihan Bulan Agustus 2026</p>
                      <p className="text-[11px] text-[#64748B]">SPP Bulanan ({student.kategoriBeasiswa || 'Reguler'}) + Konsumsi Dapur ({student.paketMakan})</p>
                    </div>
                    <span className="font-mono font-bold text-amber-800 text-sm">
                      {formatRupiah(student.totalTunggakan)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-sm text-[#1E293B]">Tidak Ada Tunggakan</p>
                  <p className="text-xs text-[#64748B] mt-1">
                    Seluruh kewajiban pembayaran santri telah diselesaikan dengan status Lunas.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => onEditStudent?.(student)}
            className="px-4 py-2 text-xs font-semibold text-[#064E3B] border border-[#064E3B] hover:bg-emerald-50 rounded-lg transition"
          >
            Ubah Data Santri
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1E293B] hover:bg-slate-900 rounded-lg transition"
          >
            Tutup Profil
          </button>
        </div>
      </div>

      {/* Printable Student Profile & Finance Card */}
      <PrintStudentProfileModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        student={student}
      />
    </div>
  );
};

