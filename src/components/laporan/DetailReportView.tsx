import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building,
  Users,
  AlertCircle,
  FileSpreadsheet,
  PieChart,
  PieChart as PieChartIcon,
  Receipt,
  ShieldAlert,
  Search,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  BookOpen,
  Wallet,
  ShieldCheck,
  Filter,
  Landmark,
  CreditCard,
  FileText,
} from 'lucide-react';
import {
  ReportCategoryType,
  ReportPeriodType,
  UnitType,
  ReportFilterState,
} from '../../types';
import { formatRupiah, formatNumber, initialTransactions } from '../../data/initialData';
import { PrintCashBookModal } from '../common/PrintCashBookModal';
import {
  reportExecutiveSummary,
  initialIncomeBreakdown,
  initialExpenseBreakdown,
  initialMonthlyComparison,
  initialDailyCashFlowTrend,
  arrearsSummaryStats,
  initialArrearsReportTable,
  studentPaymentReportStats,
  bankPositionReports,
  dailyReportSummary,
  dailyTransactionJournal,
  unitFinancialReports,
  semesterGanjilReport,
  semesterGenapReport,
  annualReportTable,
  initialAuditTransactionLogs,
  reportCardsCatalog,
  getFinancialSummary,
  getIncomeBreakdown,
  getExpenseBreakdown,
  sampleExpenseDetailRecords,
} from '../../data/reportData';

interface DetailReportViewProps {
  reportType: ReportCategoryType;
  onBackToHub: () => void;
  onSelectReportType: (type: ReportCategoryType) => void;
  onOpenExportModal: (reportTitle: string, defaultFormat?: 'PDF' | 'Excel') => void;
  onOpenPrintModal: (reportTitle: string) => void;
  onShowToast: (msg: string) => void;
  filterState: ReportFilterState;
  onUpdateFilter: (filter: Partial<ReportFilterState>) => void;
}

export const DetailReportView: React.FC<DetailReportViewProps> = ({
  reportType,
  onBackToHub,
  onSelectReportType,
  onOpenExportModal,
  onOpenPrintModal,
  onShowToast,
  filterState,
  onUpdateFilter,
}) => {
  const [tableSearch, setTableSearch] = useState('');
  const [selectedSemesterTab, setSelectedSemesterTab] = useState<'ganjil' | 'genap'>('ganjil');
  const [selectedUnitSubFilter, setSelectedUnitSubFilter] = useState<string>('Semua');
  const [isBkuPrintModalOpen, setIsBkuPrintModalOpen] = useState(false);
  const [bkuAccountFilter, setBkuAccountFilter] = useState('Semua Rekening');
  const [bkuTypeFilter, setBkuTypeFilter] = useState<'Semua' | 'Pemasukan' | 'Pengeluaran'>('Semua');
  const [expenseViewTab, setExpenseViewTab] = useState<'pos' | 'transaksi'>('pos');
  const [expenseSourceFilter, setExpenseSourceFilter] = useState<string>('SEMUA');

  const currentMeta =
    reportCardsCatalog.find((r) => r.id === reportType) || reportCardsCatalog[3]; // default bulanan

  // Dynamic Financial Summary & Breakdowns for the selected period
  const currentFinancialSummary = getFinancialSummary(filterState.periodType);
  const activeIncomeBreakdown = useMemo(
    () => getIncomeBreakdown(filterState.periodType),
    [filterState.periodType]
  );
  const activeExpenseBreakdown = useMemo(
    () => getExpenseBreakdown(filterState.periodType),
    [filterState.periodType]
  );

  const periodLabel = `${filterState.startDate} - ${filterState.endDate}`;

  // Filter helpers
  const cleanSearch = (tableSearch || '').toLowerCase();

  // Quick Period Handler
  const handleQuickPeriodChange = (type: ReportPeriodType) => {
    const meta = getFinancialSummary(type);
    let sDate = filterState.startDate;
    let eDate = filterState.endDate;
    if (type === 'hari_ini') {
      sDate = '01 September 2026';
      eDate = '01 September 2026';
    } else if (type === 'minggu_ini') {
      sDate = '26 Agustus 2026';
      eDate = '01 September 2026';
    } else if (type === 'bulan_ini') {
      sDate = '01 Agustus 2026';
      eDate = '31 Agustus 2026';
    } else if (type === 'semester_ini') {
      sDate = '01 Juli 2026';
      eDate = '31 Desember 2026';
    } else if (type === 'tahun_ini') {
      sDate = '01 Juli 2026';
      eDate = '30 Juni 2027';
    }
    onUpdateFilter({
      periodType: type,
      startDate: sDate,
      endDate: eDate,
    });
    onShowToast(`Periode laporan diubah: ${meta.periodTypeLabel}`);
  };

  // BKU Calculations
  const isDailyPeriod = filterState.periodType === 'hari_ini';
  const bkuInitialBalance = isDailyPeriod ? 875450000 : 145200000;

  // Transactions list adjusted for period
  const activeBkuSourceTransactions = useMemo(() => {
    if (isDailyPeriod) {
      return [
        {
          id: 'TRX-20260901-001',
          tanggal: '01/09/2026',
          keterangan: 'SPP & Uang Makan (M. Rizky - 2026001)',
          santri: 'M. Rizky Pratama',
          kategori: 'SPP & Konsumsi',
          nominal: 850000,
          jenis: 'Pemasukan' as const,
          metode: 'Tunai Kasir',
          rekening: 'Kas Tunai Bendahara',
          operator: 'Ustadz Ahmad Fauzi',
        },
        {
          id: 'TRX-20260901-002',
          tanggal: '01/09/2026',
          keterangan: 'Tagihan Tahunan (Fatimah - 2026009)',
          santri: 'Fatimah Az-Zahra',
          kategori: 'Pembangunan Santri',
          nominal: 1700000,
          jenis: 'Pemasukan' as const,
          metode: 'Tunai Kasir',
          rekening: 'Kas Tunai Bendahara',
          operator: 'Ustadz Ahmad Fauzi',
        },
        {
          id: 'TRX-20260901-003',
          tanggal: '01/09/2026',
          keterangan: 'Belanja Dapur Harian (Beras, Sayur, Minyak)',
          santri: '-',
          kategori: 'Belanja Dapur',
          nominal: 2450000,
          jenis: 'Pengeluaran' as const,
          metode: 'Tunai',
          rekening: 'Kas Tunai Bendahara',
          operator: 'Hj. Siti Aminah',
        },
        {
          id: 'TRX-20260901-004',
          tanggal: '01/09/2026',
          keterangan: 'SPP 3 Santri MA via Transfer Bank BNI',
          santri: 'Ahmad, Zaid, Umar',
          kategori: 'SPP Santri MA',
          nominal: 2200000,
          jenis: 'Pemasukan' as const,
          metode: 'Transfer BNI',
          rekening: 'BNI Operasional Pesantren',
          operator: 'Sistem Payment Gateway',
        },
      ];
    }
    return initialTransactions;
  }, [isDailyPeriod]);

  const bkuFilteredTransactions = useMemo(() => {
    return activeBkuSourceTransactions.filter((trx) => {
      const matchAccount =
        bkuAccountFilter === 'Semua Rekening' ||
        (trx.rekening && trx.rekening.toLowerCase().includes(bkuAccountFilter.toLowerCase())) ||
        (bkuAccountFilter.includes('Tunai') && (!trx.rekening || trx.rekening.toLowerCase().includes('kas')));
      const matchType = bkuTypeFilter === 'Semua' || trx.jenis === bkuTypeFilter;
      const matchSearch =
        !cleanSearch ||
        trx.keterangan.toLowerCase().includes(cleanSearch) ||
        (trx.santri && trx.santri.toLowerCase().includes(cleanSearch)) ||
        trx.id.toLowerCase().includes(cleanSearch);
      return matchAccount && matchType && matchSearch;
    });
  }, [activeBkuSourceTransactions, bkuAccountFilter, bkuTypeFilter, cleanSearch]);

  const bkuTransactionsWithBalance = useMemo(() => {
    let running = bkuInitialBalance;
    return bkuFilteredTransactions.map((trx) => {
      if (trx.jenis === 'Pemasukan') {
        running += trx.nominal;
      } else {
        running -= trx.nominal;
      }
      return {
        ...trx,
        runningBalance: running,
      };
    });
  }, [bkuFilteredTransactions, bkuInitialBalance]);

  const bkuTotalDebit = useMemo(() => {
    return bkuFilteredTransactions
      .filter((t) => t.jenis === 'Pemasukan')
      .reduce((acc, curr) => acc + curr.nominal, 0);
  }, [bkuFilteredTransactions]);

  const bkuTotalKredit = useMemo(() => {
    return bkuFilteredTransactions
      .filter((t) => t.jenis === 'Pengeluaran')
      .reduce((acc, curr) => acc + curr.nominal, 0);
  }, [bkuFilteredTransactions]);

  const bkuEndingBalance = bkuInitialBalance + bkuTotalDebit - bkuTotalKredit;

  const filteredArrears = initialArrearsReportTable.filter(
    (item) =>
      (item.namaSantri || '').toLowerCase().includes(cleanSearch) ||
      (item.nis || '').includes(tableSearch || '') ||
      (item.kelas || '').toLowerCase().includes(cleanSearch)
  );

  const availableExpenseSources = useMemo(() => {
    const set = new Set<string>();
    activeExpenseBreakdown.forEach((item) => {
      if (item.sumberKeuangan) set.add(item.sumberKeuangan);
    });
    sampleExpenseDetailRecords.forEach((item) => {
      if (item.sumberKeuangan) set.add(item.sumberKeuangan);
    });
    return Array.from(set);
  }, [activeExpenseBreakdown]);

  const filteredExpenses = activeExpenseBreakdown.filter((item) => {
    const matchSearch =
      (item.category || '').toLowerCase().includes(cleanSearch) ||
      (item.unit || '').toLowerCase().includes(cleanSearch) ||
      (item.sumberKeuangan || '').toLowerCase().includes(cleanSearch) ||
      (item.akunKas || '').toLowerCase().includes(cleanSearch);
    const matchSource =
      expenseSourceFilter === 'SEMUA' || item.sumberKeuangan === expenseSourceFilter;
    return matchSearch && matchSource;
  });

  const filteredExpenseTransactions = sampleExpenseDetailRecords.filter((rec) => {
    const matchSearch =
      (rec.keterangan || '').toLowerCase().includes(cleanSearch) ||
      (rec.noBukti || '').toLowerCase().includes(cleanSearch) ||
      (rec.kategori || '').toLowerCase().includes(cleanSearch) ||
      (rec.sumberKeuangan || '').toLowerCase().includes(cleanSearch) ||
      (rec.akunKas || '').toLowerCase().includes(cleanSearch) ||
      (rec.penerima || '').toLowerCase().includes(cleanSearch) ||
      (rec.unit || '').toLowerCase().includes(cleanSearch);
    const matchSource =
      expenseSourceFilter === 'SEMUA' || rec.sumberKeuangan === expenseSourceFilter;
    return matchSearch && matchSource;
  });

  const expenseSourceDistribution = useMemo(() => {
    const map = new Map<string, { total: number; count: number; akunKas: string; unit: string }>();
    activeExpenseBreakdown.forEach((item) => {
      const src = item.sumberKeuangan || 'Kas Operasional Pesantren';
      const existing = map.get(src) || {
        total: 0,
        count: 0,
        akunKas: item.akunKas || 'BNI Rekening 1',
        unit: item.unit,
      };
      map.set(src, {
        total: existing.total + item.totalNominal,
        count: existing.count + item.transactionCount,
        akunKas: item.akunKas || existing.akunKas,
        unit: existing.unit,
      });
    });
    const grandTotal = Array.from(map.values()).reduce((sum, x) => sum + x.total, 0);
    return Array.from(map.entries()).map(([source, data]) => ({
      source,
      total: data.total,
      count: data.count,
      akunKas: data.akunKas,
      unit: data.unit,
      percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
    }));
  }, [activeExpenseBreakdown]);

  const filteredIncome = activeIncomeBreakdown.filter(
    (item) =>
      (item.source || '').toLowerCase().includes(cleanSearch) ||
      (item.unit || '').toLowerCase().includes(cleanSearch)
  );

  const filteredDaily = dailyTransactionJournal.filter(
    (item) =>
      (item.description || '').toLowerCase().includes(cleanSearch) ||
      (item.transactionNo || '').toLowerCase().includes(cleanSearch)
  );

  const totalIncomeAmount = filteredIncome.reduce((sum, item) => sum + item.totalNominal, 0);
  const totalIncomeTransactions = filteredIncome.reduce((sum, item) => sum + item.transactionCount, 0);
  const avgIncomePerTrx = totalIncomeTransactions > 0 ? Math.round(totalIncomeAmount / totalIncomeTransactions) : 0;
  const topIncomeSource = filteredIncome.length > 0
    ? [...filteredIncome].sort((a, b) => b.totalNominal - a.totalNominal)[0]
    : null;

  const totalExpenseAmount = filteredExpenses.reduce((sum, item) => sum + item.totalNominal, 0);
  const totalExpenseTransactions = filteredExpenses.reduce((sum, item) => sum + item.transactionCount, 0);
  const avgExpensePerTrx = totalExpenseTransactions > 0 ? Math.round(totalExpenseAmount / totalExpenseTransactions) : 0;
  const topExpenseCategory = filteredExpenses.length > 0
    ? [...filteredExpenses].sort((a, b) => b.totalNominal - a.totalNominal)[0]
    : null;

  return (
    <div id="detail-report-container" className="space-y-6 animate-fade-in">
      {/* 1. TOP INSTITUTIONAL REPORT HEADER */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#F1F5F9] pb-5">
          {/* Left: Back button & Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B] mb-2">
              <button
                type="button"
                id="btn-back-to-hub"
                onClick={onBackToHub}
                className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#064E3B] hover:underline transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Pusat Laporan
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
              <span className="font-bold text-[#064E3B]">{currentMeta.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black text-[#1E293B] tracking-tight">
                {currentMeta.title.toUpperCase()}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#064E3B] border border-emerald-200">
                {filterState.academicYear}
              </span>
            </div>

            <p className="text-xs text-[#64748B] max-w-2xl">{currentMeta.description}</p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-report-print"
              onClick={() => {
                if (reportType === 'buku_kas_umum') {
                  setIsBkuPrintModalOpen(true);
                } else {
                  onOpenPrintModal(currentMeta.title);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#334155] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl transition shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#64748B]" />
              Print
            </button>

            <button
              type="button"
              id="btn-report-export-pdf"
              onClick={() => onOpenExportModal(currentMeta.title, 'PDF')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100/70 border border-red-200 rounded-xl transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </button>

            <button
              type="button"
              id="btn-report-export-excel"
              onClick={() => onOpenExportModal(currentMeta.title, 'Excel')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-xl transition shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Excel
            </button>

            <button
              type="button"
              id="btn-report-share"
              onClick={() => {
                onShowToast('Tautan laporan resmi berhasil disalin ke clipboard');
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#064E3B] bg-emerald-600/10 hover:bg-emerald-600/20 rounded-xl transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>

        {/* Metadata validation bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[#64748B]">Periode Laporan:</span>
            <span className="font-bold text-[#1E293B] bg-[#F1F5F9] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
              {periodLabel} ({currentFinancialSummary.periodTypeLabel})
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#64748B]">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status: {currentFinancialSummary.statusData}</span>
            </div>
            <span>•</span>
            <span>Terakhir Diperbarui: {currentFinancialSummary.lastUpdated}</span>
            <span>•</span>
            <span>Dibuat Oleh: {currentFinancialSummary.verifiedBy}</span>
          </div>
        </div>
      </div>

      {/* QUICK PERIOD SELECTOR */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#064E3B]" />
          <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Pilih Periode:
          </span>
          <span className="text-xs font-bold text-[#064E3B] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            {currentFinancialSummary.periodTypeLabel}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'hari_ini' as const, label: 'Hari Ini (Harian)' },
            { id: 'minggu_ini' as const, label: 'Minggu Ini' },
            { id: 'bulan_ini' as const, label: 'Bulan Ini (Bulanan)' },
            { id: 'semester_ini' as const, label: 'Semester Ganjil' },
            { id: 'tahun_ini' as const, label: 'Tahun Ajaran 26/27' },
          ].map((opt) => (
            <button
              key={opt.id}
              id={`btn-period-${opt.id}`}
              type="button"
              onClick={() => handleQuickPeriodChange(opt.id)}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
                filterState.periodType === opt.id
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. REPORT SWITCHER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-xs font-bold text-[#64748B] flex-shrink-0 mr-1 uppercase tracking-wider">
          Ganti Laporan:
        </span>
        {reportCardsCatalog.map((cat) => (
          <button
            key={cat.id}
            id={`chip-report-${cat.id}`}
            onClick={() => {
              if (cat.id === 'harian' && filterState.periodType !== 'hari_ini') {
                handleQuickPeriodChange('hari_ini');
              } else if (cat.id === 'bulanan' && filterState.periodType !== 'bulan_ini') {
                handleQuickPeriodChange('bulan_ini');
              } else if (cat.id === 'semester' && filterState.periodType !== 'semester_ini') {
                handleQuickPeriodChange('semester_ini');
              } else if (cat.id === 'tahunan' && filterState.periodType !== 'tahun_ini') {
                handleQuickPeriodChange('tahun_ini');
              }
              onSelectReportType(cat.id);
            }}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold flex-shrink-0 transition-all ${
              reportType === cat.id
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* 3A. KHUSUS LAPORAN PEMASUKAN: RINGKASAN PENERIMAAN SAJA (TANPA PENGELUARAN) */}
      {reportType === 'pemasukan' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#064E3B]" />
              Ringkasan Kinerja Penerimaan (Pemasukan Kas & Bank)
            </h2>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Periode: {currentFinancialSummary.periodTypeLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Pemasukan */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                  <span>TOTAL PENERIMAAN</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                </span>
                <div className="text-lg md:text-xl font-black text-emerald-900 mt-1">
                  {formatRupiah(totalIncomeAmount)}
                </div>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-2">
                {currentFinancialSummary.pemasukanTrend}
              </div>
            </div>

            {/* Total Transaksi Penerimaan */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-between">
                  <span>VOLUME TRANSAKSI</span>
                  <Receipt className="w-4 h-4 text-[#064E3B]" />
                </span>
                <div className="text-lg md:text-xl font-bold text-[#1E293B] mt-1">
                  {formatNumber(totalIncomeTransactions)} Transaksi
                </div>
              </div>
              <div className="text-[10px] text-[#64748B] mt-2">Penerimaan kasir & auto-debet bank</div>
            </div>

            {/* Rata-rata per Transaksi */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-between">
                  <span>RATA-RATA / TRANSAKSI</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </span>
                <div className="text-lg md:text-xl font-bold text-[#1E293B] mt-1">
                  {formatRupiah(avgIncomePerTrx)}
                </div>
              </div>
              <div className="text-[10px] text-[#64748B] mt-2">Rata-rata nominal per kuitansi</div>
            </div>

            {/* Pos Penerimaan Terbesar */}
            <div className="p-4 rounded-xl bg-[#064E3B] text-white flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider flex items-center justify-between">
                  <span>SUMBER TERBESAR</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                </span>
                <div className="text-base md:text-lg font-black text-white mt-1 truncate">
                  {topIncomeSource ? topIncomeSource.source : 'SPP Santri'}
                </div>
              </div>
              <div className="text-[10px] text-emerald-100 font-medium mt-2">
                Kontribusi: {topIncomeSource ? `${topIncomeSource.percentage.toFixed(1)}% (${formatRupiah(topIncomeSource.totalNominal)})` : '-'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3B. KHUSUS LAPORAN PENGELUARAN: RINGKASAN REALISASI BELANJA SAJA (TANPA PEMASUKAN) */}
      {reportType === 'pengeluaran' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-600" />
              Ringkasan Realisasi Beban & Pengeluaran
            </h2>
            <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Periode: {currentFinancialSummary.periodTypeLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Pengeluaran */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
                  <span>TOTAL REALISASI BELANJA</span>
                  <ArrowDownRight className="w-4 h-4 text-amber-600" />
                </span>
                <div className="text-lg md:text-xl font-black text-amber-900 mt-1">
                  {formatRupiah(totalExpenseAmount)}
                </div>
              </div>
              <div className="text-[10px] text-amber-700 font-medium mt-2">
                {currentFinancialSummary.pengeluaranTrend}
              </div>
            </div>

            {/* Total Transaksi Keluar */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-between">
                  <span>VOLUME TRANSAKSI</span>
                  <Receipt className="w-4 h-4 text-amber-700" />
                </span>
                <div className="text-lg md:text-xl font-bold text-[#1E293B] mt-1">
                  {formatNumber(totalExpenseTransactions)} Transaksi
                </div>
              </div>
              <div className="text-[10px] text-[#64748B] mt-2">Nota, kuitansi & SPJ terverifikasi</div>
            </div>

            {/* Rata-rata Pengeluaran */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center justify-between">
                  <span>RATA-RATA / TRANSAKSI</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </span>
                <div className="text-lg md:text-xl font-bold text-[#1E293B] mt-1">
                  {formatRupiah(avgExpensePerTrx)}
                </div>
              </div>
              <div className="text-[10px] text-[#64748B] mt-2">Rata-rata nominal per pengeluaran</div>
            </div>

            {/* Pos Pengeluaran Terbesar */}
            <div className="p-4 rounded-xl bg-amber-900 text-white flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider flex items-center justify-between">
                  <span>BEBAN ANGGARAN TERBESAR</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                </span>
                <div className="text-base md:text-lg font-black text-white mt-1 truncate">
                  {topExpenseCategory ? topExpenseCategory.category : 'Dapur & Konsumsi'}
                </div>
              </div>
              <div className="text-[10px] text-amber-100 font-medium mt-2">
                Porsi: {topExpenseCategory ? `${topExpenseCategory.percentage.toFixed(1)}% (${formatRupiah(topExpenseCategory.totalNominal)})` : '-'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3C. FINANCIAL STATEMENT FORMULA SUMMARY (KHUSUS BKU, BULANAN, ARUS KAS, REKENING) */}
      {(reportType === 'buku_kas_umum' ||
        reportType === 'bulanan' ||
        reportType === 'arus_kas' ||
        reportType === 'rekening_bank') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#064E3B]" />
              Ringkasan Posisi Keuangan (Formula Arus Kas)
            </h2>
            <span className="text-xs text-[#64748B]">Saldo Awal + Masuk - Keluar = Saldo Akhir</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Saldo Awal */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  SALDO AWAL ({currentFinancialSummary.periodLabel.split(' - ')[0]})
                </span>
                <div className="text-lg md:text-xl font-bold text-[#1E293B] mt-1">
                  {formatRupiah(currentFinancialSummary.saldoAwal)}
                </div>
              </div>
              <div className="text-[10px] text-[#64748B] mt-2">Akumulasi saldo kas & bank</div>
            </div>

            {/* Total Pemasukan */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                  <span>(+) TOTAL PEMASUKAN</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                </span>
                <div className="text-lg md:text-xl font-extrabold text-emerald-800 mt-1">
                  {formatRupiah(currentFinancialSummary.totalPemasukan)}
                </div>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-2">
                {currentFinancialSummary.pemasukanTrend}
              </div>
            </div>

            {/* Total Pengeluaran */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
                  <span>(-) TOTAL PENGELUARAN</span>
                  <ArrowDownRight className="w-4 h-4 text-amber-600" />
                </span>
                <div className="text-lg md:text-xl font-extrabold text-amber-800 mt-1">
                  {formatRupiah(currentFinancialSummary.totalPengeluaran)}
                </div>
              </div>
              <div className="text-[10px] text-amber-700 font-medium mt-2">
                {currentFinancialSummary.pengeluaranTrend}
              </div>
            </div>

            {/* Saldo Akhir */}
            <div className="p-4 rounded-xl bg-[#064E3B] text-white flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider flex items-center justify-between">
                  <span>(=) SALDO AKHIR</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                </span>
                <div className="text-lg md:text-xl font-black text-white mt-1">
                  {formatRupiah(currentFinancialSummary.saldoAkhir)}
                </div>
              </div>
              <div className="text-[10px] text-emerald-100 font-medium mt-2">
                Surplus Bersih: {formatRupiah(currentFinancialSummary.surplusPeriode)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DYNAMIC REPORT CONTENT PER CATEGORY */}

      {/* =========================================================================
          CASE 0: BUKU KAS UMUM (BKU) - STANDAR JURNAL KAS & BUKTI CETAK
          ========================================================================= */}
      {reportType === 'buku_kas_umum' && (
        <div className="space-y-6">
          {/* Action and Filter Ribbon */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#064E3B]" />
                Filter Rekening:
              </span>
              {['Semua Rekening', 'Kas Tunai', 'BNI Operasional', 'Mandiri Tagihan'].map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => setBkuAccountFilter(acc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    bkuAccountFilter === acc
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {acc}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
                {(['Semua', 'Pemasukan', 'Pengeluaran'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBkuTypeFilter(type)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                      bkuTypeFilter === type
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Primary Print BKU Trigger */}
              <button
                type="button"
                id="btn-print-buku-kas-banner"
                onClick={() => setIsBkuPrintModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#064E3B] hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-200" />
                <span>Cetak / Unduh BKU Resmi</span>
              </button>
            </div>
          </div>

          {/* Buku Kas Table Container */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wide">
                    Buku Kas Umum (BKU) — Mutasi & Saldo Berjalan
                  </h3>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-[#064E3B] px-2 py-0.5 rounded">
                    {bkuFilteredTransactions.length} Baris Data
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Rekapitulasi pembukuan kas masuk, kas keluar, dan saldo kumulatif secara kronologis
                </p>
              </div>

              <div className="text-xs text-right font-medium text-slate-500">
                Saldo Awal: <strong className="text-slate-800">{formatRupiah(bkuInitialBalance)}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F1F5F9] text-[#475569] font-bold border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">No</th>
                    <th className="py-3 px-3.5">Tanggal</th>
                    <th className="py-3 px-3.5">No. Bukti / Ref</th>
                    <th className="py-3 px-4">Uraian & Keterangan</th>
                    <th className="py-3 px-3.5">Kategori / Akun</th>
                    <th className="py-3 px-3.5 text-right text-[#064E3B]">Penerimaan (Debit)</th>
                    <th className="py-3 px-3.5 text-right text-rose-700">Pengeluaran (Kredit)</th>
                    <th className="py-3 px-4 text-right text-slate-900 bg-slate-100/70">Saldo Berjalan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {/* Saldo Awal Row */}
                  <tr className="bg-amber-50/40 font-semibold">
                    <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                    <td className="py-2.5 px-3.5 text-slate-600">01/08/2026</td>
                    <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-500">SALDO-AWAL</td>
                    <td className="py-2.5 px-4 text-slate-900">Saldo Kas Awal Periode Agustus 2026</td>
                    <td className="py-2.5 px-3.5 text-slate-500">Kas Pesantren</td>
                    <td className="py-2.5 px-3.5 text-right text-slate-400">-</td>
                    <td className="py-2.5 px-3.5 text-right text-slate-400">-</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900 bg-slate-100/50">
                      {formatRupiah(bkuInitialBalance)}
                    </td>
                  </tr>

                  {bkuTransactionsWithBalance.map((trx, idx) => (
                    <tr key={trx.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-medium text-slate-700 whitespace-nowrap">{trx.tanggal}</td>
                      <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600">
                        {trx.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{trx.keterangan}</div>
                        {trx.santri && (
                          <div className="text-[11px] text-slate-500">Santri: {trx.santri}</div>
                        )}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                          {trx.kategori}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{trx.rekening || 'Kas Tunai'}</div>
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-[#064E3B]">
                        {trx.jenis === 'Pemasukan' ? formatRupiah(trx.nominal) : '-'}
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-rose-600">
                        {trx.jenis === 'Pengeluaran' ? formatRupiah(trx.nominal) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-900 bg-slate-50/70">
                        {formatRupiah(trx.runningBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F8FAFC] font-bold text-xs border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={5} className="py-3.5 px-4 text-right text-slate-700 uppercase">
                      Total Mutasi & Saldo Akhir Kas:
                    </td>
                    <td className="py-3.5 px-3.5 text-right text-[#064E3B]">
                      {formatRupiah(bkuTotalDebit)}
                    </td>
                    <td className="py-3.5 px-3.5 text-right text-rose-700">
                      {formatRupiah(bkuTotalKredit)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-sm font-black text-slate-900 bg-emerald-50 border-l border-emerald-200">
                      {formatRupiah(bkuEndingBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Posisi Kas Fisik & Bank Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-4 h-4 text-[#064E3B]" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Rekapitulasi Posisi Kas & Bank
                </h4>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">1. Kas Tunai di Brankas Bendahara</span>
                  <span className="font-bold text-slate-900">{formatRupiah(18750000)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">2. Saldo Rekening BNI Operasional (0234)</span>
                  <span className="font-bold text-slate-900">{formatRupiah(142500000)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">3. Saldo Rekening Mandiri Tagihan (1092)</span>
                  <span className="font-bold text-slate-900">{formatRupiah(84000000)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 font-bold text-emerald-900 bg-emerald-50/60 p-2.5 rounded-lg">
                  <span>Total Kas & Setara Kas:</span>
                  <span className="text-sm font-black text-[#064E3B]">{formatRupiah(245250000)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#064E3B]" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Pengesahan & Verifikasi Laporan
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buku Kas Umum ini telah ditutup pada akhir periode dengan saldo yang sesuai dengan fisik kas
                  dan rekening koran bank. Siap dicetak untuk pelaporan ke Pimpinan Pondok Modern.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  id="btn-print-bku-footer"
                  onClick={() => setIsBkuPrintModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#064E3B] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Buka Dialog Cetak & Ekspor BKU</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 1: LAPORAN BULANAN (DEFAULT FULL FINANCIAL REPORT)
          ========================================================================= */}
      {reportType === 'bulanan' && (
        <div className="space-y-6">
          {/* Tables: Rincian Pemasukan & Rincian Pengeluaran */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table 1: Rincian Pemasukan */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1E293B]">Rincian Pemasukan</h3>
                      <p className="text-[11px] text-[#64748B]">
                        {currentFinancialSummary.periodTypeLabel} • {activeIncomeBreakdown.length} Sumber Penerimaan
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#064E3B] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Total: {formatRupiah(currentFinancialSummary.totalPemasukan)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                        <th className="py-2.5 px-3 font-semibold">No</th>
                        <th className="py-2.5 px-3 font-semibold">Sumber Pemasukan</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Jumlah Trx</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Total Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {activeIncomeBreakdown.map((item) => (
                        <tr key={item.no} className="hover:bg-[#F8FAFC]/80 transition">
                          <td className="py-2.5 px-3 font-medium text-[#64748B]">{item.no}</td>
                          <td className="py-2.5 px-3 font-bold text-[#1E293B]">
                            {item.source}
                            <div className="text-[10px] text-[#94A3B8] font-normal">{item.unit}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center text-[#475569] font-medium">
                            {formatNumber(item.transactionCount)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                            {formatRupiah(item.totalNominal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#E2E8F0] bg-[#F8FAFC] font-extrabold text-[#1E293B]">
                        <td colSpan={3} className="py-3 px-3 uppercase tracking-wider text-right">
                          Total Pemasukan:
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-800 text-sm font-black">
                          {formatRupiah(currentFinancialSummary.totalPemasukan)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Table 2: Rincian Pengeluaran */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1E293B]">Rincian Pengeluaran</h3>
                      <p className="text-[11px] text-[#64748B]">
                        {currentFinancialSummary.periodTypeLabel} • {activeExpenseBreakdown.length} Pos Anggaran
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    Total: {formatRupiah(currentFinancialSummary.totalPengeluaran)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                        <th className="py-2.5 px-3 font-semibold">No</th>
                        <th className="py-2.5 px-3 font-semibold">Kategori</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Jumlah Trx</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Total Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {activeExpenseBreakdown.map((item) => (
                        <tr key={item.no} className="hover:bg-[#F8FAFC]/80 transition">
                          <td className="py-2 px-3 font-medium text-[#64748B]">{item.no}</td>
                          <td className="py-2 px-3 font-bold text-[#1E293B]">
                            {item.category}
                            <div className="text-[10px] text-[#94A3B8] font-normal">{item.unit}</div>
                          </td>
                          <td className="py-2 px-3 text-center text-[#475569] font-medium">
                            {formatNumber(item.transactionCount)}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-amber-700">
                            {formatRupiah(item.totalNominal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#E2E8F0] bg-[#F8FAFC] font-extrabold text-[#1E293B]">
                        <td colSpan={3} className="py-3 px-3 uppercase tracking-wider text-right">
                          Total Pengeluaran:
                        </td>
                        <td className="py-3 px-3 text-right text-amber-800 text-sm font-black">
                          {formatRupiah(currentFinancialSummary.totalPengeluaran)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Charts: Comparison & Cash Flow Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Perbandingan Pemasukan dan Pengeluaran (Juni, Juli, Agustus) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B]">
                    Perbandingan Pemasukan dan Pengeluaran
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Evaluasi komparatif bulan Juni, Juli, dan Agustus 2026
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5 font-medium text-[#064E3B]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#064E3B]" /> Pemasukan
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-amber-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pengeluaran
                  </span>
                </div>
              </div>

              {/* Bar Chart Visualizer */}
              <div className="space-y-4 pt-2">
                {initialMonthlyComparison.slice(0, 3).map((pt) => {
                  const maxVal = 400000000;
                  const inWidth = Math.round((pt.pemasukan / maxVal) * 100);
                  const outWidth = Math.round((pt.pengeluaran / maxVal) * 100);

                  return (
                    <div key={pt.month} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1E293B] mb-2">
                        <span>Bulan {pt.month} 2026</span>
                        <span className="text-emerald-700 font-extrabold">
                          Surplus: +{formatRupiah(pt.surplus)}
                        </span>
                      </div>

                      {/* Bar In */}
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#64748B]">Pemasukan</span>
                          <span className="font-bold text-[#064E3B]">{formatRupiah(pt.pemasukan)}</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#064E3B] h-full rounded-full transition-all duration-500"
                            style={{ width: `${inWidth}%` }}
                          />
                        </div>
                      </div>

                      {/* Bar Out */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#64748B]">Pengeluaran</span>
                          <span className="font-bold text-amber-700">{formatRupiah(pt.pengeluaran)}</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${outWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Tren Arus Keuangan (Daily / Multi-Period Trend) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B]">Tren Arus Keuangan</h3>
                  <p className="text-[11px] text-[#64748B]">
                    Progresi akumulasi saldo dan ritme arus kas harian
                  </p>
                </div>
                <span className="text-xs font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Konsisten Surplus
                </span>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#64748B] border-b border-[#E2E8F0] pb-2">
                  <span>Tanggal</span>
                  <span>Pemasukan</span>
                  <span>Pengeluaran</span>
                  <span>Saldo Berjalan</span>
                </div>
                <div className="space-y-2">
                  {initialDailyCashFlowTrend.map((row) => (
                    <div
                      key={row.date}
                      className="flex items-center justify-between text-xs py-1.5 hover:bg-white px-2 rounded-lg transition"
                    >
                      <span className="font-bold text-[#1E293B] w-16">{row.date}</span>
                      <span className="text-emerald-700 font-semibold w-24">
                        +{formatRupiah(row.pemasukan)}
                      </span>
                      <span className="text-amber-700 font-semibold w-24">
                        -{formatRupiah(row.pengeluaran)}
                      </span>
                      <span className="font-black text-[#064E3B] text-right w-28">
                        {formatRupiah(row.saldo)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 2: LAPORAN PEMASUKAN
          ========================================================================= */}
      {reportType === 'pemasukan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Rincian Penerimaan Keuangan Pesantren
                </h3>
                <p className="text-xs text-[#64748B]">
                  Data transaksi terverifikasi dari SPP, Uang Makan, Pembangunan, dsb.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari sumber penerimaan..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:ring-2 focus:ring-[#064E3B] outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                    <th className="py-3 px-4 font-bold">No</th>
                    <th className="py-3 px-4 font-bold">Sumber Pemasukan</th>
                    <th className="py-3 px-4 font-bold">Alokasi Unit</th>
                    <th className="py-3 px-4 font-bold text-center">Jumlah Transaksi</th>
                    <th className="py-3 px-4 font-bold text-right">Porsi (%)</th>
                    <th className="py-3 px-4 font-bold text-right">Total Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredIncome.map((item) => (
                    <tr key={item.no} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-semibold text-[#64748B]">{item.no}</td>
                      <td className="py-3 px-4 font-bold text-[#1E293B]">{item.source}</td>
                      <td className="py-3 px-4 text-[#64748B]">{item.unit}</td>
                      <td className="py-3 px-4 text-center font-medium text-[#334155]">
                        {formatNumber(item.transactionCount)} trx
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-[#64748B]">
                        {item.percentage.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-800 text-sm">
                        {formatRupiah(item.totalNominal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#E2E8F0] bg-emerald-50/50 font-black text-[#1E293B]">
                    <td colSpan={5} className="py-3.5 px-4 text-right uppercase tracking-wider">
                      TOTAL PEMASUKAN ({currentFinancialSummary.periodTypeLabel.toUpperCase()}):
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#064E3B] text-base">
                      {formatRupiah(filteredIncome.reduce((sum, item) => sum + item.totalNominal, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Visual Distribution & Action Section for Pemasukan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visualisasi Porsi Penerimaan */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E293B]">Distribusi Sumber Penerimaan</h3>
                    <p className="text-[11px] text-[#64748B]">
                      Porsi kontribusi pos terhadap total pemasukan periode ini
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 pt-1">
                {filteredIncome.map((item) => (
                  <div key={item.no} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.source}</span>
                      <span className="font-bold text-[#064E3B]">
                        {formatRupiah(item.totalNominal)} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#064E3B] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Legal Verification */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#064E3B]" />
                  <h3 className="text-sm font-bold text-[#1E293B]">Pengesahan Laporan Penerimaan</h3>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Laporan ini merefleksikan seluruh aliran dana masuk riil (SPP santri, infaq, uang makan, dan pendaftaran) yang telah tervalidasi secara rekonsiliasi kasir dan mutasi bank resmi.
                </p>
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-[#064E3B] font-medium space-y-1">
                  <div className="flex justify-between">
                    <span>Total Transaksi Terbukukan:</span>
                    <strong className="font-bold">{formatNumber(totalIncomeTransactions)} Kuitansi</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Status Rekonsiliasi:</span>
                    <strong className="font-bold text-emerald-800">100% Cocok (Kas & Bank)</strong>
                  </div>
                </div>
              </div>

              <div className="pt-5 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenPrintModal('Laporan Pemasukan')}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#064E3B] hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-emerald-200" />
                  <span>Cetak Laporan Pemasukan</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenExportModal('Laporan Pemasukan', 'PDF')}
                  className="inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenExportModal('Laporan Pemasukan', 'Excel')}
                  className="inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 3: LAPORAN PENGELUARAN (DILENGKAPI DENGAN SUMBER KEUANGAN TIAP POS & TRANSAKSI)
          ========================================================================= */}
      {reportType === 'pengeluaran' && (
        <div className="space-y-6">
          {/* Card: Distribusi Realisasi Berdasarkan Sumber Keuangan */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">
                    Distribusi Realisasi Beban Menurut Sumber Keuangan
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Pencatatan alokasi dana dan rekening kas penanggung biaya operasional pesantren.
                  </p>
                </div>
              </div>

              {expenseSourceFilter !== 'SEMUA' && (
                <button
                  type="button"
                  onClick={() => setExpenseSourceFilter('SEMUA')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                >
                  <span>Reset Filter Sumber</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded-full">✕</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expenseSourceDistribution.map((item) => {
                const isSelected = expenseSourceFilter === item.source;
                return (
                  <div
                    key={item.source}
                    onClick={() =>
                      setExpenseSourceFilter(isSelected ? 'SEMUA' : item.source)
                    }
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-[#064E3B] ring-2 ring-[#064E3B]/20 shadow-xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-emerald-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="inline-flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-[#064E3B]" />
                        <span className="font-bold text-xs text-[#1E293B] line-clamp-1">
                          {item.source}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#064E3B]">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="text-base font-black text-[#991B1B]">
                      {formatRupiah(item.total)}
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] text-[#64748B] mt-1.5 pt-1.5 border-t border-[#E2E8F0]">
                      <span className="truncate max-w-[170px]">{item.akunKas}</span>
                      <span className="font-semibold text-[#334155]">{item.count} transaksi</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table Container with View Switcher */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              {/* Left: View Tabs */}
              <div className="flex items-center gap-2">
                <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setExpenseViewTab('pos')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      expenseViewTab === 'pos'
                        ? 'bg-white text-[#064E3B] shadow-xs'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    <PieChartIcon className="w-3.5 h-3.5" />
                    <span>Rekap Pos Anggaran</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#F1F5F9] text-[#64748B] font-mono">
                      {filteredExpenses.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpenseViewTab('transaksi')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      expenseViewTab === 'transaksi'
                        ? 'bg-white text-[#064E3B] shadow-xs'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Buku Rincian Pengeluaran</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#064E3B] font-mono">
                      {filteredExpenseTransactions.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right: Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Sumber Keuangan Filter Dropdown */}
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 py-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#64748B]" />
                  <label className="text-[11px] font-bold text-[#64748B] whitespace-nowrap">
                    Sumber:
                  </label>
                  <select
                    value={expenseSourceFilter}
                    onChange={(e) => setExpenseSourceFilter(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-[#1E293B] outline-none cursor-pointer pr-1"
                  >
                    <option value="SEMUA">Semua Sumber Keuangan</option>
                    {availableExpenseSources.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari pos, uraian, bukti..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:ring-2 focus:ring-[#064E3B] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* TAB 1: REKAP POS BELANJA DENGAN SUMBER KEUANGAN */}
            {expenseViewTab === 'pos' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                      <th className="py-3 px-4 font-bold w-12">No</th>
                      <th className="py-3 px-4 font-bold">Kategori Pos Pengeluaran</th>
                      <th className="py-3 px-4 font-bold">Sumber Keuangan (Dana)</th>
                      <th className="py-3 px-4 font-bold">Unit Terkait</th>
                      <th className="py-3 px-4 font-bold text-center">Jumlah Transaksi</th>
                      <th className="py-3 px-4 font-bold text-right">Porsi (%)</th>
                      <th className="py-3 px-4 font-bold text-right">Total Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredExpenses.map((item, idx) => (
                      <tr key={item.no || idx} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#64748B]">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-[#1E293B]">
                          <div>{item.category}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[#064E3B] font-bold text-[11px]">
                            <Landmark className="w-3 h-3 text-emerald-700 shrink-0" />
                            <span>{item.sumberKeuangan || 'Kas Operasional Pesantren'}</span>
                          </div>
                          {item.akunKas && (
                            <div className="text-[10px] text-[#64748B] mt-0.5 ml-0.5">
                              {item.akunKas}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#64748B]">{item.unit}</td>
                        <td className="py-3 px-4 text-center font-medium text-[#334155]">
                          {formatNumber(item.transactionCount)} trx
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-[#64748B]">
                          {item.percentage.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-right font-black text-[#991B1B] text-sm">
                          {formatRupiah(item.totalNominal)}
                        </td>
                      </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#64748B]">
                          Tidak ada data pos pengeluaran yang sesuai dengan filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#E2E8F0] bg-rose-50/50 font-black text-[#1E293B]">
                      <td colSpan={6} className="py-3.5 px-4 text-right uppercase tracking-wider text-[#991B1B]">
                        TOTAL REALISASI BELANJA ({currentFinancialSummary.periodTypeLabel.toUpperCase()}):
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#991B1B] text-base">
                        {formatRupiah(
                          filteredExpenses.reduce((sum, item) => sum + item.totalNominal, 0)
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* TAB 2: BUKU RINCIAN TRANSAKSI PENGELUARAN DENGAN SUMBER KEUANGAN */}
            {expenseViewTab === 'transaksi' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                      <th className="py-3 px-3 font-bold w-10">No</th>
                      <th className="py-3 px-3 font-bold">Tanggal & Bukti</th>
                      <th className="py-3 px-3 font-bold">Pos Belanja</th>
                      <th className="py-3 px-4 font-bold">Uraian / Keperluan</th>
                      <th className="py-3 px-3 font-bold">Sumber Keuangan (Dana)</th>
                      <th className="py-3 px-3 font-bold">Unit</th>
                      <th className="py-3 px-3 font-bold">Penerima</th>
                      <th className="py-3 px-3 font-bold text-right">Nominal (Rp)</th>
                      <th className="py-3 px-3 font-bold text-center">Status Bukti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredExpenseTransactions.map((rec, idx) => (
                      <tr key={rec.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#64748B]">{idx + 1}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-bold text-[#1E293B]">{rec.tanggal}</div>
                          <div className="text-[10px] text-[#64748B] font-mono">{rec.noBukti}</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-semibold text-[#334155]">{rec.kategori}</span>
                        </td>
                        <td className="py-3 px-4 min-w-[220px]">
                          <div className="font-medium text-[#1E293B] line-clamp-2">
                            {rec.keterangan}
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[#064E3B] font-bold text-[10.5px]">
                            <Landmark className="w-3 h-3 text-emerald-700 shrink-0" />
                            <span>{rec.sumberKeuangan}</span>
                          </div>
                          <div className="text-[9.5px] text-[#64748B] mt-0.5">{rec.akunKas}</div>
                        </td>
                        <td className="py-3 px-3 text-[#64748B] whitespace-nowrap">{rec.unit}</td>
                        <td className="py-3 px-3 text-[#334155] whitespace-nowrap">{rec.penerima}</td>
                        <td className="py-3 px-3 text-right font-black text-[#991B1B] text-xs whitespace-nowrap">
                          {formatRupiah(rec.nominal)}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.statusNota === 'Lengkap'
                                ? 'bg-emerald-100 text-[#064E3B]'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rec.statusNota}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredExpenseTransactions.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-[#64748B]">
                          Tidak ada data rincian transaksi yang sesuai dengan filter pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#E2E8F0] bg-rose-50/50 font-black text-[#1E293B]">
                      <td colSpan={7} className="py-3.5 px-3 text-right uppercase tracking-wider text-[#991B1B]">
                        TOTAL RINCIAN TRANSAKSI TERCATAT:
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#991B1B] text-sm">
                        {formatRupiah(
                          filteredExpenseTransactions.reduce((sum, item) => sum + item.nominal, 0)
                        )}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 4: LAPORAN HARIAN (01 SEPTEMBER 2026)
          ========================================================================= */}
      {reportType === 'harian' && (
        <div className="space-y-6">
          {/* Daily KPI summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[11px] font-bold text-[#64748B] uppercase">Saldo Awal Hari</span>
              <div className="text-lg font-extrabold text-[#1E293B] mt-1">
                {formatRupiah(dailyReportSummary.saldoAwal)}
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-1">{dailyReportSummary.date}</div>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">
                (+) Pemasukan Hari Ini
              </span>
              <div className="text-lg font-extrabold text-emerald-800 mt-1">
                {formatRupiah(dailyReportSummary.pemasukanHariIni)}
              </div>
              <div className="text-[10px] text-emerald-700 mt-1">4 Transaksi Masuk</div>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase">
                (-) Pengeluaran Hari Ini
              </span>
              <div className="text-lg font-extrabold text-amber-800 mt-1">
                {formatRupiah(dailyReportSummary.pengeluaranHariIni)}
              </div>
              <div className="text-[10px] text-amber-700 mt-1">1 Belanja Dapur</div>
            </div>

            <div className="bg-[#064E3B] text-white p-4 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold text-emerald-200 uppercase">
                (=) Saldo Akhir Hari
              </span>
              <div className="text-lg font-black text-white mt-1">
                {formatRupiah(dailyReportSummary.saldoAkhir)}
              </div>
              <div className="text-[10px] text-emerald-100 mt-1">Posisi Kas & Bank Real-Time</div>
            </div>
          </div>

          {/* Daily transaction table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">Jurnal Transaksi Harian</h3>
                <p className="text-xs text-[#64748B]">
                  Daftar kronologis uang masuk dan keluar pada tanggal {dailyReportSummary.date}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                    <th className="py-3 px-3 font-bold">Waktu</th>
                    <th className="py-3 px-3 font-bold">No. Transaksi</th>
                    <th className="py-3 px-3 font-bold">Deskripsi</th>
                    <th className="py-3 px-3 font-bold">Unit / Kategori</th>
                    <th className="py-3 px-3 font-bold text-right text-emerald-700">Masuk</th>
                    <th className="py-3 px-3 font-bold text-right text-amber-700">Keluar</th>
                    <th className="py-3 px-3 font-bold text-right">Saldo Berjalan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredDaily.map((trx, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-bold text-[#1E293B]">{trx.time}</td>
                      <td className="py-3 px-3 font-mono text-[#064E3B] font-semibold">
                        {trx.transactionNo}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#1E293B]">
                        {trx.description}
                        <div className="text-[10px] text-[#94A3B8]">Petugas: {trx.pic}</div>
                      </td>
                      <td className="py-3 px-3 text-[#64748B]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                          {trx.unit} • {trx.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">
                        {trx.masuk ? formatRupiah(trx.masuk) : '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-amber-700">
                        {trx.keluar ? formatRupiah(trx.keluar) : '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#1E293B]">
                        {formatRupiah(trx.saldo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 5: LAPORAN SEMESTER
          ========================================================================= */}
      {reportType === 'semester' && (
        <div className="space-y-6">
          {/* Semester Selector Tabs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-semester-ganjil"
              onClick={() => setSelectedSemesterTab('ganjil')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                selectedSemesterTab === 'ganjil'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0]'
              }`}
            >
              Semester Ganjil 2026/2027 (Juli - Desember 2026)
            </button>
            <button
              type="button"
              id="btn-semester-genap"
              onClick={() => setSelectedSemesterTab('genap')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                selectedSemesterTab === 'genap'
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0]'
              }`}
            >
              Semester Genap 2026/2027 (Januari - Juni 2027)
            </button>
          </div>

          {/* Semester KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase">
                Total Pemasukan Semester
              </span>
              <div className="text-2xl font-black text-emerald-900 mt-2">
                {formatRupiah(
                  selectedSemesterTab === 'ganjil'
                    ? semesterGanjilReport.totalPemasukan
                    : semesterGenapReport.totalPemasukan
                )}
              </div>
              <div className="text-xs text-emerald-700 mt-1">Target realisasi anggaran tercapai</div>
            </div>

            <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800 uppercase">
                Total Pengeluaran Semester
              </span>
              <div className="text-2xl font-black text-amber-900 mt-2">
                {formatRupiah(
                  selectedSemesterTab === 'ganjil'
                    ? semesterGanjilReport.totalPengeluaran
                    : semesterGenapReport.totalPengeluaran
                )}
              </div>
              <div className="text-xs text-amber-700 mt-1">Efisiensi belanja pos operasional</div>
            </div>

            <div className="bg-[#064E3B] text-white p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-emerald-200 uppercase">Surplus Bersih</span>
              <div className="text-2xl font-black text-white mt-2">
                {formatRupiah(
                  selectedSemesterTab === 'ganjil'
                    ? semesterGanjilReport.surplus
                    : semesterGenapReport.surplus
                )}
              </div>
              <div className="text-xs text-emerald-100 mt-1">Kesehatan fiskal semester sangat prima</div>
            </div>
          </div>

          {/* Semester Month Breakdown Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#1E293B] mb-4">
              Rincian Perkembangan Bulanan Pada Semester Ini
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                    <th className="py-3 px-4 font-bold">Bulan</th>
                    <th className="py-3 px-4 font-bold text-right">Pemasukan</th>
                    <th className="py-3 px-4 font-bold text-right">Pengeluaran</th>
                    <th className="py-3 px-4 font-bold text-right">Surplus Bulanan</th>
                    <th className="py-3 px-4 font-bold text-right">Posisi Saldo Bank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {annualReportTable.map((row) => (
                    <tr key={row.month} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-bold text-[#1E293B]">{row.month} 2026</td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-700">
                        {formatRupiah(row.pemasukan)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-amber-700">
                        {formatRupiah(row.pengeluaran)}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-[#064E3B]">
                        +{formatRupiah(row.surplus)}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-[#1E293B]">
                        {formatRupiah(row.saldo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 6: LAPORAN TAHUNAN
          ========================================================================= */}
      {reportType === 'tahunan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Laporan Keuangan Tahunan (Tahun Ajaran 2026 / 2027)
                </h3>
                <p className="text-xs text-[#64748B]">
                  Rekapitulasi lengkap perkembangan keuangan per bulan sepanjang tahun ajaran
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-[#064E3B] font-bold text-xs rounded-lg border border-emerald-200">
                Tahun Ajaran 2026 / 2027
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                    <th className="py-3 px-4 font-bold">Bulan</th>
                    <th className="py-3 px-4 font-bold text-right">Pemasukan</th>
                    <th className="py-3 px-4 font-bold text-right">Pengeluaran</th>
                    <th className="py-3 px-4 font-bold text-right">Surplus / Defisit</th>
                    <th className="py-3 px-4 font-bold text-right">Akumulasi Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {annualReportTable.map((row) => (
                    <tr key={row.month} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-bold text-[#1E293B]">{row.month}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">
                        {formatRupiah(row.pemasukan)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-700">
                        {formatRupiah(row.pengeluaran)}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-[#064E3B]">
                        +{formatRupiah(row.surplus)}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-[#1E293B]">
                        {formatRupiah(row.saldo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 7: LAPORAN PEMBAYARAN SANTRI
          ========================================================================= */}
      {reportType === 'pembayaran_santri' && (
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[11px] font-bold text-[#64748B] uppercase">Total Tagihan</span>
              <div className="text-xl font-bold text-[#1E293B] mt-1">
                {formatRupiah(studentPaymentReportStats.totalTagihan)}
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-1">300 Santri Aktif</div>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">
                Total Pembayaran Masuk
              </span>
              <div className="text-xl font-extrabold text-emerald-800 mt-1">
                {formatRupiah(studentPaymentReportStats.totalPembayaran)}
              </div>
              <div className="text-[10px] text-emerald-700 mt-1">Telah diterima sistem</div>
            </div>

            <div className="bg-red-50/70 p-4 rounded-xl border border-red-200 shadow-xs">
              <span className="text-[11px] font-bold text-red-800 uppercase">Total Tunggakan</span>
              <div className="text-xl font-extrabold text-red-800 mt-1">
                {formatRupiah(studentPaymentReportStats.totalTunggakan)}
              </div>
              <div className="text-[10px] text-red-700 mt-1">Belum diselesaikan</div>
            </div>

            <div className="bg-[#064E3B] text-white p-4 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold text-emerald-200 uppercase">
                Persentase Pembayaran
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {studentPaymentReportStats.percentageCollected}%
              </div>
              <div className="text-[10px] text-emerald-100 mt-1">220 Lunas • 35 Sebagian</div>
            </div>
          </div>

          {/* Visual Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                73%
              </div>
              <h4 className="font-bold text-[#1E293B]">SANTRI LUNAS</h4>
              <p className="text-xs text-[#64748B] mt-0.5">220 Santri (73.3%)</p>
              <div className="text-sm font-extrabold text-emerald-700 mt-2">
                {formatRupiah(studentPaymentReportStats.lunasNominal)}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                12%
              </div>
              <h4 className="font-bold text-[#1E293B]">BAYAR SEBAGIAN</h4>
              <p className="text-xs text-[#64748B] mt-0.5">35 Santri (11.7%)</p>
              <div className="text-sm font-extrabold text-amber-700 mt-2">
                {formatRupiah(studentPaymentReportStats.sebagianNominal)}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-800 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                15%
              </div>
              <h4 className="font-bold text-[#1E293B]">BELUM BAYAR</h4>
              <p className="text-xs text-[#64748B] mt-0.5">45 Santri (15.0%)</p>
              <div className="text-sm font-extrabold text-red-700 mt-2">
                {formatRupiah(studentPaymentReportStats.totalTunggakan)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 8: LAPORAN TUNGGAKAN
          ========================================================================= */}
      {reportType === 'tunggakan' && (
        <div className="space-y-6">
          {/* Arrears summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[11px] font-bold text-[#64748B] uppercase">Total Santri</span>
              <div className="text-xl font-bold text-[#1E293B] mt-1">
                {arrearsSummaryStats.totalSantri} Santri
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-1">Tahun Ajaran 2026/2027</div>
            </div>

            <div className="bg-red-50/70 p-4 rounded-xl border border-red-200 shadow-xs">
              <span className="text-[11px] font-bold text-red-800 uppercase">Santri Menunggak</span>
              <div className="text-xl font-extrabold text-red-800 mt-1">
                {arrearsSummaryStats.santriMenunggak} Santri
              </div>
              <div className="text-[10px] text-red-700 mt-1">15% dari total santri</div>
            </div>

            <div className="bg-red-50/70 p-4 rounded-xl border border-red-200 shadow-xs">
              <span className="text-[11px] font-bold text-red-800 uppercase">Total Tunggakan</span>
              <div className="text-xl font-extrabold text-red-800 mt-1">
                {formatRupiah(arrearsSummaryStats.totalTunggakan)}
              </div>
              <div className="text-[10px] text-red-700 mt-1">Bulanan & Tahunan</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-[11px] font-bold text-[#64748B] uppercase">
                Rata-rata Tunggakan
              </span>
              <div className="text-xl font-bold text-[#064E3B] mt-1">
                {formatRupiah(arrearsSummaryStats.rataRataTunggakan)}
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-1">Per santri menunggak</div>
            </div>
          </div>

          {/* Arrears table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">Daftar Santri Menunggak</h3>
                <p className="text-xs text-[#64748B]">
                  Rincian santri dengan tagihan belum terselesaikan
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari NIS / Nama Santri..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:ring-2 focus:ring-[#064E3B] outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                    <th className="py-3 px-3 font-bold">No</th>
                    <th className="py-3 px-3 font-bold">NIS</th>
                    <th className="py-3 px-3 font-bold">Nama Santri</th>
                    <th className="py-3 px-3 font-bold">Kelas</th>
                    <th className="py-3 px-3 font-bold">Jenis Tagihan</th>
                    <th className="py-3 px-3 font-bold text-right">Total Tagihan</th>
                    <th className="py-3 px-3 font-bold text-right">Sudah Dibayar</th>
                    <th className="py-3 px-3 font-bold text-right text-red-700">Tunggakan</th>
                    <th className="py-3 px-3 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredArrears.map((row) => (
                    <tr key={row.no} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-medium text-[#64748B]">{row.no}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#1E293B]">{row.nis}</td>
                      <td className="py-3 px-3 font-bold text-[#1E293B]">
                        {row.namaSantri}
                        <div className="text-[10px] text-[#94A3B8]">{row.kontakWali}</div>
                      </td>
                      <td className="py-3 px-3 text-[#475569]">{row.kelas}</td>
                      <td className="py-3 px-3 text-[#64748B]">{row.jenisTagihan}</td>
                      <td className="py-3 px-3 text-right font-medium text-[#1E293B]">
                        {formatRupiah(row.totalTagihan)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-emerald-700">
                        {formatRupiah(row.sudahDibayar)}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-red-700 text-sm">
                        {formatRupiah(row.tunggakan)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            row.status === 'MENUNGGAK'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 9: LAPORAN REKENING BANK
          ========================================================================= */}
      {reportType === 'rekening_bank' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#1E293B] mb-4">
              Laporan Posisi dan Mutasi Rekening Bank Pesantren
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                    <th className="py-3 px-4 font-bold">Rekening Bank</th>
                    <th className="py-3 px-4 font-bold text-right">Saldo Awal</th>
                    <th className="py-3 px-4 font-bold text-right text-emerald-700">Pemasukan</th>
                    <th className="py-3 px-4 font-bold text-right text-amber-700">Pengeluaran</th>
                    <th className="py-3 px-4 font-bold text-right">Saldo Akhir</th>
                    <th className="py-3 px-4 font-bold text-center">Status Rekonsiliasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {bankPositionReports.map((bank, i) => (
                    <tr key={i} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-bold text-[#1E293B]">
                        {bank.rekeningName}
                        <div className="text-[10px] text-[#94A3B8] font-mono">{bank.accountNumber}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-[#64748B]">
                        {formatRupiah(bank.saldoAwal)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">
                        {formatRupiah(bank.pemasukan)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-700">
                        {formatRupiah(bank.pengeluaran)}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-[#064E3B] text-sm">
                        {formatRupiah(bank.saldoAkhir)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {bank.statusRekonsiliasi}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#E2E8F0] bg-emerald-50/50 font-black text-[#1E293B]">
                    <td className="py-3.5 px-4 uppercase tracking-wider">TOTAL KONSOLIDASI:</td>
                    <td className="py-3.5 px-4 text-right">
                      {formatRupiah(reportExecutiveSummary.saldoAwal)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-800">
                      {formatRupiah(reportExecutiveSummary.totalPemasukan)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-amber-800">
                      {formatRupiah(reportExecutiveSummary.totalPengeluaran)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#064E3B] text-base">
                      {formatRupiah(reportExecutiveSummary.saldoAkhir)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-emerald-700 text-[10px]">
                      100% Sesuai
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 10: LAPORAN PER UNIT
          ========================================================================= */}
      {reportType === 'per_unit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#1E293B] mb-4">
              Laporan Keuangan Per Bagian / Unit Pesantren
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                    <th className="py-3 px-4 font-bold">Unit / Bagian</th>
                    <th className="py-3 px-4 font-bold text-right text-emerald-700">Pemasukan</th>
                    <th className="py-3 px-4 font-bold text-right text-amber-700">Pengeluaran</th>
                    <th className="py-3 px-4 font-bold text-right">Net Finansial</th>
                    <th className="py-3 px-4 font-bold text-center">Status Anggaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {unitFinancialReports.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-bold text-[#1E293B]">{row.unit}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">
                        {row.pemasukan > 0 ? formatRupiah(row.pemasukan) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-700">
                        {formatRupiah(row.pengeluaran)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-black ${
                          row.net >= 0 ? 'text-emerald-800' : 'text-red-700'
                        }`}
                      >
                        {row.net >= 0 ? `+${formatRupiah(row.net)}` : `-${formatRupiah(Math.abs(row.net))}`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            row.net >= 0
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {row.net >= 0 ? 'Surplus Operasional' : 'Cost Center Terpadu'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 11: LAPORAN ARUS KAS
          ========================================================================= */}
      {reportType === 'arus_kas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-[#1E293B]">
              Laporan Arus Kas Langsung (Direct Cash Flow Statement)
            </h3>

            {/* Inflows */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                1. Arus Kas Dari Aktivitas Operasional & Santri (Masuk)
              </h4>
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Penerimaan SPP dan Biaya Pendidikan</span>
                  <span className="font-bold text-emerald-700">Rp57.000.000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Penerimaan Uang Makan Dapur Santri</span>
                  <span className="font-bold text-emerald-700">Rp142.500.000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Penerimaan Uang Pembangunan & Sarpras</span>
                  <span className="font-bold text-emerald-700">Rp67.500.000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Penerimaan Lainnya (Listrik, Kertas, Kegiatan)</span>
                  <span className="font-bold text-emerald-700">Rp58.500.000</span>
                </div>
                <div className="border-t border-[#CBD5E1] pt-2 flex justify-between text-xs font-black text-[#064E3B]">
                  <span>TOTAL ARUS KAS MASUK</span>
                  <span>Rp325.500.000</span>
                </div>
              </div>
            </div>

            {/* Outflows */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                2. Arus Kas Keluar Untuk Beban & Belanja Operasional
              </h4>
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Belanja Logistik Dapur & Konsumsi</span>
                  <span className="font-bold text-amber-700">Rp52.500.000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Gaji & Tunjangan Guru & Karyawan</span>
                  <span className="font-bold text-amber-700">Rp66.000.000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Utilitas (Listrik, Internet, Air, ATK)</span>
                  <span className="font-bold text-amber-700">Rp18.600.000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Kegiatan Santri & Pengeluaran Lainnya</span>
                  <span className="font-bold text-amber-700">Rp48.650.000</span>
                </div>
                <div className="border-t border-[#CBD5E1] pt-2 flex justify-between text-xs font-black text-amber-800">
                  <span>TOTAL ARUS KAS KELUAR</span>
                  <span>Rp185.750.000</span>
                </div>
              </div>
            </div>

            {/* Net */}
            <div className="p-4 rounded-xl bg-[#064E3B] text-white flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-emerald-200">
                  ARUS KAS BERSIH (NET CASH FLOW)
                </span>
                <div className="text-xl font-black">+Rp139.750.000</div>
              </div>
              <span className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold">
                Surplus Bersih Terverifikasi
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CASE 12: LAPORAN AUDIT TRANSAKSI
          ========================================================================= */}
      {reportType === 'audit_transaksi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Jejak Audit & Riwayat Keamanan Keuangan
                </h3>
                <p className="text-xs text-[#64748B]">
                  Catatan aktivitas perubahan data, pembatalan, dan export laporan
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Audit Trail Aktif & Terlindungi
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]">
                    <th className="py-3 px-4 font-bold">Waktu</th>
                    <th className="py-3 px-4 font-bold">Tipe Aktivitas</th>
                    <th className="py-3 px-4 font-bold">Keterangan Transaksi</th>
                    <th className="py-3 px-4 font-bold text-right">Nominal</th>
                    <th className="py-3 px-4 font-bold">Pengguna & Role</th>
                    <th className="py-3 px-4 font-bold">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {initialAuditTransactionLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-mono text-[#64748B]">{log.timestamp}</td>
                      <td className="py-3 px-4 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            log.activityType === 'DIBUAT'
                              ? 'bg-emerald-50 text-emerald-800'
                              : log.activityType === 'DIUBAH'
                              ? 'bg-blue-50 text-blue-800'
                              : log.activityType === 'DIBATALKAN'
                              ? 'bg-red-50 text-red-800'
                              : 'bg-purple-50 text-purple-800'
                          }`}
                        >
                          {log.activityType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#1E293B] font-medium">{log.description}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#334155]">
                        {log.amount ? formatRupiah(log.amount) : '-'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1E293B]">
                        {log.user}
                        <div className="text-[10px] text-[#94A3B8] font-normal">{log.role}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#64748B] text-[11px]">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Cash Book Print & Export Modal */}
      <PrintCashBookModal
        isOpen={isBkuPrintModalOpen}
        onClose={() => setIsBkuPrintModalOpen(false)}
        transactions={initialTransactions}
      />
    </div>
  );
};
