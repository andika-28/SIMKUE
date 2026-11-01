import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Sparkles,
  Layers,
  FileCheck,
  Plus,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { MonthlyBillingSummaryCards } from './MonthlyBillingSummaryCards';
import { MonthPeriodSelector } from './MonthPeriodSelector';
import { QuickAlertBanner } from './QuickAlertBanner';
import { MonthlyBillFilterToolbar } from './MonthlyBillFilterToolbar';
import { MonthlyBillTable } from './MonthlyBillTable';
import { BillingPerformanceSection } from './BillingPerformanceSection';
import { BillDetailDrawer } from './BillDetailDrawer';
import { GenerateMonthlyBillModal } from './GenerateMonthlyBillModal';
import { BillReceiptModal } from './BillReceiptModal';
import {
  generateMonthlyBillsData,
  INITIAL_MONTHLY_BILLING_SUMMARY,
} from '../../data/monthlyBillingData';
import { downloadExcelSpreadsheet } from '../../utils/fileDownloader';
import {
  MonthlyBillRow,
  MonthlyBillingSummary,
  MonthlyBillingFilter,
} from '../../types';

interface TagihanBulananViewProps {
  onViewStudentDetail: (nis: string) => void;
  onShowToast: (message: string) => void;
  onNavigateToGenerate?: () => void;
}

export const TagihanBulananView: React.FC<TagihanBulananViewProps> = ({
  onViewStudentDetail,
  onShowToast,
  onNavigateToGenerate,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Agustus 2026');
  const [bills, setBills] = useState<MonthlyBillRow[]>(() =>
    generateMonthlyBillsData('Agustus 2026')
  );

  // Filters State
  const [filters, setFilters] = useState<MonthlyBillingFilter>({
    search: '',
    unit: 'Semua Unit',
    kelas: 'Semua Kelas',
    status: 'Semua Status',
    paketMakan: 'Semua Paket',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Drawer State
  const [selectedBillForDrawer, setSelectedBillForDrawer] = useState<MonthlyBillRow | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [selectedBillForReceipt, setSelectedBillForReceipt] = useState<MonthlyBillRow | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  // Handle Month Switch
  const handleSelectPeriod = (newPeriod: string) => {
    setSelectedPeriod(newPeriod);
    setCurrentPage(1);
    const newBills = generateMonthlyBillsData(newPeriod);
    setBills(newBills);
    onShowToast(`Beralih ke tagihan periode ${newPeriod}`);
  };

  // Filter change handlers
  const handleFilterChange = (key: keyof MonthlyBillingFilter, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      unit: 'Semua Unit',
      kelas: 'Semua Kelas',
      status: 'Semua Status',
      paketMakan: 'Semua Paket',
    });
    setCurrentPage(1);
    onShowToast('Filter pencarian berhasil direset.');
  };

  // Filter by status quick button from cards
  const handleFilterByStatus = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1);
    onShowToast(`Menampilkan tagihan berstatus: ${status}`);
  };

  // Filtered dataset
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      // Search by Name or NIS
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = b.namaSantri.toLowerCase().includes(query);
        const matchesNIS = b.nis.toLowerCase().includes(query);
        if (!matchesName && !matchesNIS) return false;
      }

      // Unit
      if (filters.unit !== 'Semua Unit' && b.unit !== filters.unit) {
        return false;
      }

      // Kelas
      if (filters.kelas !== 'Semua Kelas' && b.kelas !== filters.kelas) {
        return false;
      }

      // Status
      if (filters.status !== 'Semua Status') {
        const targetStatus = filters.status.toUpperCase();
        if (b.status !== targetStatus) return false;
      }

      // Paket Makan
      if (filters.paketMakan !== 'Semua Paket' && b.paketMakan !== filters.paketMakan) {
        return false;
      }

      return true;
    });
  }, [bills, filters]);

  // Recalculate summary from actual bills
  const summary: MonthlyBillingSummary = useMemo(() => {
    const totalSantri = bills.length;
    let totalNominal = 0;
    let lunasNominal = 0;
    let lunasCount = 0;
    let belumLunasNominal = 0;
    let belumLunasCount = 0;

    bills.forEach((b) => {
      totalNominal += b.totalTagihan;
      if (b.status === 'LUNAS') {
        lunasNominal += b.totalTagihan;
        lunasCount++;
      } else {
        belumLunasNominal += b.totalTagihan;
        belumLunasCount++;
      }
    });

    const pct = totalNominal > 0 ? (lunasNominal / totalNominal) * 100 : 0;

    return {
      periode: selectedPeriod,
      totalTagihanNominal: totalNominal,
      totalTagihanSantri: totalSantri,
      lunasNominal,
      lunasSantriCount: lunasCount,
      belumLunasNominal,
      belumLunasSantriCount: belumLunasCount,
      persentasePembayaran: pct,
    };
  }, [bills, selectedPeriod]);

  // Drawer handlers
  const handleOpenDetail = (bill: MonthlyBillRow) => {
    setSelectedBillForDrawer(bill);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handlePrintBill = (bill: MonthlyBillRow) => {
    setSelectedBillForReceipt(bill);
    setIsReceiptModalOpen(true);
  };

  // Toggle status inside drawer or table
  const handleMarkStatusToggle = (bill: MonthlyBillRow) => {
    const updatedStatus = bill.status === 'LUNAS' ? 'BELUM LUNAS' : 'LUNAS';
    const updatedBills = bills.map((b) => {
      if (b.id === bill.id) {
        return {
          ...b,
          status: updatedStatus as 'LUNAS' | 'BELUM LUNAS',
          tanggalPembayaran: updatedStatus === 'LUNAS' ? '01 September 2026' : undefined,
          noReferensi: updatedStatus === 'LUNAS' ? `PAY-2026-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
          sumberPembayaran: updatedStatus === 'LUNAS' ? 'Kasir Tunai Pesantren' : undefined,
        };
      }
      return b;
    });

    setBills(updatedBills);
    if (selectedBillForDrawer && selectedBillForDrawer.id === bill.id) {
      setSelectedBillForDrawer((prev) =>
        prev
          ? {
              ...prev,
              status: updatedStatus as 'LUNAS' | 'BELUM LUNAS',
              tanggalPembayaran: updatedStatus === 'LUNAS' ? '01 September 2026' : undefined,
              noReferensi: updatedStatus === 'LUNAS' ? `PAY-2026-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
              sumberPembayaran: updatedStatus === 'LUNAS' ? 'Kasir Tunai Pesantren' : undefined,
            }
          : null
      );
    }
    onShowToast(`Status tagihan ${bill.namaSantri} diubah menjadi ${updatedStatus}.`);
  };

  // Generate confirmation callback
  const handleConfirmGenerate = (
    period: string,
    unit: string,
    applyDiscount: boolean,
    discountAmount: number
  ) => {
    setSelectedPeriod(period);
    const newGenerated = generateMonthlyBillsData(period).map((item) => {
      if (applyDiscount && (unit === 'Semua Unit' || item.unit === unit)) {
        const newTotal = Math.max(0, item.spp + item.uangMakan + item.listrikAir - discountAmount);
        return {
          ...item,
          diskon: discountAmount,
          diskonKeterangan: 'Potongan Khusus Periode',
          totalTagihan: newTotal,
        };
      }
      return item;
    });

    setBills(newGenerated);
    setCurrentPage(1);
    onShowToast(`Berhasil men-generate 300 tagihan santri untuk periode ${period}!`);
  };

  // Export Excel action
  const handleExportExcel = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Santri',
      'Kelas',
      'Unit',
      'Status Santri',
      'Uang Makan',
      'SPP',
      'Listrik & Air',
      'Diskon/Potongan',
      'Total Tagihan',
      'Sudah Dibayar',
      'Sisa Tagihan',
      'Status',
    ];

    const rows = filteredBills.map((b) => [
      b.no,
      b.nis,
      b.namaSantri,
      b.kelas,
      b.unit,
      b.statusSantri,
      `Rp ${b.uangMakan.toLocaleString('id-ID')}`,
      `Rp ${b.spp.toLocaleString('id-ID')}`,
      `Rp ${b.listrikAir.toLocaleString('id-ID')}`,
      `Rp ${b.potongan.toLocaleString('id-ID')}`,
      `Rp ${b.totalTagihan.toLocaleString('id-ID')}`,
      `Rp ${b.sudahDibayar.toLocaleString('id-ID')}`,
      `Rp ${b.sisaTagihan.toLocaleString('id-ID')}`,
      b.status,
    ]);

    const cleanPeriod = selectedPeriod.replace(/\s+/g, '_');
    downloadExcelSpreadsheet(`Tagihan_Bulanan_${cleanPeriod}.xls`, {
      title: `DAFTAR TAGIHAN BULANAN - ${selectedPeriod.toUpperCase()}`,
      subtitle: `Unit: ${filters.unit} • Kelas: ${filters.kelas} • Status: ${filters.status}`,
      headers,
      rows,
      summary: [
        { label: 'Total Estimasi Tagihan', value: `Rp ${summary.totalTagihanNominal.toLocaleString('id-ID')}` },
        { label: 'Sudah Diterima (Lunas)', value: `Rp ${summary.lunasNominal.toLocaleString('id-ID')}` },
        { label: 'Sisa Belum Dibayar', value: `Rp ${summary.belumLunasNominal.toLocaleString('id-ID')}` },
      ],
    });

    onShowToast(`File Tagihan_Bulanan_${cleanPeriod}.xls berhasil diunduh ke folder Downloads!`);
  };

  const handleSendReminders = () => {
    onShowToast(`Notifikasi pengingat tagihan WhatsApp disiapkan untuk 60 santri belum lunas.`);
  };

  return (
    <div id="tagihan-bulanan-page" className="space-y-6 pb-12">
      {/* 1. Four Financial Summary Cards */}
      <MonthlyBillingSummaryCards
        summary={summary}
        onFilterByStatus={handleFilterByStatus}
      />

      {/* 2. Month Period Selector */}
      <MonthPeriodSelector
        currentPeriod={selectedPeriod}
        onSelectPeriod={handleSelectPeriod}
        onGenerateClick={onNavigateToGenerate || (() => setIsGenerateModalOpen(true))}
      />

      {/* 3. Quick Alert Section */}
      {summary.belumLunasSantriCount > 0 && (
        <QuickAlertBanner
          unpaidCount={summary.belumLunasSantriCount}
          unpaidNominal={summary.belumLunasNominal}
          periode={selectedPeriod}
          onFilterUnpaid={() => handleFilterByStatus('Belum Lunas')}
          onSendReminders={handleSendReminders}
        />
      )}

      {/* 4. Main Billing Section */}
      <div
        id="main-billing-section"
        className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        {/* Section Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
              Daftar Tagihan Santri
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              300 Tagihan Santri untuk periode {selectedPeriod}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
            {/* Secondary Button: Export Excel */}
            <button
              type="button"
              id="btn-export-excel"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Excel</span>
            </button>

            {/* Primary Button: + Generate Tagihan */}
            <button
              type="button"
              id="btn-open-generate-modal"
              onClick={onNavigateToGenerate || (() => setIsGenerateModalOpen(true))}
              className="flex items-center gap-2 px-4 py-2 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Tagihan</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <MonthlyBillFilterToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredBills.length}
          totalAll={bills.length}
        />

        {/* Table & Pagination */}
        <MonthlyBillTable
          bills={filteredBills}
          totalAll={bills.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          onViewDetail={handleOpenDetail}
          onPrintBill={handlePrintBill}
          onViewStudentDetail={onViewStudentDetail}
          onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
        />
      </div>

      {/* 5. Billing Performance Section (Analytics) */}
      <BillingPerformanceSection />

      {/* Drawers & Modals */}
      <BillDetailDrawer
        bill={selectedBillForDrawer}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onViewStudentDetail={(nis) => {
          handleCloseDrawer();
          onViewStudentDetail(nis);
        }}
        onPrintBill={(bill) => {
          handleCloseDrawer();
          handlePrintBill(bill);
        }}
        onMarkStatusToggle={handleMarkStatusToggle}
      />

      <GenerateMonthlyBillModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        currentPeriod={selectedPeriod}
        onConfirmGenerate={handleConfirmGenerate}
      />

      <BillReceiptModal
        bill={selectedBillForReceipt}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
};
