import React from 'react';
import { Search, Filter, RotateCcw, X } from 'lucide-react';
import { MonthlyBillingFilter } from '../../types';

interface MonthlyBillFilterToolbarProps {
  filters: MonthlyBillingFilter;
  onFilterChange: (key: keyof MonthlyBillingFilter, value: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalAll: number;
}

export const MonthlyBillFilterToolbar: React.FC<MonthlyBillFilterToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
  totalAll,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.unit !== 'Semua Unit' ||
    filters.kelas !== 'Semua Kelas' ||
    filters.status !== 'Semua Status' ||
    filters.paketMakan !== 'Semua Paket';

  return (
    <div
      id="monthly-bill-filter-toolbar"
      className="p-4 bg-slate-50/70 border-b border-[#E2E8F0] space-y-3"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="input-search-billing"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Cari Nama atau NIS Santri..."
            className="w-full pl-10 pr-9 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B] transition-all shadow-2xs"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange('search', '')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Unit */}
          <div className="min-w-[120px]">
            <select
              id="filter-unit"
              value={filters.unit}
              onChange={(e) => onFilterChange('unit', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B] shadow-2xs cursor-pointer"
            >
              <option value="Semua Unit">Semua Unit</option>
              <option value="MTs">MTs (Madrasah Tsanawiyah)</option>
              <option value="MA">MA (Madrasah Aliyah)</option>
            </select>
          </div>

          {/* Kelas */}
          <div className="min-w-[120px]">
            <select
              id="filter-kelas"
              value={filters.kelas}
              onChange={(e) => onFilterChange('kelas', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B] shadow-2xs cursor-pointer"
            >
              <option value="Semua Kelas">Semua Kelas</option>
              <option value="Kelas 1">Kelas 1 (MTs)</option>
              <option value="Kelas 2">Kelas 2 (MTs)</option>
              <option value="Kelas 3">Kelas 3 (MTs)</option>
              <option value="Kelas 4">Kelas 4 (MA)</option>
              <option value="Kelas 5">Kelas 5 (MA)</option>
              <option value="Kelas 6">Kelas 6 (MA)</option>
            </select>
          </div>

          {/* Status Pembayaran */}
          <div className="min-w-[130px]">
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B] shadow-2xs cursor-pointer"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Lunas">Lunas (240)</option>
              <option value="Belum Lunas">Belum Lunas (60)</option>
            </select>
          </div>

          {/* Paket Makan */}
          <div className="min-w-[130px]">
            <select
              id="filter-paket-makan"
              value={filters.paketMakan}
              onChange={(e) => onFilterChange('paketMakan', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B] shadow-2xs cursor-pointer"
            >
              <option value="Semua Paket">Semua Paket</option>
              <option value="Paket A">Paket A (Makan di Rumah - Rp0)</option>
              <option value="Paket B">Paket B (2x Makan Rumah - Rp200rb)</option>
              <option value="Paket C">Paket C (Full Pesantren - Rp600rb)</option>
            </select>
          </div>

          {/* Reset Filter Button */}
          {isFiltered && (
            <button
              type="button"
              id="btn-reset-filters"
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-colors"
              title="Reset Semua Filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter status indicator & counter */}
      <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
        <div className="flex items-center gap-2">
          <span>
            Menampilkan <strong>{totalFiltered}</strong> dari <strong>{totalAll}</strong> total tagihan
          </span>
          {isFiltered && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-[#064E3B] px-2 py-0.5 rounded-md font-medium">
              <Filter className="w-3 h-3" />
              Filter Aktif
            </span>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> SPP Standar Rp200.000
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Listrik & Air Rp50.000
          </span>
        </div>
      </div>
    </div>
  );
};
