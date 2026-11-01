import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Check, Sparkles } from 'lucide-react';
import { AVAILABLE_MONTHS } from '../../data/monthlyBillingData';

interface MonthPeriodSelectorProps {
  currentPeriod: string;
  onSelectPeriod: (period: string) => void;
  onGenerateClick?: () => void;
}

export const MonthPeriodSelector: React.FC<MonthPeriodSelectorProps> = ({
  currentPeriod,
  onSelectPeriod,
  onGenerateClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentIndex = AVAILABLE_MONTHS.findIndex((m) => m.label === currentPeriod);
  const prevMonth = currentIndex > 0 ? AVAILABLE_MONTHS[currentIndex - 1] : null;
  const nextMonth = currentIndex < AVAILABLE_MONTHS.length - 1 ? AVAILABLE_MONTHS[currentIndex + 1] : null;

  return (
    <div
      id="billing-period-selector"
      className="bg-white rounded-xl p-4 md:p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      {/* Left: Label & Current Active Month description */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200/80 flex-shrink-0">
          <Calendar className="w-5 h-5 text-[#064E3B]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Periode Tagihan
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-[#064E3B]">
              T.A. 2026 / 2027
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Tagihan untuk periode aktif.
          </p>
        </div>
      </div>

      {/* Center & Right: Prominent Selector with Quick Navigation */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
        {/* Previous Month Navigation Button */}
        {prevMonth ? (
          <button
            type="button"
            id="btn-prev-month"
            onClick={() => onSelectPeriod(prevMonth.label)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#475569] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title={`Pindah ke ${prevMonth.label}`}
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>{prevMonth.label}</span>
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-50 border border-slate-100 rounded-lg cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-slate-300" />
            <span>Bulan Sebelumnya</span>
          </button>
        )}

        {/* Prominent Active Month Selector Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            id="btn-active-month-dropdown"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2 bg-[#064E3B] text-white font-bold text-sm rounded-lg shadow-sm hover:bg-[#047857] transition-all ring-2 ring-emerald-600/20"
          >
            <Calendar className="w-4 h-4 text-emerald-200" />
            <span>{currentPeriod}</span>
            <ChevronDown className={`w-4 h-4 text-emerald-200 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Month dropdown list */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Pilih Bulan Tagihan
                </div>
                {AVAILABLE_MONTHS.map((m) => {
                  const isSelected = m.label === currentPeriod;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onSelectPeriod(m.label);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 text-[#064E3B] font-bold'
                          : 'text-[#334155] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{m.label}</span>
                        {m.isCurrent && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                            Aktif
                          </span>
                        )}
                        {!m.hasData && (
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-medium">
                            Belum dibuat
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#064E3B]" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Next Month Navigation Button */}
        {nextMonth ? (
          <button
            type="button"
            id="btn-next-month"
            onClick={() => onSelectPeriod(nextMonth.label)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#475569] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title={`Pindah ke ${nextMonth.label}`}
          >
            <span>{nextMonth.label}</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-50 border border-slate-100 rounded-lg cursor-not-allowed"
          >
            <span>Bulan Berikutnya</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        )}
      </div>
    </div>
  );
};
