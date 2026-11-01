import React, { useState } from 'react';
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Users,
  AlertCircle,
  Building2,
  PieChart,
  Receipt,
  ClipboardCheck,
  ArrowRight,
  Filter,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Download,
  Printer,
  Sparkles,
  Search,
  Check,
  ShieldCheck,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  Layers,
} from 'lucide-react';
import {
  ReportCategoryType,
  ReportPeriodType,
  UnitType,
  ReportFilterState,
  GeneratedReportAuditRecord,
} from '../../types';
import { formatRupiah, formatNumber } from '../../data/initialData';
import {
  reportExecutiveSummary,
  reportCardsCatalog,
  initialRecentReports,
  getFinancialSummary,
} from '../../data/reportData';
import { DetailReportView } from './DetailReportView';
import { ExportReportModal } from './ExportReportModal';
import { PrintReportModal } from './PrintReportModal';
import { ReportEmptyState } from './ReportEmptyState';
import { downloadExcelSpreadsheet, downloadPrintableReport } from '../../utils/fileDownloader';

interface PusatLaporanViewProps {
  onNavigateToNav?: (navId: string) => void;
  initialReportType?: ReportCategoryType | null;
  initialPeriodType?: ReportPeriodType;
}

export const PusatLaporanView: React.FC<PusatLaporanViewProps> = ({
  onNavigateToNav,
  initialReportType,
  initialPeriodType,
}) => {
  // Navigation / Active View State
  const [selectedReportType, setSelectedReportType] = useState<ReportCategoryType | null>(
    initialReportType || null
  );

  // Global Filter State
  const [filterState, setFilterState] = useState<ReportFilterState>({
    periodType: initialPeriodType || 'bulan_ini',
    startDate: initialPeriodType === 'hari_ini' ? '01 September 2026' : '01 Agustus 2026',
    endDate: initialPeriodType === 'hari_ini' ? '01 September 2026' : '31 Agustus 2026',
    unit: 'Semua Unit',
    academicYear: '2026 / 2027',
  });

  const [appliedFilterText, setAppliedFilterText] = useState(
    initialPeriodType === 'hari_ini' ? '01 September 2026 (Harian)' : 'Agustus 2026 (Semua Unit)'
  );

  React.useEffect(() => {
    if (initialReportType !== undefined) {
      setSelectedReportType(initialReportType);
    }
    if (initialPeriodType) {
      handleQuickPeriodSelect(initialPeriodType);
    }
  }, [initialReportType, initialPeriodType]);

  // Dynamic financial summary based on period filter
  const activeFinancialSummary = getFinancialSummary(filterState.periodType);

  // Modals state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportModalReportTitle, setExportModalReportTitle] = useState('Laporan Keuangan Bulanan');
  const [exportModalDefaultFormat, setExportModalDefaultFormat] = useState<'PDF' | 'Excel'>('PDF');
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printModalReportTitle, setPrintModalReportTitle] = useState('Laporan Keuangan Bulanan');

  // Recent reports state (allows dynamic download & addition)
  const [recentReports, setRecentReports] = useState<GeneratedReportAuditRecord[]>(initialRecentReports);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Quick period handlers
  const handleQuickPeriodSelect = (type: ReportPeriodType) => {
    if (type === 'hari_ini') {
      setFilterState((prev) => ({
        ...prev,
        periodType: type,
        startDate: '01 September 2026',
        endDate: '01 September 2026',
      }));
      setAppliedFilterText('01 September 2026 (Harian)');
    } else if (type === 'minggu_ini') {
      setFilterState((prev) => ({
        ...prev,
        periodType: type,
        startDate: '25 Agustus 2026',
        endDate: '31 Agustus 2026',
      }));
      setAppliedFilterText('25 - 31 Agustus 2026 (Mingguan)');
    } else if (type === 'bulan_ini') {
      setFilterState((prev) => ({
        ...prev,
        periodType: type,
        startDate: '01 Agustus 2026',
        endDate: '31 Agustus 2026',
      }));
      setAppliedFilterText('Agustus 2026 (Bulanan)');
    } else if (type === 'semester_ini') {
      setFilterState((prev) => ({
        ...prev,
        periodType: type,
        startDate: '01 Juli 2026',
        endDate: '31 Desember 2026',
      }));
      setAppliedFilterText('Semester Ganjil 2026/2027');
    } else if (type === 'tahun_ini') {
      setFilterState((prev) => ({
        ...prev,
        periodType: type,
        startDate: '01 Juli 2026',
        endDate: '30 Juni 2027',
      }));
      setAppliedFilterText('Tahun Ajaran 2026/2027');
    } else {
      setFilterState((prev) => ({
        ...prev,
        periodType: type,
      }));
    }
  };

  const handleApplyFilter = () => {
    const desc = `${filterState.startDate} s/d ${filterState.endDate} (${filterState.unit})`;
    setAppliedFilterText(desc);
    showToast(`Filter laporan diterapkan: ${desc}`);
  };

  const handleResetFilter = () => {
    setFilterState({
      periodType: 'bulan_ini',
      startDate: '01 Agustus 2026',
      endDate: '31 Agustus 2026',
      unit: 'Semua Unit',
      academicYear: '2026 / 2027',
    });
    setAppliedFilterText('Agustus 2026 (Semua Unit)');
    showToast('Filter laporan dikembalikan ke default Bulan Ini');
  };

  const handleExportSuccess = (format: 'PDF' | 'Excel', filename: string) => {
    const newRecord: GeneratedReportAuditRecord = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      reportName: exportModalReportTitle,
      reportType: selectedReportType || 'bulanan',
      period: `${filterState.startDate} - ${filterState.endDate}`,
      generatedBy: 'Administrator',
      role: 'Admin Sistem',
      generatedDate: 'Hari ini, Baru saja',
      fileFormat: format,
      fileSize: format === 'PDF' ? '1.5 MB' : '920 KB',
    };
    setRecentReports((prev) => [newRecord, ...prev]);
    showToast(`Dokumen ${filename} berhasil dibuat & diunduh.`);
  };

  const handleOpenExport = (title: string, format: 'PDF' | 'Excel' = 'PDF') => {
    setExportModalReportTitle(title);
    setExportModalDefaultFormat(format);
    setExportModalOpen(true);
  };

  const handleOpenPrint = (title: string) => {
    setPrintModalReportTitle(title);
    setPrintModalOpen(true);
  };

  // Helper mapping icon component
  const renderCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'TrendingDown':
        return <TrendingDown className="w-5 h-5" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5" />;
      case 'CalendarDays':
        return <CalendarDays className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'CalendarRange':
        return <CalendarRange className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5" />;
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'PieChart':
        return <PieChart className="w-5 h-5" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5" />;
      case 'ClipboardCheck':
        return <ClipboardCheck className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // If a detailed report is currently selected, render the DetailReportView
  if (selectedReportType) {
    return (
      <>
        <DetailReportView
          reportType={selectedReportType}
          onBackToHub={() => setSelectedReportType(null)}
          onSelectReportType={(type) => setSelectedReportType(type)}
          onOpenExportModal={handleOpenExport}
          onOpenPrintModal={handleOpenPrint}
          onShowToast={showToast}
          filterState={filterState}
          onUpdateFilter={(f) => setFilterState((prev) => ({ ...prev, ...f }))}
        />

        <ExportReportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          reportTitle={exportModalReportTitle}
          periodText={`${filterState.startDate} - ${filterState.endDate}`}
          periodType={filterState.periodType}
          defaultFormat={exportModalDefaultFormat}
          onExportSuccess={handleExportSuccess}
        />

        <PrintReportModal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          reportTitle={printModalReportTitle}
          periodText={`${filterState.startDate} - ${filterState.endDate}`}
          periodType={filterState.periodType}
        />

        {/* Global Toast */}
        {toastMessage && (
          <div
            id="laporan-toast"
            className="fixed bottom-6 right-6 z-50 bg-[#1E293B] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up text-xs font-medium"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div id="pusat-laporan-container" className="space-y-6">
      {/* 1. GLOBAL REPORT FILTER CARD */}
      <div
        id="global-report-filter-card"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center font-bold shadow-xs">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">Periode Laporan</h2>
              <p className="text-[11px] text-[#64748B]">
                Pilih rentang tanggal dan unit pesantren untuk sinkronisasi seluruh laporan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B]">Filter Aktif:</span>
            <span className="font-bold text-[#064E3B] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {appliedFilterText}
            </span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Quick Period Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[#64748B] mr-1">Cepat:</span>
            {[
              { id: 'hari_ini', label: 'Hari Ini' },
              { id: 'minggu_ini', label: 'Minggu Ini' },
              { id: 'bulan_ini', label: 'Bulan Ini' },
              { id: 'semester_ini', label: 'Semester Ini' },
              { id: 'tahun_ini', label: 'Tahun Ini' },
              { id: 'custom', label: 'Custom' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                id={`btn-period-${btn.id}`}
                onClick={() => handleQuickPeriodSelect(btn.id as ReportPeriodType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterState.periodType === btn.id
                    ? 'bg-[#064E3B] text-white shadow-2xs'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] border border-[#E2E8F0]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Date Range Inputs & Unit Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Start Date */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="input-filter-start-date"
                value={filterState.startDate}
                onChange={(e) => setFilterState({ ...filterState, startDate: e.target.value })}
                className="w-32 px-2.5 py-1.5 text-xs font-medium border border-[#CBD5E1] rounded-lg text-[#1E293B] focus:ring-1 focus:ring-[#064E3B] outline-none"
              />
              <span className="text-xs text-[#64748B] font-medium">s/d</span>
              {/* End Date */}
              <input
                type="text"
                id="input-filter-end-date"
                value={filterState.endDate}
                onChange={(e) => setFilterState({ ...filterState, endDate: e.target.value })}
                className="w-32 px-2.5 py-1.5 text-xs font-medium border border-[#CBD5E1] rounded-lg text-[#1E293B] focus:ring-1 focus:ring-[#064E3B] outline-none"
              />
            </div>

            {/* Unit Filter */}
            <select
              id="select-filter-unit"
              value={filterState.unit}
              onChange={(e) => setFilterState({ ...filterState, unit: e.target.value as UnitType })}
              className="px-3 py-1.5 text-xs font-medium border border-[#CBD5E1] rounded-lg text-[#1E293B] bg-white focus:ring-1 focus:ring-[#064E3B] outline-none"
            >
              <option value="Semua Unit">Semua Unit</option>
              <option value="MTs">MTs</option>
              <option value="MA">MA</option>
              <option value="Dapur">Dapur</option>
              <option value="Asrama">Asrama</option>
              <option value="Kantor">Kantor</option>
              <option value="Umum">Umum</option>
            </select>

            {/* Buttons */}
            <button
              type="button"
              id="btn-apply-report-filter"
              onClick={handleApplyFilter}
              className="px-4 py-1.5 text-xs font-bold bg-[#064E3B] text-white hover:bg-[#053D2E] rounded-lg transition shadow-2xs"
            >
              Terapkan Filter
            </button>

            <button
              type="button"
              id="btn-reset-report-filter"
              onClick={handleResetFilter}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE FINANCIAL SUMMARY (4 PREMIUM CARDS) */}
      <div id="executive-summary-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
            <span>Ringkasan Keuangan Periode</span>
            <span className="text-xs font-semibold text-[#064E3B] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {appliedFilterText}
            </span>
          </h2>
          <div className="text-xs text-[#64748B] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terverifikasi Real-Time Database SIMKEU</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Pemasukan (Green Accent) */}
          <div
            id="kpi-total-pemasukan"
            onClick={() => setSelectedReportType('pemasukan')}
            className="group cursor-pointer bg-white rounded-2xl border border-[#E2E8F0] hover:border-emerald-500 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Total Pemasukan
                </span>
                <div className="text-2xl font-black text-[#1E293B] mt-1">
                  {formatRupiah(activeFinancialSummary.totalPemasukan)}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-4 border-t border-[#F1F5F9] mt-3 flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">
                {activeFinancialSummary.pemasukanPeriod}
              </span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                {activeFinancialSummary.pemasukanTrend}
              </span>
            </div>
          </div>

          {/* Card 2: Total Pengeluaran (Amber Accent) */}
          <div
            id="kpi-total-pengeluaran"
            onClick={() => setSelectedReportType('pengeluaran')}
            className="group cursor-pointer bg-white rounded-2xl border border-[#E2E8F0] hover:border-amber-500 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Total Pengeluaran
                </span>
                <div className="text-2xl font-black text-[#1E293B] mt-1">
                  {formatRupiah(activeFinancialSummary.totalPengeluaran)}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-4 border-t border-[#F1F5F9] mt-3 flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">
                {activeFinancialSummary.pengeluaranPeriod}
              </span>
              <span className="font-bold text-amber-700 flex items-center gap-1">
                {activeFinancialSummary.pengeluaranTrend}
              </span>
            </div>
          </div>

          {/* Card 3: Surplus Periode (Emerald Accent) */}
          <div
            id="kpi-surplus-periode"
            onClick={() => setSelectedReportType('bulanan')}
            className="group cursor-pointer bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#064E3B] p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#064E3B]" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                  Surplus Periode
                </span>
                <div className="text-2xl font-black text-[#064E3B] mt-1">
                  +{formatRupiah(activeFinancialSummary.surplusPeriode)}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-4 border-t border-[#F1F5F9] mt-3 flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">
                {activeFinancialSummary.surplusFormula}
              </span>
              <span className="font-bold text-[#064E3B]">Fiskal Sehat</span>
            </div>
          </div>

          {/* Card 4: Total Saldo Bank (Blue Accent) */}
          <div
            id="kpi-total-saldo-bank"
            onClick={() => setSelectedReportType('rekening_bank')}
            className="group cursor-pointer bg-white rounded-2xl border border-[#E2E8F0] hover:border-blue-500 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Total Saldo Bank
                </span>
                <div className="text-2xl font-black text-[#1E293B] mt-1">
                  {formatRupiah(activeFinancialSummary.totalSaldoBank)}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-4 border-t border-[#F1F5F9] mt-3 flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-medium">
                {activeFinancialSummary.saldoSubtitle}
              </span>
              <span className="font-bold text-blue-700">BNI Terkonsolidasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION: LAPORAN FAVORIT / LAPORAN CEPAT */}
      <div id="laporan-cepat-section" className="space-y-3">
        <h2 className="text-base font-bold text-[#1E293B]">Laporan Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            id="quick-btn-laporan-bulanan"
            onClick={() => setSelectedReportType('bulanan')}
            className="p-4 bg-white hover:bg-emerald-50/40 rounded-xl border border-[#E2E8F0] hover:border-[#064E3B] text-left transition-all shadow-xs group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold group-hover:scale-105 transition">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E293B] group-hover:text-[#064E3B] transition">
                  1. Laporan Keuangan Bulan Ini
                </div>
                <div className="text-[11px] text-[#64748B]">Agustus 2026 • Lengkap</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#064E3B] transition" />
          </button>

          <button
            type="button"
            id="quick-btn-laporan-tunggakan"
            onClick={() => setSelectedReportType('tunggakan')}
            className="p-4 bg-white hover:bg-red-50/40 rounded-xl border border-[#E2E8F0] hover:border-red-500 text-left transition-all shadow-xs group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E293B] group-hover:text-red-700 transition">
                  2. Laporan Tunggakan Santri
                </div>
                <div className="text-[11px] text-[#64748B]">45 Santri • Rp78.500.000</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-red-700 transition" />
          </button>

          <button
            type="button"
            id="quick-btn-laporan-pengeluaran"
            onClick={() => setSelectedReportType('pengeluaran')}
            className="p-4 bg-white hover:bg-amber-50/40 rounded-xl border border-[#E2E8F0] hover:border-amber-500 text-left transition-all shadow-xs group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E293B] group-hover:text-amber-700 transition">
                  3. Laporan Pengeluaran Bulan Ini
                </div>
                <div className="text-[11px] text-[#64748B]">Rp185.750.000 • 8 Pos</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-amber-700 transition" />
          </button>

          <button
            type="button"
            id="quick-btn-posisi-saldo"
            onClick={() => setSelectedReportType('rekening_bank')}
            className="p-4 bg-white hover:bg-blue-50/40 rounded-xl border border-[#E2E8F0] hover:border-blue-500 text-left transition-all shadow-xs group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E293B] group-hover:text-blue-700 transition">
                  4. Posisi Saldo Rekening
                </div>
                <div className="text-[11px] text-[#64748B]">Rp875.450.000 • 2 Rekening</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-blue-700 transition" />
          </button>
        </div>
      </div>

      {/* 4. REPORT CATEGORY SECTION (12 DISTINCT REPORT CARDS) */}
      <div id="jenis-laporan-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">Jenis Laporan</h2>
            <p className="text-xs text-[#64748B]">
              Akses 12 kategori laporan keuangan pesantren yang terhubung langsung ke database
            </p>
          </div>
          <span className="text-xs font-semibold text-[#064E3B] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            12 Modul Laporan Aktif
          </span>
        </div>

        {/* 12 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reportCardsCatalog.map((card) => (
            <div
              key={card.id}
              id={`report-card-${card.id}`}
              className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#064E3B] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] group-hover:bg-[#064E3B] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    {renderCardIcon(card.iconName)}
                  </div>
                  {card.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                      {card.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-[#1E293B] group-hover:text-[#064E3B] transition-colors mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-[#64748B] mb-3 leading-relaxed">{card.description}</p>

                {/* Data Included or Metrics */}
                {card.dataIncluded && (
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                      Data Tercakup:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {card.dataIncluded.slice(0, 4).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#F8FAFC] text-[10px] font-medium text-[#475569] border border-[#E2E8F0]"
                        >
                          {item}
                        </span>
                      ))}
                      {card.dataIncluded.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-[#94A3B8] font-medium">
                          +{card.dataIncluded.length - 4} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {card.showMetrics && (
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                      Indikator Utama:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {card.showMetrics.slice(0, 3).map((metric, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-[#F8FAFC] text-[10px] font-medium text-[#475569] border border-[#E2E8F0]"
                        >
                          {metric}
                        </span>
                      ))}
                      {card.showMetrics.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-[#94A3B8] font-medium">
                          +{card.showMetrics.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {card.options && (
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                      Kategori Pilihan:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {card.options.map((opt, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-emerald-50/60 text-[10px] font-semibold text-[#064E3B] border border-emerald-200"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                id={`btn-view-${card.id}`}
                onClick={() => {
                  if (card.id === 'harian') {
                    handleQuickPeriodSelect('hari_ini');
                  } else if (card.id === 'bulanan') {
                    handleQuickPeriodSelect('bulan_ini');
                  } else if (card.id === 'semester') {
                    handleQuickPeriodSelect('semester_ini');
                  } else if (card.id === 'tahunan') {
                    handleQuickPeriodSelect('tahun_ini');
                  }
                  setSelectedReportType(card.id);
                }}
                className="w-full mt-3 py-2 px-3 rounded-xl bg-[#F8FAFC] group-hover:bg-[#064E3B] text-[#334155] group-hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <span>Lihat Laporan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SECTION: LAPORAN TERAKHIR DIBUAT (RECENT REPORTS AUDIT) */}
      <div
        id="recent-reports-section"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">Laporan Terakhir Dibuat</h2>
            <p className="text-xs text-[#64748B]">
              Arsip riwayat dokumen laporan yang telah di-generate oleh sistem
            </p>
          </div>
          <button
            type="button"
            id="btn-quick-export-all"
            onClick={() => handleOpenExport('Laporan Keuangan Bulanan')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#064E3B] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Laporan Baru
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                <th className="py-3 px-4 font-bold">Jenis Laporan</th>
                <th className="py-3 px-4 font-bold">Periode</th>
                <th className="py-3 px-4 font-bold">Dibuat Oleh</th>
                <th className="py-3 px-4 font-bold">Tanggal</th>
                <th className="py-3 px-4 font-bold text-center">Format</th>
                <th className="py-3 px-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {recentReports.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4 font-bold text-[#1E293B]">
                    {rec.reportName}
                    <div className="text-[10px] text-[#94A3B8] font-mono">{rec.id}</div>
                  </td>
                  <td className="py-3 px-4 text-[#475569] font-medium">{rec.period}</td>
                  <td className="py-3 px-4 font-medium text-[#1E293B]">
                    {rec.generatedBy}
                    <div className="text-[10px] text-[#94A3B8]">{rec.role}</div>
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">{rec.generatedDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                        rec.fileFormat === 'PDF'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {rec.fileFormat}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        id={`btn-open-recent-${rec.id}`}
                        onClick={() => setSelectedReportType(rec.reportType)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#064E3B] hover:bg-emerald-50 rounded-md transition"
                      >
                        Buka
                      </button>
                      <button
                        type="button"
                        id={`btn-download-recent-${rec.id}`}
                        onClick={() => {
                          const cleanName = rec.reportName.toLowerCase().replace(/\s+/g, '_');
                          if (rec.fileFormat === 'Excel') {
                            downloadExcelSpreadsheet(`${cleanName}.xls`, {
                              title: rec.reportName.toUpperCase(),
                              subtitle: `Periode: ${rec.period} • SIMKEU PM. Raudhatussalam Mahato`,
                              headers: ['No', 'Komponen Pos Laporan', 'Nominal Anggaran', 'Realisasi', 'Keterangan'],
                              rows: [
                                [1, 'Penerimaan SPP Santri', 'Rp 280.000.000', 'Rp 262.000.000', '93.5% Terealisasi'],
                                [2, 'Infaq & Wakaf Operasional', 'Rp 45.000.000', 'Rp 51.200.000', '113.8% Surplus'],
                                [3, 'Belanja Dapur Santri', 'Rp 120.000.000', 'Rp 114.500.000', 'Terkendali'],
                                [4, 'Honor Asatidz & Karyawan', 'Rp 85.000.000', 'Rp 85.000.000', '100% Sesuai Pos'],
                              ],
                              summary: [{ label: 'Total Saldo Kas Tersedia', value: 'Rp 250.750.000' }]
                            });
                          } else {
                            downloadPrintableReport(
                              `${cleanName}.html`,
                              rec.reportName,
                              `<h2>${rec.reportName}</h2><p>Periode: ${rec.period}</p><p>Status: Dokumen Resmi Terverifikasi</p>`
                            );
                          }
                          showToast(`Berkas ${rec.reportName} (${rec.fileFormat}) berhasil diunduh ke perangkat Anda.`);
                        }}
                        className="p-1.5 text-[#64748B] hover:text-[#064E3B] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer"
                        title="Unduh Berkas ke Komputer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. SINGLE SOURCE OF TRUTH & AUDIT COMPLIANCE BANNER */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-[#064E3B]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Prinsip Integritas Pelaporan Keuangan (Single Source of Truth):</span>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Seluruh laporan keuangan terhubung secara otomatis ke database transaksi SIMKEU (Santri, Tagihan, Pembayaran, Pengeluaran & Rekening BNI) tanpa input manual Excel.
            </p>
          </div>
        </div>
        <div className="font-mono text-[11px] bg-white px-3 py-1.5 rounded-lg border border-emerald-300 font-bold text-center">
          Saldo Awal + Net Cash Flow = Saldo Akhir
        </div>
      </div>

      {/* Modals */}
      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        reportTitle={exportModalReportTitle}
        periodText={`${filterState.startDate} - ${filterState.endDate}`}
        periodType={filterState.periodType}
        defaultFormat={exportModalDefaultFormat}
        onExportSuccess={handleExportSuccess}
      />

      <PrintReportModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        reportTitle={printModalReportTitle}
        periodText={`${filterState.startDate} - ${filterState.endDate}`}
        periodType={filterState.periodType}
      />

      {/* Global Toast */}
      {toastMessage && (
        <div
          id="laporan-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#1E293B] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up text-xs font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
