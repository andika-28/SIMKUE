import React from 'react';
import {
  Calendar,
  Filter,
  Plus,
  Layers,
  ChevronDown,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

interface DiscountPeriodFilterBarProps {
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
  selectedAcademicYear: string;
  onChangeAcademicYear: (year: string) => void;
  selectedStatus: string;
  onChangeStatus: (status: string) => void;
  onOpenCreateModal: () => void;
}

export const DiscountPeriodFilterBar: React.FC<DiscountPeriodFilterBarProps> = ({
  selectedMonth,
  onChangeMonth,
  selectedAcademicYear,
  onChangeAcademicYear,
  selectedStatus,
  onChangeStatus,
  onOpenCreateModal,
}) => {
  const monthOptions = [
    'Agustus 2026',
    'September 2026',
    'Juli 2026',
    'Juni 2026',
    'Mei 2026',
    'Semua Periode',
  ];

  const academicYearOptions = [
    '2026 / 2027',
    '2025 / 2026',
    '2027 / 2028',
  ];

  const statusOptions = [
    'Semua Status',
    'Aktif',
    'Draft',
    'Sudah Diterapkan',
    'Dibatalkan',
  ];

  return (
    <div
      id="discount-period-filter-bar"
      className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
    >
      {/* Left side filters */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="flex items-center gap-2 pr-2 border-r border-slate-200 hidden sm:flex">
          <CalendarDays className="w-4 h-4 text-[#064E3B]" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Periode
          </span>
        </div>

        {/* Month Selector */}
        <div className="relative min-w-[150px] flex-1 sm:flex-none">
          <select
            id="select-discount-month"
            value={selectedMonth}
            onChange={(e) => onChangeMonth(e.target.value)}
            className="w-full text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-colors cursor-pointer"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m} {m === 'Agustus 2026' ? '(Aktif)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Academic Year Selector */}
        <div className="relative min-w-[140px] flex-1 sm:flex-none">
          <select
            id="select-discount-academic-year"
            value={selectedAcademicYear}
            onChange={(e) => onChangeAcademicYear(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-colors cursor-pointer"
          >
            {academicYearOptions.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Selector */}
        <div className="relative min-w-[150px] flex-1 sm:flex-none">
          <select
            id="select-discount-status"
            value={selectedStatus}
            onChange={(e) => onChangeStatus(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#064E3B] focus:border-transparent transition-colors cursor-pointer"
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right side primary action button */}
      <div className="w-full lg:w-auto flex justify-end">
        <button
          type="button"
          id="btn-open-create-discount-modal"
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#064E3B] hover:bg-[#047857] active:scale-98 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Diskon Baru</span>
        </button>
      </div>
    </div>
  );
};
