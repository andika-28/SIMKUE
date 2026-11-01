import React from 'react';
import {
  Search,
  Calendar,
  Filter,
  RotateCcw,
  Tag,
  Landmark,
  FileCheck2,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { initialExpenseCategories } from '../../data/expenseData';

interface ExpenseFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedAccount: string;
  onAccountChange: (acc: string) => void;
  selectedReceiptStatus: string;
  onReceiptStatusChange: (st: string) => void;
  dateRangePreset: string;
  onDateRangePresetChange: (preset: string) => void;
  startDate: string;
  onStartDateChange: (d: string) => void;
  endDate: string;
  onEndDateChange: (d: string) => void;
  onResetFilters: () => void;
  activeQuickTab: string;
  onSelectQuickTab: (tab: string) => void;
  totalFilteredCount: number;
}

export const ExpenseFilterToolbar: React.FC<ExpenseFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedAccount,
  onAccountChange,
  selectedReceiptStatus,
  onReceiptStatusChange,
  dateRangePreset,
  onDateRangePresetChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onResetFilters,
  activeQuickTab,
  onSelectQuickTab,
  totalFilteredCount,
}) => {
  const quickTabs = [
    { id: 'Semua', label: 'Semua' },
    { id: 'Hari Ini', label: 'Hari Ini' },
    { id: 'Minggu Ini', label: 'Minggu Ini' },
    { id: 'Bulan Ini', label: 'Bulan Ini' },
    { id: 'Tahun Ini', label: 'Tahun Ini' },
  ];

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'SEMUA' ||
    selectedAccount !== 'SEMUA' ||
    selectedReceiptStatus !== 'SEMUA' ||
    activeQuickTab !== 'Semua';

  return (
    <div
      id="expense-filter-toolbar"
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4"
    >
      {/* Top Row: Quick Tabs & Results Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {quickTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`quick-tab-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectQuickTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeQuickTab === tab.id
                  ? 'bg-[#064E3B] text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Menampilkan</span>
          <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
            {totalFilteredCount}
          </span>
          <span>transaksi</span>
        </div>
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* 1. Search (lg:col-span-3) */}
        <div className="lg:col-span-3 relative">
          <label htmlFor="search-expenses" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pencarian
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-expenses"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari transaksi atau keterangan..."
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B] transition-all"
            />
          </div>
        </div>

        {/* 2. Date Range (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <label htmlFor="date-start" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Rentang Tanggal (01 Agu - 31 Agu 2026)
          </label>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                id="date-start"
                type="text"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                placeholder="01 Agu 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>
            <span className="text-slate-400 text-xs">-</span>
            <div className="relative flex-1">
              <input
                id="date-end"
                type="text"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                placeholder="31 Agu 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>
          </div>
        </div>

        {/* 3. Category (lg:col-span-2) */}
        <div className="lg:col-span-2">
          <label htmlFor="select-category" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Kategori
          </label>
          <select
            id="select-category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#064E3B] cursor-pointer"
          >
            <option value="SEMUA">Semua Kategori</option>
            {initialExpenseCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* 4. Rekening (lg:col-span-2) */}
        <div className="lg:col-span-2">
          <label htmlFor="select-rekening" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Sumber Rekening
          </label>
          <select
            id="select-rekening"
            value={selectedAccount}
            onChange={(e) => onAccountChange(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#064E3B] cursor-pointer"
          >
            <option value="SEMUA">Semua Rekening</option>
            <option value="BNI Rekening 1">BNI Rekening 1 (Operasional)</option>
            <option value="BNI Rekening 2">BNI Rekening 2 (Pembangunan)</option>
          </select>
        </div>

        {/* 5. Status Bukti & Reset (lg:col-span-2) */}
        <div className="lg:col-span-2 flex items-end gap-1.5">
          <div className="flex-1">
            <label htmlFor="select-status-bukti" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Status Bukti
            </label>
            <select
              id="select-status-bukti"
              value={selectedReceiptStatus}
              onChange={(e) => onReceiptStatusChange(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#064E3B] cursor-pointer"
            >
              <option value="SEMUA">Semua Status</option>
              <option value="LENGKAP">✓ Lengkap</option>
              <option value="MENUNGGU_NOTA">⚠ Menunggu Nota</option>
              <option value="PERLU_PERBAIKAN">✕ Perlu Pemeriksaan</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              id="btn-reset-filters"
              onClick={onResetFilters}
              title="Reset Semua Filter"
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
