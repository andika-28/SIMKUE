import React from 'react';
import { Calendar, CalendarRange, Layers, Filter } from 'lucide-react';

interface YearlyPeriodSemesterSelectorProps {
  selectedSemester: string; // 'Semua' | 'Semester Ganjil' | 'Semester Genap'
  onSelectSemester: (semester: string) => void;
  academicYear: string;
  onChangeAcademicYear: (year: string) => void;
  availableYears?: string[];
}

export const YearlyPeriodSemesterSelector: React.FC<YearlyPeriodSemesterSelectorProps> = ({
  selectedSemester,
  onSelectSemester,
  academicYear,
  onChangeAcademicYear,
  availableYears = ['2026 / 2027', '2025 / 2026', '2024 / 2025'],
}) => {
  const semesterOptions = [
    { id: 'Semua', label: 'Semua Semester', shortLabel: 'Semua' },
    { id: 'Semester Ganjil', label: 'Semester Ganjil', shortLabel: 'Ganjil' },
    { id: 'Semester Genap', label: 'Semester Genap', shortLabel: 'Genap' },
  ];

  return (
    <div
      id="yearly-period-semester-selector"
      className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
    >
      {/* LEFT: Segmented control for Semester */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
          <CalendarRange className="w-4 h-4 text-[#064E3B]" />
          <span>Periode Pembayaran:</span>
        </span>

        <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200 w-full sm:w-auto">
          {semesterOptions.map((opt) => {
            const isActive = selectedSemester === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`btn-semester-${opt.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectSemester(opt.id)}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Academic Year Selector */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Tahun Ajaran:
          </span>
          <div className="relative">
            <select
              id="select-academic-year-yearly"
              value={academicYear}
              onChange={(e) => onChangeAcademicYear(e.target.value)}
              className="text-xs font-bold text-[#0F172A] bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent cursor-pointer"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Status: Aktif</span>
        </div>
      </div>
    </div>
  );
};
