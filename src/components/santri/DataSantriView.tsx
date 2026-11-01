import React, { useState, useMemo } from 'react';
import { UserPlus, UploadCloud, FileSpreadsheet, Sparkles } from 'lucide-react';
import { SantriStatsCards } from './SantriStatsCards';
import { SantriFilterToolbar } from './SantriFilterToolbar';
import { SantriTable } from './SantriTable';
import { SantriDistributionInsight } from './SantriDistributionInsight';
import { AddStudentModal } from './AddStudentModal';
import { ImportExcelModal } from './ImportExcelModal';
import { StudentDetailModal } from './StudentDetailModal';
import { Student, StudentFilterState, StudentStatsSummary } from '../../types';
import { initialStudents, initialStudentStats, getClassUnit } from '../../data/studentsData';

interface DataSantriViewProps {
  onSuccessToast: (msg: string) => void;
  onViewStudentDetail?: (student: Student) => void;
}

export const DataSantriView: React.FC<DataSantriViewProps> = ({
  onSuccessToast,
  onViewStudentDetail,
}) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [stats, setStats] = useState<StudentStatsSummary>(initialStudentStats);

  // Filters state
  const [filters, setFilters] = useState<StudentFilterState>({
    search: '',
    unit: 'ALL',
    kelas: 'ALL',
    status: 'ALL',
    paketMakan: 'ALL',
    beasiswa: 'ALL',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Filter handlers
  const handleFilterChange = (key: keyof StudentFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      unit: 'ALL',
      kelas: 'ALL',
      status: 'ALL',
      paketMakan: 'ALL',
      beasiswa: 'ALL',
    });
    setCurrentPage(1);
    onSuccessToast('Filter berhasil di-reset ke kondisi awal.');
  };

  // Filtered students computation
  const filteredStudents = useMemo(() => {
    return students.filter((std) => {
      // 1. Search filter (Nama or NIS or Wali)
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchName = (std.nama || '').toLowerCase().includes(query);
        const matchNis = (std.nis || '').toLowerCase().includes(query);
        const matchWali = (std.namaWali || '').toLowerCase().includes(query);
        if (!matchName && !matchNis && !matchWali) return false;
      }

      // 2. Unit filter
      if (filters.unit !== 'ALL' && std.unit !== filters.unit) {
        return false;
      }

      // 3. Kelas filter
      if (filters.kelas !== 'ALL' && std.kelas !== filters.kelas) {
        return false;
      }

      // 4. Status filter
      if (filters.status !== 'ALL' && std.status !== filters.status) {
        return false;
      }

      // 5. Paket Makan filter
      if (filters.paketMakan !== 'ALL' && std.paketMakan !== filters.paketMakan) {
        return false;
      }

      // 6. Beasiswa filter
      if (filters.beasiswa && filters.beasiswa !== 'ALL' && std.kategoriBeasiswa !== filters.beasiswa) {
        return false;
      }

      return true;
    });
  }, [students, filters]);

  // Recalculate stats dynamically
  const updateStats = (updatedList: Student[]) => {
    const total = updatedList.length;
    const aktif = updatedList.filter((s) => s.status === 'Aktif').length;
    const mts = updatedList.filter((s) => s.unit === 'MTs').length;
    const ma = updatedList.filter((s) => s.unit === 'MA').length;
    const paketA = updatedList.filter((s) => s.paketMakan === 'Paket A').length;
    const paketB = updatedList.filter((s) => s.paketMakan === 'Paket B').length;
    const paketC = updatedList.filter((s) => s.paketMakan === 'Paket C').length;

    setStats({
      totalSantri: total,
      santriAktif: aktif,
      santriMTs: mts,
      santriMA: ma,
      paketACount: paketA,
      paketBCount: paketB,
      paketCCount: paketC,
    });
  };

  // Save student (Add / Edit)
  const handleSaveStudent = (studentData: Omit<Student, 'id' | 'totalTagihan' | 'totalDibayar' | 'totalTunggakan'> & { id?: string }) => {
    if (studentData.id) {
      // Edit existing
      setStudents((prev) =>
        prev.map((item) =>
          item.id === studentData.id
            ? {
                ...item,
                ...studentData,
                unit: getClassUnit(studentData.kelas),
              }
            : item
        )
      );
      onSuccessToast(`Data santri ${studentData.nama} berhasil diperbarui.`);
    } else {
      // Add new
      const newStudent: Student = {
        ...studentData,
        id: `std-${Date.now()}`,
        unit: getClassUnit(studentData.kelas),
        totalTagihan: 8500000,
        totalDibayar: 8500000,
        totalTunggakan: 0,
      };
      setStudents((prev) => [newStudent, ...prev]);
      onSuccessToast(`Santri baru ${studentData.nama} (NIS: ${studentData.nis}) berhasil ditambahkan.`);
    }
    setEditingStudent(null);
  };

  // Delete student
  const handleDeleteStudent = (student: Student) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data santri ${student.nama} (NIS: ${student.nis})?`)) {
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      onSuccessToast(`Data santri ${student.nama} telah dihapus.`);
    }
  };

  // Import Excel confirm
  const handleConfirmImport = (count: number) => {
    onSuccessToast(`Berhasil mengimpor ${count} data santri dari berkas Excel.`);
  };

  return (
    <div id="data-santri-view" className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Page Summary (5 Compact Statistic Cards) */}
      <SantriStatsCards
        stats={stats}
        onFilterUnit={(unit) => handleFilterChange('unit', unit)}
        onFilterStatus={(status) => handleFilterChange('status', status)}
        onFilterBeasiswa={(beasiswa) => handleFilterChange('beasiswa', beasiswa)}
      />

      {/* 2. Main Data Section (Large White Content Card) */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Main Section Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#1E293B] tracking-tight">
              Daftar Santri
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Kelola seluruh data santri aktif dan riwayat status santri.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Secondary: Import Excel */}
            <button
              id="btn-import-excel"
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] font-semibold text-xs flex items-center gap-2 transition shadow-2xs active:scale-98"
            >
              <UploadCloud className="w-4 h-4 text-[#064E3B]" />
              <span>Import Excel</span>
            </button>

            {/* Primary: + Tambah Santri */}
            <button
              id="btn-tambah-santri"
              onClick={() => {
                setEditingStudent(null);
                setShowAddModal(true);
              }}
              className="px-4 py-2 rounded-lg bg-[#064E3B] hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-2 transition shadow-xs active:scale-98"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Santri</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <SantriFilterToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredStudents.length}
        />

        {/* Data Table */}
        <SantriTable
          students={filteredStudents}
          totalCount={filteredStudents.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          onViewStudent={(std) => {
            if (onViewStudentDetail) {
              onViewStudentDetail(std);
            } else {
              setSelectedStudentForDetail(std);
            }
          }}
          onEditStudent={(std) => {
            setEditingStudent(std);
            setShowAddModal(true);
          }}
          onDeleteStudent={handleDeleteStudent}
        />
      </div>

      {/* 3. Quick Insight Panel */}
      <SantriDistributionInsight stats={stats} />

      {/* Modals */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingStudent(null);
        }}
        onSaveStudent={handleSaveStudent}
        editingStudent={editingStudent}
      />

      <ImportExcelModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onConfirmImport={handleConfirmImport}
      />

      <StudentDetailModal
        student={selectedStudentForDetail}
        isOpen={!!selectedStudentForDetail}
        onClose={() => setSelectedStudentForDetail(null)}
        onEditStudent={(std) => {
          setSelectedStudentForDetail(null);
          setEditingStudent(std);
          setShowAddModal(true);
        }}
      />
    </div>
  );
};
