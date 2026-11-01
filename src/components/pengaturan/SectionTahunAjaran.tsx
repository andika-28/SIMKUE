import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Copy,
  ArrowRight,
  ShieldAlert,
  Users,
  Receipt,
  Wallet,
  Clock,
  FileCheck,
  CheckSquare,
  Square,
  Eye,
  Edit,
  X,
} from 'lucide-react';
import { AcademicYearConfigItem } from '../../types';

interface SectionTahunAjaranProps {
  academicYears: AcademicYearConfigItem[];
  onAddAcademicYear: (newYear: AcademicYearConfigItem) => void;
  onActivateAcademicYear: (yearId: string) => void;
  onCloseAcademicYear: (yearId: string) => void;
  onShowToast: (msg: string) => void;
}

export const SectionTahunAjaran: React.FC<SectionTahunAjaranProps> = ({
  academicYears,
  onAddAcademicYear,
  onActivateAcademicYear,
  onCloseAcademicYear,
  onShowToast,
}) => {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [selectedYearToActivate, setSelectedYearToActivate] = useState<AcademicYearConfigItem | null>(null);
  const [isCloseYearModalOpen, setIsCloseYearModalOpen] = useState(false);
  const [selectedYearToClose, setSelectedYearToClose] = useState<AcademicYearConfigItem | null>(null);
  const [closeConfirmText, setCloseConfirmText] = useState('');

  // Add form states
  const [newYearName, setNewYearName] = useState('2027 / 2028');
  const [newStartDate, setNewStartDate] = useState('2027-07-01');
  const [newEndDate, setNewEndDate] = useState('2028-06-30');
  const [creationMode, setCreationMode] = useState<'empty' | 'copy'>('copy');
  const [copyOptions, setCopyOptions] = useState({
    classes: true,
    mealPackages: true,
    billTypes: true,
    nominalRates: true,
    expenseCategories: true,
  });

  const activeYear = academicYears.find((y) => y.status === 'AKTIF') || academicYears[0];

  const handleToggleCopyOption = (key: keyof typeof copyOptions) => {
    setCopyOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    const newYearItem: AcademicYearConfigItem = {
      id: `ay-${Date.now()}`,
      name: newYearName,
      startDate: newStartDate,
      endDate: newEndDate,
      status: 'DIRENCANAKAN',
      studentCount: 0,
      billsGeneratedCount: 0,
      totalPayment: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isLocked: false,
    };
    onAddAcademicYear(newYearItem);
    setIsAddModalOpen(false);
    onShowToast(`Tahun Ajaran ${newYearName} berhasil ditambahkan.`);
  };

  const handleConfirmActivate = () => {
    if (selectedYearToActivate) {
      onActivateAcademicYear(selectedYearToActivate.id);
      setIsActivateModalOpen(false);
      onShowToast(`Tahun Ajaran ${selectedYearToActivate.name} sekarang berstatus AKTIF.`);
      setSelectedYearToActivate(null);
    }
  };

  const handleConfirmClose = () => {
    if (closeConfirmText === 'TUTUP TAHUN AJARAN' && selectedYearToClose) {
      onCloseAcademicYear(selectedYearToClose.id);
      setIsCloseYearModalOpen(false);
      setCloseConfirmText('');
      onShowToast(`Tahun Ajaran ${selectedYearToClose.name} telah resmi DITUTUP.`);
      setSelectedYearToClose(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Manajemen Tahun Ajaran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola periode akademik dan pembagian siklus operasional keuangan pesantren.
          </p>
        </div>
        <button
          type="button"
          id="btn-tambah-tahun-ajaran"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Tahun Ajaran
        </button>
      </div>

      {/* Prominent Active Year Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl shadow-sm border border-emerald-700/40 p-6">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400 text-emerald-950 shadow-2xs">
                AKTIF
              </span>
              <span className="text-xs font-medium text-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sedang Berjalan
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white">
              Tahun Ajaran {activeYear.name}
            </h3>

            <p className="text-xs text-emerald-100/80 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              Periode:{' '}
              <span className="font-semibold text-white">
                {new Date(activeYear.startDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>{' '}
              s/d{' '}
              <span className="font-semibold text-white">
                {new Date(activeYear.endDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-600/30 backdrop-blur-xs">
            <div className="px-3 border-r border-emerald-800/60">
              <span className="text-[10px] font-medium text-emerald-300 block">Santri Aktif</span>
              <span className="text-base font-extrabold text-white flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                {activeYear.studentCount}
              </span>
            </div>
            <div className="px-3 border-r border-emerald-800/60">
              <span className="text-[10px] font-medium text-emerald-300 block">Tagihan Dibuat</span>
              <span className="text-base font-extrabold text-white flex items-center gap-1 mt-0.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                {activeYear.billsGeneratedCount.toLocaleString('id-ID')}+
              </span>
            </div>
            <div className="px-3">
              <span className="text-[10px] font-medium text-emerald-300 block">Total Pembayaran</span>
              <span className="text-base font-extrabold text-emerald-300 flex items-center gap-1 mt-0.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                Rp {(activeYear.totalPayment / 1000000).toFixed(1)} Jt
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Year List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Daftar Tahun Ajaran
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Total {academicYears.length} Periode Tercatat
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3">Tahun Ajaran</th>
                <th className="px-4 py-3">Periode</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Santri Terdaftar</th>
                <th className="px-4 py-3">Tanggal Dibuat</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {academicYears.map((year) => {
                const isActive = year.status === 'AKTIF';
                const isClosed = year.status === 'SELESAI';
                const isPlanned = year.status === 'DIRENCANAKAN';

                return (
                  <tr key={year.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                      {year.name}
                      {year.isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {new Date(year.startDate).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      -{' '}
                      {new Date(year.endDate).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : isClosed
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
                        {year.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-slate-800">
                      {year.studentCount > 0 ? `${year.studentCount} Santri` : '-'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                      {new Date(year.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      {isPlanned && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedYearToActivate(year);
                            setIsActivateModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold transition-all"
                        >
                          Aktifkan
                        </button>
                      )}
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedYearToClose(year);
                            setIsCloseYearModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold transition-all"
                        >
                          Tutup Buku
                        </button>
                      )}
                      {isClosed && (
                        <span className="text-[11px] text-slate-400 italic">Arsip Terkunci</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Year Closing Preparation & Rules Box */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-900 rounded-xl shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-950">
              Prosedur & Ketentuan Penutupan Tahun Ajaran
            </h3>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Penutupan tahun ajaran adalah proses finalisasi akuntansi pesantren. Sebelum menutup tahun ajaran, pastikan seluruh indikator kesiapan berikut telah terpenuhi:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-white p-3 rounded-xl border border-amber-200/60 flex items-center gap-2.5 text-xs font-semibold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Semua transaksi penerimaan & pengeluaran tercatat
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200/60 flex items-center gap-2.5 text-xs font-semibold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Rekening bank telah direkonsiliasi dengan mutasi
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200/60 flex items-center gap-2.5 text-xs font-semibold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Laporan tahunan telah diverifikasi Pimpinan
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200/60 flex items-center gap-2.5 text-xs font-semibold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Rekapitulasi sisa tunggakan santri terdokumentasi
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Tambah Tahun Ajaran Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Tambah Tahun Ajaran</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateYear} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Nama Tahun Ajaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  placeholder="Contoh: 2027 / 2028"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Mode Options */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700 block">Metode Pembuatan Data:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCreationMode('copy')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      creationMode === 'copy'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Copy className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Salin Konfigurasi</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal">
                      Salin master tarif & struktur dari tahun sebelumnya.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreationMode('empty')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      creationMode === 'empty'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-700" />
                      <span>Mulai Kosong</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal">
                      Buat periode baru tanpa menyalin tarif dasar.
                    </p>
                  </button>
                </div>
              </div>

              {/* Copy checklist if selected */}
              {creationMode === 'copy' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-semibold text-slate-700 block text-[11px]">
                    Item yang akan disalin:
                  </span>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleCopyOption('classes')}
                      className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-left w-full"
                    >
                      {copyOptions.classes ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Struktur Kelas (MTs 1–3, MA 4–6)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleCopyOption('mealPackages')}
                      className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-left w-full"
                    >
                      {copyOptions.mealPackages ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Kategori Paket Makan (Kategori A, B, C)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleCopyOption('billTypes')}
                      className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-left w-full"
                    >
                      {copyOptions.billTypes ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Jenis Tagihan Bulanan & Tahunan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleCopyOption('nominalRates')}
                      className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-left w-full"
                    >
                      {copyOptions.nominalRates ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Nominal Tarif Default</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleCopyOption('expenseCategories')}
                      className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-left w-full"
                    >
                      {copyOptions.expenseCategories ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Kategori Pos Anggaran Pengeluaran</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 italic">
                    * Sistem TIDAK akan menyalin transaksi, pembayaran, tunggakan, ataupun saldo kas tahun lalu.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Buat Tahun Ajaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Aktifkan Tahun Ajaran Baru Modal */}
      {isActivateModalOpen && selectedYearToActivate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Aktifkan Tahun Ajaran {selectedYearToActivate.name}?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hanya <strong>satu</strong> tahun ajaran yang dapat berstatus AKTIF. Tahun ajaran sebelumnya ({activeYear.name}) akan secara otomatis diset ke status <strong>SELESAI</strong> untuk operasional baru.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Tahun Ajaran Aktif Saat Ini:</span>
                <span className="font-semibold text-slate-800">{activeYear.name}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Tahun Ajaran Baru (Akan Diaktifkan):</span>
                <span>{selectedYearToActivate.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsActivateModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmActivate}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Ya, Aktifkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Penutupan Tahun Ajaran Modal */}
      {isCloseYearModalOpen && selectedYearToClose && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-red-200 overflow-hidden">
            <div className="p-5 bg-red-50 border-b border-red-100 flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-700 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-950">
                  Konfirmasi Penutupan Tahun Ajaran
                </h3>
                <p className="text-[11px] text-red-800 mt-0.5">
                  Tahun Ajaran: {selectedYearToClose.name}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200/70 text-slate-700 space-y-2">
                <span className="font-bold text-red-900 block">
                  Konsekuensi penutupan tahun ajaran:
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Tagihan dan invoice baru tidak dapat digenerate pada periode ini.</li>
                  <li>Transaksi kas masuk dan keluar tidak dapat diubah (Read-Only).</li>
                  <li>Seluruh riwayat dan arsip laporan tetap dapat diakses untuk audit.</li>
                  <li>Sisa tunggakan santri dapat dialihkan ke buku tagihan periode baru.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Ketik <strong className="text-red-600 font-mono">TUTUP TAHUN AJARAN</strong> untuk melanjutkan:
                </label>
                <input
                  type="text"
                  value={closeConfirmText}
                  onChange={(e) => setCloseConfirmText(e.target.value)}
                  placeholder="TUTUP TAHUN AJARAN"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCloseYearModalOpen(false);
                    setCloseConfirmText('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={closeConfirmText !== 'TUTUP TAHUN AJARAN'}
                  onClick={handleConfirmClose}
                  className={`px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${
                    closeConfirmText === 'TUTUP TAHUN AJARAN'
                      ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Tutup Tahun Ajaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
