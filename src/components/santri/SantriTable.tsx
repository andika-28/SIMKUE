import React, { useState } from 'react';
import {
  Eye,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  FileText,
  Trash2,
} from 'lucide-react';
import { Student, ScholarshipType } from '../../types';
import { MEAL_PACKAGES_INFO, SCHOLARSHIP_PACKAGES_INFO } from '../../data/studentsData';
import { Trophy, Award, BookOpen, HeartHandshake } from 'lucide-react';

interface SantriTableProps {
  students: Student[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
}

export const SantriTable: React.FC<SantriTableProps> = ({
  students,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = students.slice(startIndex, startIndex + pageSize);

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'Aktif':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#064E3B] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
            Aktif
          </span>
        );
      case 'Lulus':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Lulus
          </span>
        );
      case 'Pindah':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Pindah
          </span>
        );
      default:
        return null;
    }
  };

  const getMealPackageBadge = (paket: Student['paketMakan']) => {
    const info = MEAL_PACKAGES_INFO[paket] || MEAL_PACKAGES_INFO['Paket C'];
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${info.badgeColor}`}
        title={`${info.name}: ${info.label} (${info.priceFormatted})`}
      >
        {info.name}
      </span>
    );
  };

  const getScholarshipBadge = (kategori: ScholarshipType = 'Reguler', catatan?: string) => {
    const info = SCHOLARSHIP_PACKAGES_INFO[kategori] || SCHOLARSHIP_PACKAGES_INFO['Reguler'];
    
    if (kategori === 'Beasiswa Prestasi (100%)') {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200"
            title={catatan || info.description}
          >
            <Trophy className="w-3 h-3 text-purple-600" />
            Prestasi (100% Bebas)
          </span>
          <span className="text-[10px] text-purple-600 font-mono font-semibold">
            Potongan Rp500.000
          </span>
        </div>
      );
    }

    if (kategori === 'Beasiswa Prestasi (50%)') {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
            title={catatan || info.description}
          >
            <Award className="w-3 h-3 text-indigo-600" />
            Prestasi (50% Diskon)
          </span>
          <span className="text-[10px] text-indigo-600 font-mono font-semibold">
            Potongan Rp250.000
          </span>
        </div>
      );
    }

    if (kategori === 'Beasiswa Tahfidz') {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
            title={catatan || info.description}
          >
            <BookOpen className="w-3 h-3 text-emerald-600" />
            Tahfidz Al-Qur'an
          </span>
          <span className="text-[10px] text-emerald-700 font-mono font-semibold">
            Potongan Rp500.000
          </span>
        </div>
      );
    }

    if (kategori === 'Beasiswa Yatim / Dhuafa') {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
            title={catatan || info.description}
          >
            <HeartHandshake className="w-3 h-3 text-amber-600" />
            Yatim / Dhuafa
          </span>
          <span className="text-[10px] text-amber-700 font-mono font-semibold">
            Potongan Rp500.000
          </span>
        </div>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
        Reguler (SPP Penuh)
      </span>
    );
  };

  return (
    <div id="santri-table-wrapper" className="flex flex-col">
      {/* Table Container with Overflow & Sticky Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead className="sticky top-0 bg-[#F8FAFC] border-b border-[#E2E8F0] z-10">
            <tr className="text-[#64748B] text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">No</th>
              <th className="py-3.5 px-4">NIS</th>
              <th className="py-3.5 px-4">Nama Santri</th>
              <th className="py-3.5 px-4">Jenis Kelamin</th>
              <th className="py-3.5 px-4">Unit</th>
              <th className="py-3.5 px-4">Kelas</th>
              <th className="py-3.5 px-4">Paket Makan</th>
              <th className="py-3.5 px-4">Kategori SPP & Beasiswa</th>
              <th className="py-3.5 px-4">Nama Wali</th>
              <th className="py-3.5 px-4">No. HP Wali</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-xs font-medium text-[#334155]">
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student, index) => {
                const rowNumber = startIndex + index + 1;
                const isMenuOpen = openDropdownId === student.id;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-[#F8FAFC] transition-colors group"
                  >
                    {/* No */}
                    <td className="py-3.5 px-4 text-center text-[#94A3B8] font-mono text-[11px]">
                      {rowNumber}
                    </td>

                    {/* NIS */}
                    <td className="py-3.5 px-4 font-mono text-[#064E3B] font-bold whitespace-nowrap">
                      {student.nis}
                    </td>

                    {/* Nama Santri */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewStudent(student)}
                          className="font-bold text-[#1E293B] hover:text-[#064E3B] text-left transition group-hover:underline"
                        >
                          {student.nama}
                        </button>
                      </div>
                    </td>

                    {/* Jenis Kelamin */}
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {student.jenisKelamin}
                    </td>

                    {/* Unit */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.unit === 'MTs'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {student.unit}
                      </span>
                    </td>

                    {/* Kelas */}
                    <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                      {student.kelas}
                    </td>

                    {/* Paket Makan */}
                    <td className="py-3.5 px-4">
                      {getMealPackageBadge(student.paketMakan)}
                    </td>

                    {/* Kategori SPP & Beasiswa */}
                    <td className="py-3.5 px-4">
                      {getScholarshipBadge(student.kategoriBeasiswa, student.catatanBeasiswa)}
                    </td>

                    {/* Nama Wali */}
                    <td className="py-3.5 px-4 text-[#1E293B]">
                      {student.namaWali}
                    </td>

                    {/* No. HP Wali */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                      <a
                        href={`https://wa.me/${student.noHpWali.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-emerald-700 inline-flex items-center gap-1 transition"
                        title="Hubungi via WhatsApp"
                      >
                        {student.noHpWali}
                      </a>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(student.status)}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-center relative">
                      <div className="flex items-center justify-center gap-1">
                        {/* Eye Icon: View financial detail */}
                        <button
                          onClick={() => onViewStudent(student)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#064E3B] hover:bg-emerald-50 transition"
                          title="Lihat Profil Keuangan"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Icon */}
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#E2E8F0]/60 transition"
                          title="Ubah Data Santri"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdownId(isMenuOpen ? null : student.id)
                            }
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#E2E8F0]/60 transition"
                            title="Menu Lainnya"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div
                              onMouseLeave={() => setOpenDropdownId(null)}
                              className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-1.5 z-30 text-left text-xs animate-in fade-in zoom-in-95 duration-100"
                            >
                              <button
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  onViewStudent(student);
                                }}
                                className="w-full px-3 py-2 text-left text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#064E3B]" />
                                <span>Kartu Tagihan</span>
                              </button>
                              <a
                                href={`https://wa.me/${student.noHpWali.replace(/[^0-9]/g, '')}?text=Assalamu'alaikum%20Bapak/Ibu%20${encodeURIComponent(student.namaWali)},%20informasi%20tagihan%20santri%20${encodeURIComponent(student.nama)}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setOpenDropdownId(null)}
                                className="w-full px-3 py-2 text-left text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WhatsApp Wali</span>
                              </a>
                              <div className="border-t border-[#E2E8F0] my-1" />
                              <button
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  onDeleteStudent(student);
                                }}
                                className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                <span>Hapus Santri</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center text-[#94A3B8]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <HelpCircle className="w-8 h-8 text-[#CBD5E1]" />
                    <p className="font-semibold text-[#64748B]">
                      Tidak ada data santri yang sesuai filter
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
                      Coba periksa kata kunci pencarian atau reset filter di atas
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer & Pagination */}
      <div
        id="santri-table-pagination"
        className="p-4 border-t border-[#E2E8F0] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]"
      >
        {/* Left: Summary Count */}
        <div>
          {totalCount > 0 ? (
            <span>
              Menampilkan{' '}
              <strong className="text-[#1E293B] font-semibold">
                {startIndex + 1}–{Math.min(startIndex + pageSize, totalCount)}
              </strong>{' '}
              dari{' '}
              <strong className="text-[#1E293B] font-semibold">
                {totalCount}
              </strong>{' '}
              Santri
            </span>
          ) : (
            <span>Tidak ada data santri</span>
          )}
        </div>

        {/* Right: Page size selector & Page controls */}
        <div className="flex items-center gap-4">
          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#94A3B8]">Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 px-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1E293B] outline-none cursor-pointer"
            >
              <option value={10}>10 / halaman</option>
              <option value={25}>25 / halaman</option>
              <option value={50}>50 / halaman</option>
            </select>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none transition"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4 text-[#64748B]" />
            </button>

            {/* Page indicators */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="text-[#94A3B8] px-1 text-xs">...</span>
                  <button
                    onClick={() => onPageChange(totalPages)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                      currentPage === totalPages
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none transition"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4 text-[#64748B]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
