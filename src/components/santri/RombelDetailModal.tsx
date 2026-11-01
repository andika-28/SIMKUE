import React, { useState } from 'react';
import {
  X,
  Users,
  Search,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRightLeft,
  ExternalLink,
  GraduationCap,
  Building,
  UserCheck,
} from 'lucide-react';
import { RombelItem, SantriRombelMember } from '../../data/rombelData';
import { downloadExcelSpreadsheet, downloadPrintableReport } from '../../utils/fileDownloader';

interface RombelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  rombel: RombelItem | null;
  members: SantriRombelMember[];
  allRombels: RombelItem[];
  onNavigateToStudentDetail?: (nis: string) => void;
  onMoveStudent?: (studentId: string, targetRombelId: string) => void;
  onShowToast: (msg: string) => void;
}

export const RombelDetailModal: React.FC<RombelDetailModalProps> = ({
  isOpen,
  onClose,
  rombel,
  members,
  allRombels,
  onNavigateToStudentDetail,
  onMoveStudent,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Lunas' | 'Menunggak'>('All');
  const [movingStudent, setMovingStudent] = useState<SantriRombelMember | null>(null);
  const [targetRombelId, setTargetRombelId] = useState('');

  if (!isOpen || !rombel) return null;

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.nis.includes(search) ||
      m.namaWali.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Lunas'
        ? m.statusSPP === 'Lunas'
        : m.statusSPP === 'Menunggak' || m.statusSPP === 'Sebagian';
    return matchSearch && matchStatus;
  });

  const handleExportExcel = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Santri',
      'Jenis Kelamin',
      'Kelas/Rombel',
      'Paket Makan',
      'Kategori Beasiswa',
      'Status SPP',
      'Nominal Tunggakan',
      'Nama Wali',
      'No. HP Wali',
    ];

    const rows = filteredMembers.map((m, idx) => [
      idx + 1,
      m.nis,
      m.nama,
      m.jenisKelamin,
      rombel.namaRombel,
      m.paketMakan,
      m.beasiswa,
      m.statusSPP,
      m.nominalTunggakan > 0 ? `Rp ${m.nominalTunggakan.toLocaleString('id-ID')}` : 'Rp 0',
      m.namaWali,
      m.noHpWali,
    ]);

    const filename = `Daftar_Santri_${rombel.kodeRombel.replace(/\s+/g, '_')}_${rombel.unit}.xls`;
    downloadExcelSpreadsheet(filename, {
      title: `DAFTAR SANTRI ROMBONGAN BELAJAR - ${rombel.namaRombel.toUpperCase()}`,
      subtitle: `Wali Kelas: ${rombel.waliKelas} • Ruang: ${rombel.ruangKelas} • TP: 2026/2027`,
      headers,
      rows,
      summary: [
        { label: 'Total Santri', value: `${filteredMembers.length} Orang` },
        { label: 'Kapasitas Ruang', value: `${rombel.kapasitas} Kursi` },
        { label: 'Wali Kelas', value: rombel.waliKelas },
      ],
    });

    onShowToast(`File ${filename} berhasil diunduh ke folder Downloads!`);
  };

  const handlePrintAttendance = () => {
    const filename = `Presensi_Absensi_${rombel.kodeRombel.replace(/\s+/g, '_')}.html`;
    const contentHtml = `
      <div class="kop-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="kop-logo">R</div>
          <div class="kop-text">
            <h1>Pondok Modern Raudhatussalam Mahato</h1>
            <p>Bagian Akademik & Kepengasuhan Santri • Daftar Hadir & Presensi Rombel</p>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="background:#e0f2fe;color:#0369a1;padding:4px 8px;border-radius:4px;font-weight:bold;font-size:9px;">LEMBAR ABSENSI</span>
          <p style="margin-top:4px;font-size:9px;color:#64748b;">Bulan: Agustus 2026</p>
        </div>
      </div>

      <h2 style="text-align:center;font-size:12px;text-transform:uppercase;">Daftar Hadir Belajar Mengajar</h2>
      <p style="text-align:center;font-size:10px;color:#64748b;margin-top:2px;">
        Rombel: <strong>${rombel.namaRombel}</strong> • Wali Kelas: <strong>${rombel.waliKelas}</strong> • Ruangan: <strong>${rombel.ruangKelas}</strong>
      </p>

      <table>
        <thead>
          <tr>
            <th style="width:25px;" rowspan="2">No</th>
            <th style="width:70px;" rowspan="2">NIS</th>
            <th rowspan="2">Nama Lengkap Santri</th>
            <th style="width:40px;" rowspan="2">L/P</th>
            <th colspan="10" style="text-align:center;">Pertemuan / Tanggal</th>
            <th colspan="3" style="text-align:center;width:60px;">Rekap</th>
          </tr>
          <tr>
            <th style="width:16px;">1</th>
            <th style="width:16px;">2</th>
            <th style="width:16px;">3</th>
            <th style="width:16px;">4</th>
            <th style="width:16px;">5</th>
            <th style="width:16px;">6</th>
            <th style="width:16px;">7</th>
            <th style="width:16px;">8</th>
            <th style="width:16px;">9</th>
            <th style="width:16px;">10</th>
            <th style="width:20px;">S</th>
            <th style="width:20px;">I</th>
            <th style="width:20px;">A</th>
          </tr>
        </thead>
        <tbody>
          ${filteredMembers
            .map(
              (m, idx) => `
            <tr>
              <td style="text-align:center;">${idx + 1}</td>
              <td>${m.nis}</td>
              <td><strong>${m.nama}</strong></td>
              <td style="text-align:center;">${m.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</td>
              <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td><td></td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer-signatures" style="margin-top:30px;">
        <div class="signature-box">
          <p>Mengetahui,</p>
          <p><strong>Kepala Madrasah ${rombel.unit}</strong></p>
          <div class="signature-space"></div>
          <p style="text-decoration:underline;font-weight:bold;">${
            rombel.unit === 'MTs' ? 'Ust. K.H. Mansyur, S.Ag' : 'Ust. Dr. Hamdan Syukri, M.A.'
          }</p>
        </div>
        <div class="signature-box">
          <p>Mahato, ${new Date().toLocaleDateString('id-ID')}</p>
          <p><strong>Wali Kelas</strong></p>
          <div class="signature-space"></div>
          <p style="text-decoration:underline;font-weight:bold;">${rombel.waliKelas}</p>
        </div>
      </div>
    `;

    downloadPrintableReport(filename, `Presensi Rombel ${rombel.kodeRombel}`, contentHtml);
    onShowToast(`File ${filename} berhasil diunduh! Buka untuk mencetak presensi kelas.`);
  };

  const handleConfirmMove = () => {
    if (!movingStudent || !targetRombelId) return;
    if (onMoveStudent) {
      onMoveStudent(movingStudent.id, targetRombelId);
    }
    const targetR = allRombels.find((r) => r.id === targetRombelId);
    onShowToast(
      `Santri ${movingStudent.nama} berhasil dipindahkan ke ${targetR?.namaRombel || 'rombel tujuan'}.`
    );
    setMovingStudent(null);
    setTargetRombelId('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{rombel.namaRombel}</h2>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    rombel.gender === 'Banin'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {rombel.genderLabel}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {rombel.unit}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Wali Kelas: <strong className="text-slate-800">{rombel.waliKelas}</strong> • Ruangan:{' '}
                <strong className="text-slate-800">{rombel.ruangKelas}</strong> ({rombel.gedung})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>
                Total Santri:{' '}
                <strong className="text-slate-900 font-bold">
                  {members.length} / {rombel.kapasitas} Kursi
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>
                Kontak Wali Kelas:{' '}
                <strong className="text-emerald-800 font-semibold">{rombel.waliKelasHp}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Kelunasan SPP:{' '}
                <strong className="text-emerald-700 font-bold">{rombel.persentaseLunas}% Lunas</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintAttendance}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs text-xs"
              title="Cetak lembar presensi absensi santri"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" /> Cetak Presensi
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-[#064E3B] hover:bg-[#043327] text-white rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs text-xs"
              title="Unduh daftar anggota kelas ke format Excel"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor Excel
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari santri, NIS, atau wali..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B]"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
            <span className="text-slate-500 text-[11px] font-medium mr-1">Status SPP:</span>
            {(['All', 'Lunas', 'Menunggak'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {st === 'All' ? 'Semua' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Student Table Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">NIS & Nama Santri</th>
                  <th className="py-2.5 px-3">Gender</th>
                  <th className="py-2.5 px-3">Paket Makan</th>
                  <th className="py-2.5 px-3">Status SPP</th>
                  <th className="py-2.5 px-3">Wali Santri</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Tidak ada data santri yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member, idx) => (
                    <tr key={member.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{member.nama}</div>
                        <div className="text-[11px] text-slate-500 font-mono">NIS: {member.nis}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            member.jenisKelamin === 'Laki-laki'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {member.jenisKelamin}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {member.paketMakan}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {member.statusSPP === 'Lunas' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Lunas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <AlertCircle className="w-3 h-3" /> Rp{' '}
                            {member.nominalTunggakan.toLocaleString('id-ID')}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-slate-800 font-medium">{member.namaWali}</div>
                        <div className="text-[11px] text-slate-500">{member.noHpWali}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setMovingStudent(member)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="Pindah Rombel"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          {onNavigateToStudentDetail && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onNavigateToStudentDetail(member.nis);
                              }}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="Lihat Profil Keuangan Santri"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80">
          <span className="text-xs text-slate-500">
            Menampilkan <strong>{filteredMembers.length}</strong> dari{' '}
            <strong>{members.length}</strong> santri di {rombel.namaRombel}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Move Student Sub-modal */}
      {movingStudent && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#064E3B]" /> Pindah Rombongan Belajar
              </h3>
              <button
                type="button"
                onClick={() => setMovingStudent(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Pindahkan santri <strong className="text-slate-900">{movingStudent.nama}</strong> (NIS:{' '}
              {movingStudent.nis}) ke rombongan belajar lain:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Rombel Tujuan:
              </label>
              <select
                value={targetRombelId}
                onChange={(e) => setTargetRombelId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B]"
              >
                <option value="">-- Pilih Rombel Tujuan --</option>
                {allRombels
                  .filter((r) => r.id !== rombel.id)
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.namaRombel} (Wali: {r.waliKelas})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMovingStudent(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!targetRombelId}
                onClick={handleConfirmMove}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#043327] disabled:bg-slate-300 rounded-lg cursor-pointer"
              >
                Konfirmasi Pindah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
