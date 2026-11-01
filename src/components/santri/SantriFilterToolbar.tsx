import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { StudentFilterState } from '../../types';

interface SantriFilterToolbarProps {
  filters: StudentFilterState;
  onFilterChange: (key: keyof StudentFilterState, value: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const SantriFilterToolbar: React.FC<SantriFilterToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.unit !== 'ALL' ||
    filters.kelas !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.paketMakan !== 'ALL' ||
    filters.beasiswa !== 'ALL';

  return (
    <div
      id="santri-filter-toolbar"
      className="p-4 border-b border-[#E2E8F0] bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs"
    >
      {/* Left: Search Input */}
      <div className="relative flex-1 min-w-[260px] max-w-md">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          id="input-search-santri"
          placeholder="Cari berdasarkan Nama atau NIS..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1E293B] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]/20 outline-none transition"
        />
      </div>

      {/* Right: Filter dropdowns & controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Filter Unit */}
        <div className="relative">
          <select
            id="filter-unit"
            value={filters.unit}
            onChange={(e) => onFilterChange('unit', e.target.value)}
            className="h-9 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1E293B] focus:border-[#064E3B] focus:bg-white outline-none cursor-pointer"
          >
            <option value="ALL">Semua Unit</option>
            <option value="MTs">MTs (Kelas 1–3)</option>
            <option value="MA">MA (Kelas 4–6)</option>
          </select>
        </div>

        {/* Filter Kelas */}
        <div className="relative">
          <select
            id="filter-kelas"
            value={filters.kelas}
            onChange={(e) => onFilterChange('kelas', e.target.value)}
            className="h-9 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1E293B] focus:border-[#064E3B] focus:bg-white outline-none cursor-pointer"
          >
            <option value="ALL">Semua Kelas</option>
            <option value="Kelas 1">Kelas 1</option>
            <option value="Kelas 2">Kelas 2</option>
            <option value="Kelas 3">Kelas 3</option>
            <option value="Kelas 4">Kelas 4</option>
            <option value="Kelas 5">Kelas 5</option>
            <option value="Kelas 6">Kelas 6</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="relative">
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="h-9 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1E293B] focus:border-[#064E3B] focus:bg-white outline-none cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Lulus">Lulus</option>
            <option value="Pindah">Pindah</option>
          </select>
        </div>

        {/* Filter Paket Makan */}
        <div className="relative">
          <select
            id="filter-paket-makan"
            value={filters.paketMakan}
            onChange={(e) => onFilterChange('paketMakan', e.target.value)}
            className="h-9 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1E293B] focus:border-[#064E3B] focus:bg-white outline-none cursor-pointer"
          >
            <option value="ALL">Semua Paket Makan</option>
            <option value="Paket A">Paket A (Rp0)</option>
            <option value="Paket B">Paket B (Rp200rb)</option>
            <option value="Paket C">Paket C (Rp600rb)</option>
          </select>
        </div>

        {/* Filter Beasiswa / Potongan SPP */}
        <div className="relative">
          <select
            id="filter-beasiswa"
            value={filters.beasiswa}
            onChange={(e) => onFilterChange('beasiswa', e.target.value)}
            className={`h-9 px-3 py-1.5 border rounded-lg text-xs font-medium outline-none cursor-pointer transition ${
              filters.beasiswa !== 'ALL'
                ? 'bg-purple-50 border-purple-300 text-purple-800 font-semibold'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] focus:border-[#064E3B] focus:bg-white'
            }`}
          >
            <option value="ALL">Semua Kategori SPP</option>
            <option value="Beasiswa Prestasi (100%)">🏆 Beasiswa Prestasi (Bebas 100%)</option>
            <option value="Beasiswa Prestasi (50%)">⭐ Beasiswa Prestasi (Diskon 50%)</option>
            <option value="Beasiswa Tahfidz">📖 Beasiswa Tahfidz Al-Qur'an</option>
            <option value="Beasiswa Yatim / Dhuafa">🤲 Beasiswa Yatim / Dhuafa</option>
            <option value="Reguler">Santri Reguler (SPP Penuh)</option>
          </select>
        </div>

        {/* Subtle Reset Button if filtered */}
        {isFiltered && (
          <button
            id="btn-reset-filters"
            onClick={onResetFilters}
            className="h-9 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] text-xs font-medium flex items-center gap-1.5 transition active:scale-98"
            title="Reset semua filter pencarian"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>
    </div>
  );
};
