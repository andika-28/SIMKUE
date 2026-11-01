import React from 'react';
import { Search, RotateCcw, Filter, ChevronDown, Layers } from 'lucide-react';
import { DiscountFilterState } from '../../types';

interface DiscountTableToolbarProps {
  filter: DiscountFilterState;
  onChangeFilter: (updates: Partial<DiscountFilterState>) => void;
  onResetFilter: () => void;
  totalFiltered: number;
  totalRecords: number;
}

export const DiscountTableToolbar: React.FC<DiscountTableToolbarProps> = ({
  filter,
  onChangeFilter,
  onResetFilter,
  totalFiltered,
  totalRecords,
}) => {
  const jenisTagihanOptions = [
    'Semua Jenis',
    'SPP',
    'Uang Makan',
    'Listrik & Air',
  ];

  const targetDiskonOptions = [
    'Semua Target',
    'Semua Santri',
    'Paket Makan',
    'Unit',
    'Kelas',
    'Santri Tertentu',
  ];

  const isFiltered =
    filter.search.trim() !== '' ||
    filter.jenisTagihan !== 'Semua Jenis' ||
    filter.targetDiskon !== 'Semua Target' ||
    filter.status !== 'Semua Status';

  return (
    <div className="p-4 border-b border-[#E2E8F0] bg-slate-50/50 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            id="input-search-discount"
            value={filter.search}
            onChange={(e) => onChangeFilter({ search: e.target.value })}
            placeholder="Cari diskon atau keterangan..."
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-colors shadow-2xs"
          />
          {filter.search && (
            <button
              type="button"
              onClick={() => onChangeFilter({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Multi Filters and Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter: Jenis Tagihan */}
          <div className="relative min-w-[140px] flex-1 sm:flex-none">
            <select
              id="select-filter-jenis-tagihan"
              value={filter.jenisTagihan}
              onChange={(e) => onChangeFilter({ jenisTagihan: e.target.value })}
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 pr-8 appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#064E3B] transition-colors cursor-pointer shadow-2xs"
            >
              {jenisTagihanOptions.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter: Target Diskon */}
          <div className="relative min-w-[150px] flex-1 sm:flex-none">
            <select
              id="select-filter-target-diskon"
              value={filter.targetDiskon}
              onChange={(e) => onChangeFilter({ targetDiskon: e.target.value })}
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 pr-8 appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#064E3B] transition-colors cursor-pointer shadow-2xs"
            >
              {targetDiskonOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filter Button */}
          {isFiltered && (
            <button
              type="button"
              id="btn-reset-discount-filter"
              onClick={onResetFilter}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-200/70 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Record Count Badge */}
          <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
            Menampilkan <strong className="text-slate-800">{totalFiltered}</strong> dari {totalRecords} diskon
          </span>
        </div>
      </div>
    </div>
  );
};
