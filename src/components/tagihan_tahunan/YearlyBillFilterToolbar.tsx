import React from 'react';
import { Search, Filter, RotateCcw, X } from 'lucide-react';
import { YearlyBillingFilter } from '../../types';

interface YearlyBillFilterToolbarProps {
  filter: YearlyBillingFilter;
  onChangeFilter: (newFilter: Partial<YearlyBillingFilter>) => void;
  onResetFilter: () => void;
  totalFiltered: number;
  totalRecords: number;
}

export const YearlyBillFilterToolbar: React.FC<YearlyBillFilterToolbarProps> = ({
  filter,
  onChangeFilter,
  onResetFilter,
  totalFiltered,
  totalRecords,
}) => {
  const isFiltered =
    Boolean(filter.search) ||
    filter.unit !== 'Semua Unit' ||
    filter.kelas !== 'Semua Kelas' ||
    filter.statusSantri !== 'Semua Status' ||
    filter.semester !== 'Semua Semester' ||
    filter.statusPembayaran !== 'Semua Status';

  return (
    <div
      id="yearly-bill-filter-toolbar"
      className="p-4 bg-slate-50 border-b border-[#E2E8F0] space-y-3"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-search-yearly-bill"
            value={filter.search}
            onChange={(e) => onChangeFilter({ search: e.target.value })}
            placeholder="Cari Nama atau NIS Santri..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-all placeholder:text-slate-400"
          />
          {filter.search && (
            <button
              type="button"
              onClick={() => onChangeFilter({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Unit */}
          <div>
            <select
              id="filter-yearly-unit"
              value={filter.unit}
              onChange={(e) => onChangeFilter({ unit: e.target.value })}
              aria-label="Filter Unit"
              className="w-full text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-medium text-slate-700 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent cursor-pointer"
            >
              <option value="Semua Unit">Semua Unit</option>
              <option value="MTs">MTs</option>
              <option value="MA">MA</option>
            </select>
          </div>

          {/* Kelas */}
          <div>
            <select
              id="filter-yearly-kelas"
              value={filter.kelas}
              onChange={(e) => onChangeFilter({ kelas: e.target.value })}
              aria-label="Filter Kelas"
              className="w-full text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-medium text-slate-700 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent cursor-pointer"
            >
              <option value="Semua Kelas">Semua Kelas</option>
              <option value="Kelas 1">Kelas 1</option>
              <option value="Kelas 2">Kelas 2</option>
              <option value="Kelas 3">Kelas 3</option>
              <option value="Kelas 4">Kelas 4</option>
              <option value="Kelas 5">Kelas 5</option>
              <option value="Kelas 6">Kelas 6</option>
            </select>
          </div>

          {/* Status Santri (Santri Baru / Santri Lama) */}
          <div>
            <select
              id="filter-yearly-status-santri"
              value={filter.statusSantri}
              onChange={(e) => onChangeFilter({ statusSantri: e.target.value })}
              aria-label="Filter Status Santri"
              className="w-full text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-medium text-slate-700 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent cursor-pointer"
            >
              <option value="Semua Status">Status Santri</option>
              <option value="Santri Baru">Santri Baru</option>
              <option value="Santri Lama">Santri Lama</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <select
              id="filter-yearly-semester"
              value={filter.semester}
              onChange={(e) => onChangeFilter({ semester: e.target.value })}
              aria-label="Filter Semester"
              className="w-full text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-medium text-slate-700 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent cursor-pointer"
            >
              <option value="Semua Semester">Semua Semester</option>
              <option value="Semester Ganjil">Semester Ganjil</option>
              <option value="Semester Genap">Semester Genap</option>
            </select>
          </div>

          {/* Status Pembayaran */}
          <div>
            <select
              id="filter-yearly-payment-status"
              value={filter.statusPembayaran}
              onChange={(e) => onChangeFilter({ statusPembayaran: e.target.value })}
              aria-label="Filter Status Pembayaran"
              className="w-full text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-2 font-medium text-slate-700 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent cursor-pointer"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Lunas">Lunas</option>
              <option value="Sebagian">Sebagian</option>
              <option value="Belum Dibayar">Belum Dibayar</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            id="btn-reset-yearly-filter"
            onClick={onResetFilter}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors whitespace-nowrap self-end lg:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>

      {/* Filter Stats Badge */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div>
          Menampilkan <strong className="text-slate-800 font-bold">{totalFiltered}</strong> dari{' '}
          <strong className="text-slate-800 font-bold">{totalRecords}</strong> santri terdaftar
        </div>
        {isFiltered && (
          <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
            Filter aktif
          </span>
        )}
      </div>
    </div>
  );
};
