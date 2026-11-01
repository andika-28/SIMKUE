import React, { useState, useMemo } from 'react';
import {
  Wallet,
  FileSpreadsheet,
  Plus,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  FileCheck2,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ExpenseItem,
  ExpenseKpiSummary,
  ExpenseAttachment,
  ExpenseCategory,
  ExpenseInstitutionUnit,
  FundingSourceItem,
} from '../../types';
import {
  sampleExpenses,
  initialExpenseKpiSummary,
  initialBankBalances,
  sampleExpensesByUnit,
  sampleMonthlyExpenseTrend,
} from '../../data/expenseData';
import {
  loadStoredCategories,
  saveStoredCategories,
  loadStoredInstitutionUnits,
  saveStoredInstitutionUnits,
  loadStoredFundingSources,
  saveStoredFundingSources,
} from '../../data/expenseSettingsData';
import { ExpenseKpiCards } from './ExpenseKpiCards';
import { ExpenseQuickActions } from './ExpenseQuickActions';
import { ExpenseFilterToolbar } from './ExpenseFilterToolbar';
import { ExpenseTable } from './ExpenseTable';
import { ExpenseAnalyticsSection, DynamicTrendPoint, DynamicUnitStat } from './ExpenseAnalyticsSection';
import { CreateExpenseModal } from './CreateExpenseModal';
import { ExpenseDetailDrawer } from './ExpenseDetailDrawer';
import { EditExpenseModal } from './EditExpenseModal';
import { CancelExpenseModal } from './CancelExpenseModal';
import { QuickUploadReceiptModal } from './QuickUploadReceiptModal';
import { ExportExpenseReportModal } from './ExportExpenseReportModal';
import { CategoryGuideModal } from './CategoryGuideModal';
import { VoucherReceiptModal } from './VoucherReceiptModal';
import { PengaturanPengeluaranModal } from './PengaturanPengeluaranModal';
import { downloadExcelSpreadsheet, downloadPrintableReport } from '../../utils/fileDownloader';

export const ManajemenPengeluaranView: React.FC = () => {
  // Master State
  const [expenses, setExpenses] = useState<ExpenseItem[]>(sampleExpenses);
  const [bni1Balance, setBni1Balance] = useState<number>(initialBankBalances['BNI Rekening 1'].saldo);
  const [bni2Balance, setBni2Balance] = useState<number>(initialBankBalances['BNI Rekening 2'].saldo);
  const [currentRole, setCurrentRole] = useState<'Bendahara' | 'Administrator' | 'Pimpinan'>('Bendahara');

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [selectedAccount, setSelectedAccount] = useState<string>('SEMUA');
  const [selectedReceiptStatus, setSelectedReceiptStatus] = useState<string>('SEMUA');
  const [dateRangePreset, setDateRangePreset] = useState<string>('Bulan Ini');
  const [startDate, setStartDate] = useState<string>('01 Agu 2026');
  const [endDate, setEndDate] = useState<string>('31 Agu 2026');
  const [activeQuickTab, setActiveQuickTab] = useState<string>('Semua');

  // Modal / Drawer States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState<boolean>(false);
  const [selectedDetailExpense, setSelectedDetailExpense] = useState<ExpenseItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedEditExpense, setSelectedEditExpense] = useState<ExpenseItem | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [selectedCancelExpense, setSelectedCancelExpense] = useState<ExpenseItem | null>(null);
  const [isQuickUploadOpen, setIsQuickUploadOpen] = useState<boolean>(false);
  const [selectedQuickUploadExpense, setSelectedQuickUploadExpense] = useState<ExpenseItem | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isCategoryGuideOpen, setIsCategoryGuideOpen] = useState<boolean>(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState<boolean>(false);
  const [selectedVoucherExpense, setSelectedVoucherExpense] = useState<ExpenseItem | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Dynamic Financial Settings State
  const [categories, setCategories] = useState<ExpenseCategory[]>(() => loadStoredCategories());
  const [institutionUnits, setInstitutionUnits] = useState<ExpenseInstitutionUnit[]>(() => loadStoredInstitutionUnits());
  const [fundingSources, setFundingSources] = useState<FundingSourceItem[]>(() => loadStoredFundingSources());

  const handleSaveCategories = (newCats: ExpenseCategory[]) => {
    setCategories(newCats);
    saveStoredCategories(newCats);
    showToast('Daftar kategori & pos anggaran pengeluaran berhasil disimpan.', 'success');
  };

  const handleSaveInstitutionUnits = (newUnits: ExpenseInstitutionUnit[]) => {
    setInstitutionUnits(newUnits);
    saveStoredInstitutionUnits(newUnits);
    showToast('Daftar instansi/unit pemakai dana berhasil disimpan.', 'success');
  };

  const handleSaveFundingSources = (newSources: FundingSourceItem[]) => {
    setFundingSources(newSources);
    saveStoredFundingSources(newSources);
    showToast('Daftar sumber dana keuangan pengeluaran berhasil disimpan.', 'success');
  };

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTrx = item.transactionNo.toLowerCase().includes(q);
        const matchKet = item.keterangan.toLowerCase().includes(q);
        const matchCat = item.kategori.toLowerCase().includes(q);
        const matchUnit = item.unit ? item.unit.toLowerCase().includes(q) : false;
        if (!matchTrx && !matchKet && !matchCat && !matchUnit) return false;
      }

      // 2. Category
      if (selectedCategory !== 'SEMUA' && item.kategori !== selectedCategory) {
        return false;
      }

      // 3. Rekening
      if (selectedAccount !== 'SEMUA' && item.rekening !== selectedAccount) {
        return false;
      }

      // 4. Status Bukti
      if (selectedReceiptStatus !== 'SEMUA') {
        if (item.statusBukti !== selectedReceiptStatus) return false;
      }

      // 5. Quick Tabs
      if (activeQuickTab === 'Hari Ini') {
        if (!item.tanggal.includes('01 Sep 2026') && !item.tanggal.includes('31 Agu 2026')) {
          // just mock filtering
        }
      }

      return true;
    });
  }, [expenses, searchQuery, selectedCategory, selectedAccount, selectedReceiptStatus, activeQuickTab]);

  // Recalculate KPIs based on current state
  const kpiSummary: ExpenseKpiSummary = useMemo(() => {
    const activeExpenses = expenses.filter((e) => e.status !== 'DIBATALKAN');
    const totalBulan = activeExpenses.reduce((acc, curr) => acc + curr.nominal, 0);

    // Group by category to find biggest
    const catMap: Record<string, number> = {};
    activeExpenses.forEach((e) => {
      catMap[e.kategori] = (catMap[e.kategori] || 0) + e.nominal;
    });

    let biggestCat = activeExpenses.length > 0 ? Object.keys(catMap)[0] : '-';
    let biggestNominal = 0;
    Object.entries(catMap).forEach(([cat, val]) => {
      if (val > biggestNominal) {
        biggestNominal = val;
        biggestCat = cat;
      }
    });

    const todayExpenses = activeExpenses.filter(
      (e) => e.tanggal.includes('Hari Ini') || e.tanggal.includes('31 Agu')
    );
    const pengeluaranHariIni = todayExpenses.reduce((acc, curr) => acc + curr.nominal, 0);

    return {
      totalPengeluaranBulanIni: totalBulan,
      pengeluaranHariIni: pengeluaranHariIni,
      pengeluaranHariIniCount: todayExpenses.length,
      pengeluaranTerbesarKategori: biggestCat,
      pengeluaranTerbesarNominal: biggestNominal,
      totalTransaksiCount: activeExpenses.length,
      periodLabel: 'Bulan Ini',
    };
  }, [expenses]);

  // Calculate Category Stats dynamically
  const dynamicCategoryStats = useMemo(() => {
    const activeExpenses = expenses.filter((e) => e.status !== 'DIBATALKAN');
    if (activeExpenses.length === 0) return [];
    const totalAll = activeExpenses.reduce((acc, curr) => acc + curr.nominal, 0) || 1;
    const catMap: Record<string, { total: number; count: number }> = {};

    activeExpenses.forEach((e) => {
      if (!catMap[e.kategori]) {
        catMap[e.kategori] = { total: 0, count: 0 };
      }
      catMap[e.kategori].total += e.nominal;
      catMap[e.kategori].count += 1;
    });

    return Object.entries(catMap).map(([cat, val]) => ({
      category: cat,
      total: val.total,
      count: val.count,
      percentage: Math.round((val.total / totalAll) * 100),
    }));
  }, [expenses]);

  // Missing / Incomplete receipts list
  const incompleteReceipts = useMemo(() => {
    return expenses.filter(
      (e) => e.status !== 'DIBATALKAN' && (e.statusBukti === 'MENUNGGU_NOTA' || e.statusBukti === 'PERLU_PERBAIKAN')
    );
  }, [expenses]);

  // Unit Stats dynamically computed
  const dynamicUnitStats = useMemo(() => {
    const activeExpenses = expenses.filter((e) => e.status !== 'DIBATALKAN');
    const unitMap: Record<string, { count: number; total: number }> = {
      Dapur: { count: 0, total: 0 },
      Asrama: { count: 0, total: 0 },
      MTs: { count: 0, total: 0 },
      MA: { count: 0, total: 0 },
      Kantor: { count: 0, total: 0 },
      Umum: { count: 0, total: 0 },
    };

    activeExpenses.forEach((e) => {
      const u = e.unit || 'Umum';
      if (!unitMap[u]) {
        unitMap[u] = { count: 0, total: 0 };
      }
      unitMap[u].count += 1;
      unitMap[u].total += e.nominal;
    });

    return Object.entries(unitMap).map(([unit, data]) => ({
      unit,
      count: data.count,
      total: data.total,
    }));
  }, [expenses]);

  // Monthly trend mapped
  const trendData: DynamicTrendPoint[] = useMemo(() => {
    return sampleMonthlyExpenseTrend.map((t) => ({
      month: t.bulan,
      amount: t.nominal,
    }));
  }, []);

  // Bank Balances Spent
  const bni1TotalSpent = useMemo(() => {
    return expenses
      .filter((e) => e.status !== 'DIBATALKAN' && e.rekening === 'BNI Rekening 1')
      .reduce((a, b) => a + b.nominal, 0);
  }, [expenses]);

  const bni2TotalSpent = useMemo(() => {
    return expenses
      .filter((e) => e.status !== 'DIBATALKAN' && e.rekening === 'BNI Rekening 2')
      .reduce((a, b) => a + b.nominal, 0);
  }, [expenses]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('SEMUA');
    setSelectedAccount('SEMUA');
    setSelectedReceiptStatus('SEMUA');
    setActiveQuickTab('Semua');
  };

  // CREATE NEW EXPENSE HANDLER
  const handleSaveNewExpense = (
    newExpenseData: Omit<ExpenseItem, 'id' | 'riwayatAktivitas'>,
    isDraft?: boolean
  ) => {
    const newId = `exp-${Date.now()}`;
    const newAuditLog = {
      id: `log-${Date.now()}`,
      action: isDraft ? 'Pencatatan Draft' : 'Pencatatan Pengeluaran Kas',
      actor: currentRole === 'Bendahara' ? 'Bendahara 1 (Ustadz Rahmat)' : 'Administrator SIMKEU',
      role: currentRole,
      timestamp: '01 Sep 2026, 09:40 WIB',
      note: isDraft
        ? 'Transaksi disimpan sebagai draf sementara'
        : 'Transaksi berhasil dibukukan ke dalam jurnal kas.',
    };

    const newExpense: ExpenseItem = {
      ...newExpenseData,
      id: newId,
      riwayatAktivitas: [newAuditLog],
    };

    // Deduct account balance
    if (!isDraft) {
      if (newExpense.rekening === 'BNI Rekening 1') {
        setBni1Balance((prev) => Math.max(0, prev - newExpense.nominal));
      } else {
        setBni2Balance((prev) => Math.max(0, prev - newExpense.nominal));
      }
    }

    setExpenses((prev) => [newExpense, ...prev]);
    showToast(
      isDraft
        ? `Draft pengeluaran ${newExpense.transactionNo} berhasil disimpan.`
        : `Pengeluaran ${newExpense.transactionNo} sebesar Rp ${newExpense.nominal.toLocaleString('id-ID')} berhasil dicatat!`,
      'success'
    );
  };

  // EDIT EXPENSE HANDLER
  const handleSaveEditExpense = (updatedExpense: ExpenseItem, alasanPerubahan: string) => {
    const oldExpense = expenses.find((e) => e.id === updatedExpense.id);
    const nominalDiff = updatedExpense.nominal - (oldExpense ? oldExpense.nominal : 0);

    const editLog = {
      id: `log-${Date.now()}`,
      action: 'Penyesuaian Data Transaksi',
      actor: currentRole === 'Bendahara' ? 'Bendahara 1 (Ustadz Rahmat)' : 'Administrator SIMKEU',
      role: currentRole,
      timestamp: '01 Sep 2026, 10:15 WIB',
      note: `Penyesuaian: ${alasanPerubahan}`,
      previousValue: oldExpense ? `Rp ${oldExpense.nominal.toLocaleString('id-ID')} (${oldExpense.kategori})` : '',
      newValue: `Rp ${updatedExpense.nominal.toLocaleString('id-ID')} (${updatedExpense.kategori})`,
    };

    // Adjust balance if nominal changed
    if (nominalDiff !== 0) {
      if (updatedExpense.rekening === 'BNI Rekening 1') {
        setBni1Balance((prev) => prev - nominalDiff);
      } else {
        setBni2Balance((prev) => prev - nominalDiff);
      }
    }

    const updatedWithLog: ExpenseItem = {
      ...updatedExpense,
      riwayatAktivitas: [editLog, ...(updatedExpense.riwayatAktivitas || [])],
    };

    setExpenses((prev) => prev.map((item) => (item.id === updatedWithLog.id ? updatedWithLog : item)));
    if (selectedDetailExpense?.id === updatedWithLog.id) {
      setSelectedDetailExpense(updatedWithLog);
    }

    showToast(`Transaksi ${updatedExpense.transactionNo} berhasil diperbarui dengan log audit.`, 'info');
  };

  // CANCEL EXPENSE HANDLER
  const handleConfirmCancelExpense = (target: ExpenseItem, reason: string) => {
    const cancelLog = {
      id: `log-${Date.now()}`,
      action: 'Pembatalan Transaksi Kas',
      actor: currentRole === 'Bendahara' ? 'Bendahara 1 (Ustadz Rahmat)' : 'Administrator SIMKEU',
      role: currentRole,
      timestamp: '01 Sep 2026, 10:30 WIB',
      note: `Alasan Pembatalan: ${reason}`,
      previousValue: 'Status: TERCATAT',
      newValue: 'Status: DIBATALKAN',
    };

    // Restore bank balance
    if (target.rekening === 'BNI Rekening 1') {
      setBni1Balance((prev) => prev + target.nominal);
    } else {
      setBni2Balance((prev) => prev + target.nominal);
    }

    const cancelledExpense: ExpenseItem = {
      ...target,
      status: 'DIBATALKAN',
      alasanBatal: reason,
      riwayatAktivitas: [cancelLog, ...(target.riwayatAktivitas || [])],
    };

    setExpenses((prev) => prev.map((item) => (item.id === target.id ? cancelledExpense : item)));
    if (selectedDetailExpense?.id === target.id) {
      setSelectedDetailExpense(cancelledExpense);
    }

    showToast(`Transaksi ${target.transactionNo} dibatalkan & saldo rekening telah dipulihkan.`, 'warn');
  };

  // QUICK UPLOAD RECEIPT HANDLER
  const handleSaveQuickReceipt = (expenseId: string, newFiles: ExpenseAttachment[]) => {
    const uploadLog = {
      id: `log-${Date.now()}`,
      action: 'Upload Bukti Transaksi',
      actor: currentRole === 'Bendahara' ? 'Bendahara 1 (Ustadz Rahmat)' : 'Administrator SIMKEU',
      role: currentRole,
      timestamp: '01 Sep 2026, 10:45 WIB',
      note: `Menambahkan ${newFiles.length} berkas bukti nota/struk.`,
    };

    setExpenses((prev) =>
      prev.map((item) => {
        if (item.id === expenseId) {
          const mergedBukti = [...item.buktiList, ...newFiles];
          return {
            ...item,
            buktiList: mergedBukti,
            statusBukti: 'LENGKAP',
            riwayatAktivitas: [uploadLog, ...(item.riwayatAktivitas || [])],
          };
        }
        return item;
      })
    );

    showToast(`Bukti transaksi berhasil diunggah & status diperbarui menjadi Lengkap.`, 'success');
  };

  // Quick Action Triggers
  const handleOpenDetail = (item: ExpenseItem) => {
    setSelectedDetailExpense(item);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenEdit = (item: ExpenseItem) => {
    setSelectedEditExpense(item);
    setIsEditModalOpen(true);
  };

  const handleOpenCancel = (item: ExpenseItem) => {
    setSelectedCancelExpense(item);
    setIsCancelModalOpen(true);
  };

  const handleOpenQuickUpload = (item?: ExpenseItem) => {
    if (item) {
      setSelectedQuickUploadExpense(item);
    } else {
      // Pick first missing receipt item or first item
      const missing = expenses.find((e) => e.statusBukti !== 'LENGKAP') || expenses[0];
      setSelectedQuickUploadExpense(missing);
    }
    setIsQuickUploadOpen(true);
  };

  const handleOpenPrintVoucher = (item: ExpenseItem) => {
    setSelectedVoucherExpense(item);
    setIsVoucherModalOpen(true);
  };

  return (
    <div id="manajemen-pengeluaran-view" className="space-y-6 pb-12 max-w-[1440px] mx-auto animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-80 max-w-md animate-in slide-in-from-top duration-200">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toastMessage.type === 'warn'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            {toastMessage.type === 'warn' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
            {toastMessage.type === 'info' && <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Keuangan Pesantren</span>
            <span>/</span>
            <span className="text-[#064E3B] font-bold">Manajemen Pengeluaran</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Pengeluaran
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan kas keluar, kelengkapan nota/kwitansi, audit pos anggaran, dan visualisasi pengeluaran santri & pesantren.
          </p>
        </div>
      </div>

      {/* 1. Summary KPI Cards (4 Cards) */}
      <ExpenseKpiCards
        summary={kpiSummary}
        onFilterCategory={(cat) => setSelectedCategory(cat)}
        onFilterToday={() => setActiveQuickTab('Hari Ini')}
      />

      {/* 2. Quick Action Toolbar & Real-time Balance Glance */}
      <ExpenseQuickActions
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenQuickUpload={() => handleOpenQuickUpload()}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCategoryGuide={() => setIsCategoryGuideOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        bni1Balance={bni1Balance}
        bni2Balance={bni2Balance}
        currentRole={currentRole}
        onChangeRole={(r) => setCurrentRole(r)}
      />

      {/* 3. Filter Toolbar */}
      <ExpenseFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
        selectedReceiptStatus={selectedReceiptStatus}
        onReceiptStatusChange={setSelectedReceiptStatus}
        dateRangePreset={dateRangePreset}
        onDateRangePresetChange={setDateRangePreset}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onResetFilters={handleResetFilters}
        activeQuickTab={activeQuickTab}
        onSelectQuickTab={setActiveQuickTab}
        totalFilteredCount={filteredExpenses.length}
      />

      {/* 4. Main Expense Table */}
      <ExpenseTable
        expenses={filteredExpenses}
        onViewDetail={handleOpenDetail}
        onEditExpense={handleOpenEdit}
        onCancelExpense={handleOpenCancel}
        onUploadReceipt={handleOpenQuickUpload}
        onPrintVoucher={handleOpenPrintVoucher}
        onExportExcel={() => setIsExportModalOpen(true)}
        onAddNewExpense={() => setIsCreateModalOpen(true)}
      />

      {/* 5. Expense Analytics & Visualizations Section */}
      <ExpenseAnalyticsSection
        categoryStats={dynamicCategoryStats}
        trendData={trendData}
        unitStats={dynamicUnitStats}
        incompleteReceipts={incompleteReceipts}
        onQuickUploadReceipt={handleOpenQuickUpload}
        onFilterCategory={(cat) => setSelectedCategory(cat)}
        bni1Total={bni1TotalSpent}
        bni2Total={bni2TotalSpent}
      />

      {/* MODALS & DRAWERS */}

      {/* Create Expense Modal */}
      <CreateExpenseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaveExpense={handleSaveNewExpense}
        bni1Balance={bni1Balance}
        bni2Balance={bni2Balance}
        currentActorName={currentRole === 'Bendahara' ? 'Bendahara 1 (Ustadz Rahmat)' : 'Administrator SIMKEU'}
        availableCategories={categories}
        availableUnits={institutionUnits}
        availableFundingSources={fundingSources}
      />

      {/* Detail Expense Drawer */}
      <ExpenseDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        expense={selectedDetailExpense}
        onEditExpense={handleOpenEdit}
        onCancelExpense={handleOpenCancel}
        onPrintVoucher={handleOpenPrintVoucher}
        onUploadReceipt={handleOpenQuickUpload}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        expense={selectedEditExpense}
        onSaveEdit={handleSaveEditExpense}
        availableCategories={categories}
        availableUnits={institutionUnits}
        availableFundingSources={fundingSources}
      />

      {/* Cancel Expense Modal */}
      <CancelExpenseModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        expense={selectedCancelExpense}
        onConfirmCancel={handleConfirmCancelExpense}
      />

      {/* Quick Upload Receipt Modal */}
      <QuickUploadReceiptModal
        isOpen={isQuickUploadOpen}
        onClose={() => setIsQuickUploadOpen(false)}
        expense={selectedQuickUploadExpense}
        onSaveReceipts={handleSaveQuickReceipt}
      />

      {/* Export Expense Report Modal */}
      <ExportExpenseReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirmExport={(format, options) => {
          const filename = `Laporan_Pengeluaran_Kas_${new Date().toISOString().slice(0, 10)}`;
          if (format === 'xlsx') {
            const headers = [
              'No',
              'No. Transaksi',
              'Tanggal',
              'Kategori Pengeluaran',
              'Sumber Keuangan (Dana)',
              'Uraian / Keterangan',
              'Unit',
              'Rekening Kas/Bank',
              'Jumlah (Rp)',
              'Status Nota',
              'Status Catatan',
            ];
            const rows = filteredExpenses.map((exp, idx) => [
              idx + 1,
              exp.transactionNo,
              exp.tanggal,
              exp.kategori,
              exp.sumberKeuangan ||
                (exp.kategori.includes('Dapur')
                  ? 'Kas Dapur & Uang Makan Santri'
                  : exp.kategori.includes('Gaji')
                  ? 'Kas SPP Santri & Dana BOS'
                  : 'Kas Operasional Pesantren'),
              exp.keterangan,
              exp.unit || '-',
              exp.rekening,
              `Rp ${exp.nominal.toLocaleString('id-ID')}`,
              exp.statusBukti,
              exp.status,
            ]);

            downloadExcelSpreadsheet(`${filename}.xls`, {
              title: 'REKAPITULASI LAPORAN PENGELUARAN KAS',
              subtitle: `Pondok Modern Raudhatussalam Mahato • Tanggal: ${new Date().toLocaleDateString('id-ID')}`,
              headers,
              rows,
              summary: [
                {
                  label: 'Total Pengeluaran Tercatat',
                  value: `Rp ${filteredExpenses.reduce((s, x) => s + x.nominal, 0).toLocaleString('id-ID')}`,
                },
              ],
            });
            showToast(`File ${filename}.xls berhasil diunduh ke folder Downloads!`, 'success');
          } else {
            const contentHtml = `
              <div class="kop-header">
                <div class="kop-text">
                  <h1>Pondok Modern Raudhatussalam Mahato</h1>
                  <p>Laporan Realisasi Kas Keluar (Pengeluaran Operasional & Sumber Dana)</p>
                </div>
                <div style="text-align:right;">
                  <span style="font-weight:bold;font-size:9px;">DOKUMEN KAS</span>
                  <p style="font-size:9px;color:#64748b;">${new Date().toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <h2 style="text-align:center;font-size:12px;text-transform:uppercase;">Daftar Realisasi Pengeluaran Operasional & Sumber Dana</h2>
              <table>
                <thead>
                  <tr>
                    <th style="width:25px;">No</th>
                    <th>No. Bukti</th>
                    <th>Tanggal</th>
                    <th>Kategori Belanja</th>
                    <th>Sumber Keuangan (Dana)</th>
                    <th>Uraian / Keterangan</th>
                    <th>Akun Kas</th>
                    <th style="text-align:right;">Nominal (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredExpenses.slice(0, 60).map((x, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td><strong>${x.transactionNo}</strong></td>
                      <td>${x.tanggal}</td>
                      <td>${x.kategori}</td>
                      <td><span style="font-weight:bold;color:#064E3B;">${x.sumberKeuangan || (x.kategori.includes('Dapur') ? 'Kas Dapur & Uang Makan' : x.kategori.includes('Gaji') ? 'Kas SPP & Dana BOS' : 'Kas Operasional')}</span></td>
                      <td>${x.keterangan}</td>
                      <td>${x.rekening}</td>
                      <td style="text-align:right;font-weight:bold;color:#b91c1c;">Rp ${x.nominal.toLocaleString('id-ID')}</td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr style="background:#fef2f2;font-weight:bold;">
                    <td colspan="7" style="text-align:right;color:#991b1b;">TOTAL PENGELUARAN:</td>
                    <td style="text-align:right;color:#991b1b;font-weight:900;">Rp ${filteredExpenses.reduce((s, x) => s + x.nominal, 0).toLocaleString('id-ID')}</td>
                  </tr>
                </tfoot>
              </table>
              <div class="footer-signatures">
                <div class="signature-box">
                  <p>Penerima Dana,</p>
                  <div class="signature-space"></div>
                  <p>(................................................)</p>
                </div>
                <div class="signature-box">
                  <p>Bendahara Pesantren,</p>
                  <div class="signature-space"></div>
                  <p style="text-decoration:underline;font-weight:bold;">H. Ahmad Syarif, M.Pd.</p>
                </div>
              </div>
            `;
            downloadPrintableReport(`${filename}.html`, 'Laporan Pengeluaran Kas', contentHtml);
            showToast(`File ${filename}.html berhasil diunduh ke folder Downloads!`, 'success');
          }
        }}
      />

      {/* Category Guide Modal */}
      <CategoryGuideModal
        isOpen={isCategoryGuideOpen}
        onClose={() => setIsCategoryGuideOpen(false)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Printable Cash Voucher (BPK) Modal */}
      <VoucherReceiptModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        expense={selectedVoucherExpense}
      />

      {/* Manual Configuration Modal for Categories, Institution Units, and Funding Sources */}
      <PengaturanPengeluaranModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        categories={categories}
        institutionUnits={institutionUnits}
        fundingSources={fundingSources}
        onSaveCategories={handleSaveCategories}
        onSaveInstitutionUnits={handleSaveInstitutionUnits}
        onSaveFundingSources={handleSaveFundingSources}
      />
    </div>
  );
};
