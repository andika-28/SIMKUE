import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  Search,
  Plus,
  Download,
  Printer,
  Edit2,
  Building,
  UserCheck,
  Phone,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpCircle,
  HelpCircle,
} from 'lucide-react';
import {
  RombelItem,
  SantriRombelMember,
  initialRombelList,
  initialRombelMembers,
} from '../../data/rombelData';
import { RombelDetailModal } from './RombelDetailModal';
import { AddEditRombelModal } from './AddEditRombelModal';
import { downloadExcelSpreadsheet, downloadPrintableReport } from '../../utils/fileDownloader';

interface DataKelasRombelViewProps {
  onNavigateToStudentDetail?: (nis: string) => void;
  onShowToast: (msg: string) => void;
}

export const DataKelasRombelView: React.FC<DataKelasRombelViewProps> = ({
  onNavigateToStudentDetail,
  onShowToast,
}) => {
  const [rombelList, setRombelList] = useState<RombelItem[]>(initialRombelList);
  const [rombelMembers, setRombelMembers] = useState<Record<string, SantriRombelMember[]>>(
    initialRombelMembers
  );

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState<'All' | 'MTs' | 'MA'>('All');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Banin' | 'Banat'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [selectedRombelForDetail, setSelectedRombelForDetail] = useState<RombelItem | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [rombelToEdit, setRombelToEdit] = useState<RombelItem | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  // Computed summary metrics
  const totalRombel = rombelList.length;
  const totalSantri = useMemo(
    () => rombelList.reduce((acc, r) => acc + r.jumlahSantri, 0),
    [rombelList]
  );
  const totalKapasitas = useMemo(
    () => rombelList.reduce((acc, r) => acc + r.kapasitas, 0),
    [rombelList]
  );
  const occupancyRate = totalKapasitas > 0 ? Math.round((totalSantri / totalKapasitas) * 100) : 0;
  const avgKelunasan = useMemo(
    () =>
      rombelList.length > 0
        ? Math.round(rombelList.reduce((acc, r) => acc + r.persentaseLunas, 0) / rombelList.length)
        : 0,
    [rombelList]
  );

  // Filtered rombel list
  const filteredRombel = useMemo(() => {
    return rombelList.filter((r) => {
      const matchSearch =
        r.namaRombel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.kodeRombel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.waliKelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ruangKelas.toLowerCase().includes(searchQuery.toLowerCase());
      const matchUnit = unitFilter === 'All' || r.unit === unitFilter;
      const matchGender = genderFilter === 'All' || r.gender === genderFilter;
      return matchSearch && matchUnit && matchGender;
    });
  }, [rombelList, searchQuery, unitFilter, genderFilter]);

  // Handlers
  const handleOpenAdd = () => {
    setRombelToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (rombel: RombelItem) => {
    setRombelToEdit(rombel);
    setIsAddEditModalOpen(true);
  };

  const handleSaveRombel = (saved: RombelItem) => {
    if (rombelToEdit) {
      setRombelList((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
      onShowToast(`Rombel ${saved.namaRombel} berhasil diperbarui.`);
    } else {
      setRombelList((prev) => [...prev, saved]);
      setRombelMembers((prev) => ({ ...prev, [saved.id]: [] }));
      onShowToast(`Rombel baru ${saved.namaRombel} berhasil ditambahkan.`);
    }
    setIsAddEditModalOpen(false);
  };

  const handleMoveStudent = (studentId: string, targetRombelId: string) => {
    let movedStudent: SantriRombelMember | null = null;
    const targetRombel = rombelList.find((r) => r.id === targetRombelId);
    if (!targetRombel) return;

    // Find and remove student from current rombel
    const newMembersState = { ...rombelMembers };
    for (const rId of Object.keys(newMembersState)) {
      const foundIdx = newMembersState[rId].findIndex((s) => s.id === studentId);
      if (foundIdx !== -1) {
        movedStudent = { ...newMembersState[rId][foundIdx] };
        newMembersState[rId] = newMembersState[rId].filter((s) => s.id !== studentId);
        break;
      }
    }

    if (movedStudent) {
      movedStudent.rombelId = targetRombelId;
      movedStudent.rombelKode = targetRombel.kodeRombel;
      movedStudent.kelas = targetRombel.tingkat;
      newMembersState[targetRombelId] = [...(newMembersState[targetRombelId] || []), movedStudent];
      setRombelMembers(newMembersState);

      // Update student count in rombel list
      setRombelList((prev) =>
        prev.map((r) => {
          if (r.id === targetRombelId) {
            return { ...r, jumlahSantri: r.jumlahSantri + 1 };
          }
          if (selectedRombelForDetail && r.id === selectedRombelForDetail.id) {
            return { ...r, jumlahSantri: Math.max(0, r.jumlahSantri - 1) };
          }
          return r;
        })
      );
    }
  };

  const handleExportAllExcel = () => {
    const headers = [
      'No',
      'Kode Rombel',
      'Nama Rombel',
      'Tingkat',
      'Unit',
      'Gender',
      'Wali Kelas',
      'No. HP Wali Kelas',
      'Ruang Belajar',
      'Gedung',
      'Jml Santri',
      'Kapasitas',
      'Okupansi (%)',
      'Kelunasan SPP (%)',
      'Total Tunggakan',
    ];

    const rows = filteredRombel.map((r, i) => [
      i + 1,
      r.kodeRombel,
      r.namaRombel,
      r.tingkat,
      r.unit,
      r.genderLabel,
      r.waliKelas,
      r.waliKelasHp,
      r.ruangKelas,
      r.gedung,
      r.jumlahSantri,
      r.kapasitas,
      `${Math.round((r.jumlahSantri / r.kapasitas) * 100)}%`,
      `${r.persentaseLunas}%`,
      `Rp ${r.totalTunggakan.toLocaleString('id-ID')}`,
    ]);

    downloadExcelSpreadsheet(`Rekap_Data_Kelas_Rombel_2026_2027.xls`, {
      title: 'REKAPITULASI DATA KELAS & ROMBONGAN BELAJAR',
      subtitle: 'Pondok Modern Raudhatussalam Mahato • Tahun Ajaran 2026/2027',
      headers,
      rows,
      summary: [
        { label: 'Total Rombel Terdata', value: `${filteredRombel.length} Rombel` },
        { label: 'Total Santri Terbagi', value: `${totalSantri} Santri` },
        { label: 'Rata-rata Kelunasan', value: `${avgKelunasan}%` },
      ],
    });

    onShowToast('File Rekap_Data_Kelas_Rombel_2026_2027.xls berhasil diunduh!');
  };

  const handlePrintAllReport = () => {
    const filename = `Daftar_Rombel_Raudhatussalam_${new Date().toISOString().slice(0, 10)}.html`;
    const contentHtml = `
      <div class="kop-header">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="kop-logo">R</div>
          <div class="kop-text">
            <h1>Pondok Modern Raudhatussalam Mahato</h1>
            <p>Biro Administrasi Akademik & Kepengasuhan Santri • Rekapitulasi Rombel</p>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="background:#dcfce7;color:#166534;padding:4px 8px;border-radius:4px;font-weight:bold;font-size:9px;">TAHUN AJARAN 2026/2027</span>
          <p style="margin-top:4px;font-size:9px;color:#64748b;">Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</p>
        </div>
      </div>

      <h2 style="text-align:center;font-size:12px;text-transform:uppercase;">Daftar Rombongan Belajar (Rombel) & Wali Kelas</h2>
      <p style="text-align:center;font-size:10px;color:#64748b;margin-top:2px;">Jenjang Madrasah Tsanawiyah (MTs) dan Madrasah Aliyah (MA)</p>

      <table>
        <thead>
          <tr>
            <th style="width:25px;">No</th>
            <th>Rombel</th>
            <th>Tingkat</th>
            <th>Unit</th>
            <th>Kategori</th>
            <th>Wali Kelas</th>
            <th>Ruang Belajar</th>
            <th style="text-align:center;">Santri</th>
            <th style="text-align:center;">Daya Tampung</th>
            <th style="text-align:center;">Kelunasan</th>
          </tr>
        </thead>
        <tbody>
          ${filteredRombel
            .map(
              (r, idx) => `
            <tr>
              <td style="text-align:center;">${idx + 1}</td>
              <td><strong>${r.namaRombel}</strong></td>
              <td>${r.tingkat}</td>
              <td>${r.unit}</td>
              <td>${r.genderLabel}</td>
              <td>${r.waliKelas}</td>
              <td>${r.ruangKelas}</td>
              <td style="text-align:center;font-weight:bold;">${r.jumlahSantri}</td>
              <td style="text-align:center;">${r.kapasitas}</td>
              <td style="text-align:center;color:#064E3B;font-weight:bold;">${r.persentaseLunas}%</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer-signatures" style="margin-top:40px;">
        <div class="signature-box">
          <p>Mengetahui,</p>
          <p><strong>Pimpinan Pondok Pesantren</strong></p>
          <div class="signature-space"></div>
          <p style="text-decoration:underline;font-weight:bold;">K.H. M. Syafei Siregar, Lc.</p>
        </div>
        <div class="signature-box">
          <p>Mahato, ${new Date().toLocaleDateString('id-ID')}</p>
          <p><strong>Kepala Bagian Pengajaran & Kesiswaan</strong></p>
          <div class="signature-space"></div>
          <p style="text-decoration:underline;font-weight:bold;">Ust. Nurul Huda, M.Ag</p>
        </div>
      </div>
    `;

    downloadPrintableReport(filename, 'Rekapitulasi Rombel Pesantren', contentHtml);
    onShowToast(`Laporan rekapitulasi rombel siap dicetak/disimpan!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#08634B] to-[#0D9488] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none flex items-center justify-center">
          <GraduationCap className="w-64 h-64 transform rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-400/30 text-[11px] font-semibold tracking-wide text-emerald-100 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Sistem Manajemen Rombongan Belajar (Rombel)
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Data Kelas & Rombongan Belajar
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Pemetaan santri per kelas, alokasi wali kelas, gedung & ruang belajar, serta monitoring
              okupansi dan kinerja kelunasan SPP per rombel santri.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setShowPromotionModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowUpCircle className="w-4 h-4 text-emerald-200" /> Kenaikan Kelas
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Rombel
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Total Rombel Aktif</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{totalRombel} Rombel</div>
            <div className="text-[10px] text-emerald-700 font-medium">6 MTs • 6 MA</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Santri Terbagi</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{totalSantri} Santri</div>
            <div className="text-[10px] text-blue-700 font-medium">100% Terdistribusi</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Okupansi Kursi</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{occupancyRate}%</div>
            <div className="text-[10px] text-purple-700 font-medium">
              {totalSantri} / {totalKapasitas} Kursi
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500">Rata-rata Kelunasan SPP</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{avgKelunasan}%</div>
            <div className="text-[10px] text-amber-700 font-medium">Performa Keuangan Rombel</div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Unit Tab Switches */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-fit">
            <button
              type="button"
              onClick={() => setUnitFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                unitFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Unit ({rombelList.length})
            </button>
            <button
              type="button"
              onClick={() => setUnitFilter('MTs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                unitFilter === 'MTs'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MTs / Tsanawiyah (6)
            </button>
            <button
              type="button"
              onClick={() => setUnitFilter('MA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                unitFilter === 'MA'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MA / Aliyah (6)
            </button>
          </div>

          {/* Action Buttons: Export & Print */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintAllReport}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer text-xs shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" /> Cetak Rekap Rombel
            </button>
            <button
              type="button"
              onClick={handleExportAllExcel}
              className="px-3.5 py-1.5 bg-[#064E3B] hover:bg-[#043327] text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer text-xs shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" /> Ekspor Excel
            </button>
          </div>
        </div>

        {/* Sub-Filters: Search, Gender, View Mode */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari rombel, wali kelas, ruang..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B]"
              />
            </div>

            {/* Gender Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Gender:</span>
              {(['All', 'Banin', 'Banat'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderFilter(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    genderFilter === g
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {g === 'All' ? 'Semua' : g === 'Banin' ? 'Putra (Banin)' : 'Putri (Banat)'}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content: Grid or Table View */}
      {filteredRombel.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <GraduationCap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Tidak ada rombel yang cocok</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau ubah filter unit/gender.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRombel.map((rombel) => {
            const members = rombelMembers[rombel.id] || [];
            const occupancyPct = Math.round((rombel.jumlahSantri / rombel.kapasitas) * 100);

            return (
              <div
                key={rombel.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50/50 to-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-[#064E3B]">
                          {rombel.unit}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            rombel.gender === 'Banin'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {rombel.genderLabel}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {rombel.tingkat}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {rombel.namaRombel}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(rombel)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit Data Rombel"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Wali Kelas */}
                  <div className="mt-3.5 flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-slate-400 font-medium">Wali Kelas</div>
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {rombel.waliKelas}
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${rombel.waliKelasHp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                      title="Hubungi Wali Kelas via WhatsApp"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Ruang & Gedung */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Ruang Belajar</span>
                      <span className="font-semibold text-slate-700 truncate block">
                        {rombel.ruangKelas}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Gedung / Lokasi</span>
                      <span className="font-medium text-slate-600 truncate block">
                        {rombel.gedung}
                      </span>
                    </div>
                  </div>

                  {/* Kapasitas Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Kapasitas Kelas:</span>
                      <span className="font-bold text-slate-900">
                        {rombel.jumlahSantri} / {rombel.kapasitas} Santri{' '}
                        <span className="text-slate-400 font-normal">({occupancyPct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancyPct > 90
                            ? 'bg-amber-500'
                            : occupancyPct >= 70
                            ? 'bg-emerald-600'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, occupancyPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Finance status per class */}
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-800 font-medium block">
                        Kelunasan SPP Bulan Ini
                      </span>
                      <span className="text-emerald-900 font-bold text-sm">
                        {rombel.persentaseLunas}% Lunas
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Tunggakan Kelas</span>
                      <span className="text-xs font-bold text-rose-700">
                        Rp {rombel.totalTunggakan.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Ketua:{' '}
                    <strong className="text-slate-700">
                      {rombel.ketuaKelas.split('(')[0] || '-'}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedRombelForDetail(rombel)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#043327] rounded-xl transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    Lihat Santri ({rombel.jumlahSantri}) <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Rombel</th>
                  <th className="py-3 px-4">Tingkat & Unit</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Wali Kelas</th>
                  <th className="py-3 px-4">Ruang Belajar</th>
                  <th className="py-3 px-4 text-center">Santri / Kursi</th>
                  <th className="py-3 px-4 text-center">Kelunasan</th>
                  <th className="py-3 px-4 text-right">Tunggakan</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRombel.map((rombel, idx) => (
                  <tr key={rombel.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{rombel.namaRombel}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{rombel.tingkat}</span>
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 text-slate-600 font-medium">
                        {rombel.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rombel.gender === 'Banin'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {rombel.genderLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{rombel.waliKelas}</div>
                      <div className="text-[11px] text-slate-400">{rombel.waliKelasHp}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800">{rombel.ruangKelas}</div>
                      <div className="text-[10px] text-slate-400">{rombel.gedung}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-900">{rombel.jumlahSantri}</span>
                      <span className="text-slate-400"> / {rombel.kapasitas}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-50 text-[#064E3B] border border-emerald-200">
                        {rombel.persentaseLunas}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-rose-700">
                      Rp {rombel.totalTunggakan.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedRombelForDetail(rombel)}
                          className="px-2.5 py-1 bg-[#064E3B] hover:bg-[#043327] text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          Daftar Santri
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(rombel)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          title="Edit Rombel"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rombel Detail Modal (Students in class) */}
      <RombelDetailModal
        isOpen={!!selectedRombelForDetail}
        onClose={() => setSelectedRombelForDetail(null)}
        rombel={selectedRombelForDetail}
        members={selectedRombelForDetail ? rombelMembers[selectedRombelForDetail.id] || [] : []}
        allRombels={rombelList}
        onNavigateToStudentDetail={onNavigateToStudentDetail}
        onMoveStudent={handleMoveStudent}
        onShowToast={onShowToast}
      />

      {/* Add / Edit Rombel Modal */}
      <AddEditRombelModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        rombelToEdit={rombelToEdit}
        onSave={handleSaveRombel}
      />

      {/* Promotion / Kenaikan Kelas Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ArrowUpCircle className="w-5 h-5 text-[#064E3B]" />
                <h3>Kenaikan Kelas Santri (Tahun Ajaran Baru)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPromotionModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Fitur otomatisasi pemindahan rombel santri menjelang pergantian semester atau tahun
              ajaran baru 2026/2027:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Santri Kelas 1 (MTs) ➔ Naik ke Kelas 2</span>
                <span className="font-bold text-emerald-700">52 Santri</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Santri Kelas 2 (MTs) ➔ Naik ke Kelas 3</span>
                <span className="font-bold text-emerald-700">48 Santri</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Santri Kelas 3 (MTs) ➔ Lulus / Naik ke MA Kelas 4</span>
                <span className="font-bold text-emerald-700">50 Santri</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Santri Kelas 4 (MA) ➔ Naik ke Kelas 5</span>
                <span className="font-bold text-emerald-700">49 Santri</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Santri Kelas 5 (MA) ➔ Naik ke Kelas 6</span>
                <span className="font-bold text-emerald-700">51 Santri</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-900">
                <span>Santri Kelas 6 (MA) ➔ Alumni / Kelulusan</span>
                <span className="font-bold">50 Santri</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPromotionModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPromotionModal(false);
                  onShowToast(
                    'Simulasi kenaikan kelas berhasil diproses. Data rombel telah diperbarui.'
                  );
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#043327] rounded-xl cursor-pointer shadow-xs"
              >
                Terapkan Kenaikan Kelas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
