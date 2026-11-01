import React from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Building2,
  GraduationCap,
  Layers,
  Clock,
  CircleDollarSign,
  UserCheck,
} from 'lucide-react';
import { ArrearsFilterState } from '../../types';

interface ArrearsFilterToolbarProps {
  filter: ArrearsFilterState;
  onChangeFilter: (updates: Partial<ArrearsFilterState>) => void;
  onResetFilter: () => void;
  totalFiltered: number;
  totalRecords: number;
}

export const ArrearsFilterToolbar: React.FC<ArrearsFilterToolbarProps> = ({
  filter,
  onChangeFilter,
  onResetFilter,
  totalFiltered,
  totalRecords,
}) => {
  const isFiltered =
    filter.search !== '' ||
    filter.unit !== 'Semua Unit' ||
    filter.kelas !== 'Semua Kelas' ||
    (filter.jenisTunggakan !== 'Semua Jenis' && filter.jenisTunggakan !== '') ||
    (filter.filterBulan && filter.filterBulan !== 'Semua Bulan') ||
    (filter.filterItemTahunan && filter.filterItemTahunan !== 'Semua Item Tahunan' && filter.filterItemTahunan !== 'Semua Item') ||
    filter.kategoriTunggakan !== 'Semua Kategori' ||
    filter.nominalTunggakan !== 'Semua Nominal' ||
    filter.statusSantri !== 'Aktif' ||
    filter.priorityFilter !== 'Semua';

  const isBulananOnly = filter.jenisTunggakan === 'Bulanan Saja' || filter.jenisTunggakan === 'Tagihan Bulanan';
  const isTahunanOnly = filter.jenisTunggakan === 'Tahunan Saja' || filter.jenisTunggakan === 'Tagihan Tahunan';

  return (
    <div
      id="toolbar-arrears-filter"
      className="p-4 sm:p-5 bg-slate-50/70 border-b border-[#E2E8F0] space-y-3.5"
    >
      {/* Quick Mode Switcher Pills: Semua | Bulanan Saja | Tahunan Saja | Keduanya */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-slate-200/70">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Mode Tampilan:
          </span>
          <button
            type="button"
            onClick={() =>
              onChangeFilter({
                jenisTunggakan: 'Semua Jenis',
                filterBulan: 'Semua Bulan',
                filterItemTahunan: 'Semua Item Tahunan',
              })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter.jenisTunggakan === 'Semua Jenis' && (!filter.filterBulan || filter.filterBulan === 'Semua Bulan') && (!filter.filterItemTahunan || filter.filterItemTahunan === 'Semua Item Tahunan')
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua Tagihan
          </button>

          <button
            type="button"
            id="btn-quick-filter-bulanan"
            onClick={() =>
              onChangeFilter({
                jenisTunggakan: 'Bulanan Saja',
              })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isBulananOnly
                ? 'bg-amber-700 text-white shadow-xs ring-2 ring-amber-500/20'
                : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <span>Bulanan Saja</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
              isBulananOnly ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-800'
            }`}>
              SPP & Operasional
            </span>
          </button>

          <button
            type="button"
            id="btn-quick-filter-tahunan"
            onClick={() =>
              onChangeFilter({
                jenisTunggakan: 'Tahunan Saja',
              })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isTahunanOnly
                ? 'bg-orange-700 text-white shadow-xs ring-2 ring-orange-500/20'
                : 'bg-white text-orange-900 hover:bg-orange-50 border border-orange-200'
            }`}
          >
            <span>Tahunan Saja (Per Item)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
              isTahunanOnly ? 'bg-orange-800 text-orange-100' : 'bg-orange-100 text-orange-800'
            }`}>
              Pembangunan • Kertas • Kegiatan
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChangeFilter({
                jenisTunggakan: 'Keduanya',
              })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter.jenisTunggakan === 'Keduanya'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Menunggak Keduanya
          </button>
        </div>

        {/* Indicator if specific month or specific yearly item is filtered */}
        {(filter.filterBulan && filter.filterBulan !== 'Semua Bulan') && (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold">
            <span>Filter Bulan: {filter.filterBulan}</span>
            <button
              type="button"
              onClick={() => onChangeFilter({ filterBulan: 'Semua Bulan' })}
              className="ml-1 text-amber-700 hover:text-amber-950 font-black cursor-pointer"
            >
              ✕
            </button>
          </span>
        )}

        {(filter.filterItemTahunan && filter.filterItemTahunan !== 'Semua Item Tahunan' && filter.filterItemTahunan !== 'Semua Item') && (
          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-900 border border-orange-300 px-2.5 py-1 rounded-lg text-xs font-bold">
            <span>
              Item Tahunan:{' '}
              {filter.filterItemTahunan === 'pembangunan'
                ? 'Uang Pembangunan'
                : filter.filterItemTahunan === 'kertas'
                ? 'Uang Kertas & Ujian'
                : filter.filterItemTahunan === 'kegiatan'
                ? 'Uang Kegiatan Santri'
                : filter.filterItemTahunan}
            </span>
            <button
              type="button"
              onClick={() => onChangeFilter({ filterItemTahunan: 'Semua Item Tahunan' })}
              className="ml-1 text-orange-700 hover:text-orange-950 font-black cursor-pointer"
            >
              ✕
            </button>
          </span>
        )}
      </div>

      {/* Top Row: Search input + Sorting selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        {/* Search Field */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-search-arrears-student"
            value={filter.search}
            onChange={(e) => onChangeFilter({ search: e.target.value })}
            placeholder="Cari Nama atau NIS Santri..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B] transition-all shadow-2xs"
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

        {/* Sorting + Record summary count */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium">Urutkan:</span>
            <select
              id="select-sort-arrears"
              value={filter.sortBy}
              onChange={(e) =>
                onChangeFilter({
                  sortBy: e.target.value as ArrearsFilterState['sortBy'],
                })
              }
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer text-xs"
            >
              <option value="totalDesc">Total Tunggakan Tertinggi</option>
              <option value="totalAsc">Total Tunggakan Terendah</option>
              <option value="bulananDesc">Tunggakan Bulanan Tertinggi</option>
              <option value="tahunanDesc">Tunggakan Tahunan Tertinggi</option>
              <option value="periodeAsc">Periode Terlama Dahulu</option>
              <option value="namaAsc">Nama Santri (A – Z)</option>
            </select>
          </div>

          {isFiltered && (
            <button
              type="button"
              id="btn-reset-arrears-filter"
              onClick={onResetFilter}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2.5 pt-1">
        {/* 1. Unit */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Unit
          </label>
          <div className="relative">
            <select
              id="filter-select-unit"
              value={filter.unit}
              onChange={(e) => onChangeFilter({ unit: e.target.value })}
              className="w-full appearance-none bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all cursor-pointer pr-6 shadow-2xs"
            >
              <option value="Semua Unit">Semua Unit</option>
              <option value="MTs">MTs</option>
              <option value="MA">MA</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 2. Kelas */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Kelas
          </label>
          <div className="relative">
            <select
              id="filter-select-kelas"
              value={filter.kelas}
              onChange={(e) => onChangeFilter({ kelas: e.target.value })}
              className="w-full appearance-none bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all cursor-pointer pr-6 shadow-2xs"
            >
              <option value="Semua Kelas">Semua Kelas</option>
              <option value="Kelas 1">Kelas 1</option>
              <option value="Kelas 2">Kelas 2</option>
              <option value="Kelas 3">Kelas 3</option>
              <option value="Kelas 4">Kelas 4</option>
              <option value="Kelas 5">Kelas 5</option>
              <option value="Kelas 6">Kelas 6</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 3. Jenis Tunggakan */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Jenis Tagihan
          </label>
          <div className="relative">
            <select
              id="filter-select-jenis-tunggakan"
              value={filter.jenisTunggakan}
              onChange={(e) =>
                onChangeFilter({ jenisTunggakan: e.target.value })
              }
              className={`w-full appearance-none rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 transition-all cursor-pointer pr-6 shadow-2xs ${
                filter.jenisTunggakan === 'Bulanan Saja' || filter.jenisTunggakan === 'Tagihan Bulanan'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 focus:border-amber-500 focus:ring-amber-500'
                  : filter.jenisTunggakan === 'Tahunan Saja' || filter.jenisTunggakan === 'Tagihan Tahunan'
                  ? 'bg-orange-50 border-orange-300 text-orange-900 focus:border-orange-500 focus:ring-orange-500'
                  : 'bg-white border-[#CBD5E1] text-slate-800 focus:border-[#064E3B] focus:ring-[#064E3B]'
              }`}
            >
              <option value="Semua Jenis">Semua Jenis</option>
              <option value="Bulanan Saja">Bulanan Saja</option>
              <option value="Tahunan Saja">Tahunan Saja</option>
              <option value="Keduanya">Keduanya</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 4. Filter Bulan (Bulanan Saja) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center justify-between">
            <span>Bulan Menunggak</span>
          </label>
          <div className="relative">
            <select
              id="filter-select-bulan"
              value={filter.filterBulan || 'Semua Bulan'}
              onChange={(e) =>
                onChangeFilter({ filterBulan: e.target.value })
              }
              className={`w-full appearance-none rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none transition-all cursor-pointer pr-6 shadow-2xs ${
                filter.filterBulan && filter.filterBulan !== 'Semua Bulan'
                  ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                  : 'bg-white border-[#CBD5E1] text-slate-800 focus:border-[#064E3B]'
              }`}
            >
              <option value="Semua Bulan">Semua Bulan</option>
              <option value="Agustus 2026">Agustus 2026</option>
              <option value="Juli 2026">Juli 2026</option>
              <option value="Juni 2026">Juni 2026</option>
              <option value="Mei 2026">Mei 2026</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 5. Filter Item Tahunan (Per Item) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Item Tahunan
          </label>
          <div className="relative">
            <select
              id="filter-select-item-tahunan"
              value={filter.filterItemTahunan || 'Semua Item Tahunan'}
              onChange={(e) =>
                onChangeFilter({ filterItemTahunan: e.target.value })
              }
              className={`w-full appearance-none rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none transition-all cursor-pointer pr-6 shadow-2xs ${
                filter.filterItemTahunan && filter.filterItemTahunan !== 'Semua Item Tahunan' && filter.filterItemTahunan !== 'Semua Item'
                  ? 'bg-orange-50 border-orange-400 text-orange-950 font-bold'
                  : 'bg-white border-[#CBD5E1] text-slate-800 focus:border-[#064E3B]'
              }`}
            >
              <option value="Semua Item Tahunan">Semua Item Tahunan</option>
              <option value="pembangunan">Uang Pembangunan (Belum Lunas)</option>
              <option value="kertas">Uang Kertas & Ujian (Belum Lunas)</option>
              <option value="kegiatan">Uang Kegiatan (Belum Lunas)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 6. Kategori Usia */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Kategori Usia
          </label>
          <div className="relative">
            <select
              id="filter-select-kategori"
              value={filter.kategoriTunggakan}
              onChange={(e) =>
                onChangeFilter({ kategoriTunggakan: e.target.value })
              }
              className="w-full appearance-none bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all cursor-pointer pr-6 shadow-2xs"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="< 1 Bulan">&lt; 1 Bulan</option>
              <option value="1 Bulan">1 Bulan</option>
              <option value="1–2 Bulan">1–2 Bulan</option>
              <option value="2–3 Bulan">2–3 Bulan</option>
              <option value="> 3 Bulan">&gt; 3 Bulan (Mendesak)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 7. Nominal Tunggakan */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Nominal Tunggakan
          </label>
          <div className="relative">
            <select
              id="filter-select-nominal"
              value={filter.nominalTunggakan}
              onChange={(e) =>
                onChangeFilter({ nominalTunggakan: e.target.value })
              }
              className="w-full appearance-none bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all cursor-pointer pr-6 shadow-2xs"
            >
              <option value="Semua Nominal">Semua Nominal</option>
              <option value="< Rp500.000">&lt; Rp500.000</option>
              <option value="Rp500.000 – Rp1.000.000">Rp500Rb – Rp1 Jt</option>
              <option value="Rp1.000.000 – Rp3.000.000">Rp1 Jt – Rp3 Jt</option>
              <option value="> Rp3.000.000">&gt; Rp3.000.000</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 8. Status Santri */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Status Santri
          </label>
          <div className="relative">
            <select
              id="filter-select-status-santri"
              value={filter.statusSantri}
              onChange={(e) =>
                onChangeFilter({ statusSantri: e.target.value })
              }
              className="w-full appearance-none bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all cursor-pointer pr-6 shadow-2xs"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif / Pindah">Nonaktif / Pindah</option>
              <option value="Semua">Semua Status</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Result Indicator Badge */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-medium">
        <div>
          Menampilkan <span className="font-extrabold text-slate-900">{totalFiltered}</span> dari{' '}
          <span className="font-bold text-slate-700">{totalRecords}</span> santri menunggak
        </div>
        {filter.priorityFilter !== 'Semua' && (
          <div className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
            <span>Filter Prioritas Aktif: {filter.priorityFilter}</span>
            <button
              type="button"
              onClick={() => onChangeFilter({ priorityFilter: 'Semua' })}
              className="hover:text-rose-900 ml-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
