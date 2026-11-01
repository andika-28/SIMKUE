import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Plus,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Sparkles,
} from 'lucide-react';
import {
  YearlyBillRow,
  YearlyBillingFilter,
  YearlyBillingSummary,
  GenerateYearlyBillingConfig,
} from '../../types';
import {
  initialYearlySummary,
  generateAllYearlyBills,
} from '../../data/yearlyBillingData';
import { YearlyBillingSummaryCards } from './YearlyBillingSummaryCards';
import { YearlyPeriodSemesterSelector } from './YearlyPeriodSemesterSelector';
import { YearlyCompositionCards } from './YearlyCompositionCards';
import { YearlyBillingAlertBanner } from './YearlyBillingAlertBanner';
import { YearlyBillFilterToolbar } from './YearlyBillFilterToolbar';
import { YearlyBillTable } from './YearlyBillTable';
import { YearlyBillDetailDrawer } from './YearlyBillDetailDrawer';
import { YearlySemesterBreakdownAnalytics } from './YearlySemesterBreakdownAnalytics';
import { GenerateYearlyBillModal } from './GenerateYearlyBillModal';
import { YearlyReceiptModal } from './YearlyReceiptModal';
import { RecordYearlyPaymentModal } from './RecordYearlyPaymentModal';
import { downloadExcelSpreadsheet } from '../../utils/fileDownloader';

interface TagihanTahunanViewProps {
  onNavigateToStudentDetail: (nis: string) => void;
  onShowToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

export const TagihanTahunanView: React.FC<TagihanTahunanViewProps> = ({
  onNavigateToStudentDetail,
  onShowToast,
}) => {
  // Main data state
  const [academicYear, setAcademicYear] = useState<string>('2026 / 2027');
  const [selectedSemester, setSelectedSemester] = useState<string>('Semua');
  const [summary, setSummary] = useState<YearlyBillingSummary>(initialYearlySummary);
  const [bills, setBills] = useState<YearlyBillRow[]>(() =>
    generateAllYearlyBills('2026 / 2027')
  );

  // Filters State
  const [filter, setFilter] = useState<YearlyBillingFilter>({
    search: '',
    unit: 'Semua Unit',
    kelas: 'Semua Kelas',
    statusSantri: 'Semua Status',
    semester: 'Semua Semester',
    statusPembayaran: 'Semua Status',
  });

  // Modals & Drawers State
  const [selectedBillForDetail, setSelectedBillForDetail] =
    useState<YearlyBillRow | null>(null);
  const [selectedBillForReceipt, setSelectedBillForReceipt] =
    useState<YearlyBillRow | null>(null);
  const [selectedBillForPayment, setSelectedBillForPayment] =
    useState<YearlyBillRow | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Handle Semester Change from Segmented Control
  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    setFilter((prev) => ({
      ...prev,
      semester: semester === 'Semua' ? 'Semua Semester' : semester,
    }));
  };

  // Handle Filter Update
  const handleFilterChange = (newFilter: Partial<YearlyBillingFilter>) => {
    setFilter((prev) => {
      const updated = { ...prev, ...newFilter };
      // Sync segmented control if semester dropdown changed
      if (newFilter.semester !== undefined) {
        setSelectedSemester(
          newFilter.semester === 'Semua Semester' ? 'Semua' : newFilter.semester
        );
      }
      return updated;
    });
  };

  // Reset Filters
  const handleResetFilter = () => {
    setFilter({
      search: '',
      unit: 'Semua Unit',
      kelas: 'Semua Kelas',
      statusSantri: 'Semua Status',
      semester: 'Semua Semester',
      statusPembayaran: 'Semua Status',
    });
    setSelectedSemester('Semua');
    onShowToast('Filter tagihan tahunan berhasil direset', 'info');
  };

  // Filter Arrears shortcut from alert banner
  const handleFilterArrears = () => {
    setFilter((prev) => ({
      ...prev,
      statusPembayaran: 'Sebagian', // or filter out Lunas
    }));
    onShowToast('Menampilkan daftar santri yang memiliki sisa tagihan', 'warning');
  };

  // Filter by status from summary cards
  const handleFilterByStatus = (status: string) => {
    setFilter((prev) => ({
      ...prev,
      statusPembayaran: status === 'Semua Status' ? 'Semua Status' : status,
    }));
  };

  // Filter by Unit from chart
  const handleFilterByUnit = (unit: string) => {
    setFilter((prev) => ({
      ...prev,
      unit: unit,
    }));
    onShowToast(`Menampilkan tagihan santri unit ${unit}`, 'info');
  };

  // Filtered Bills calculation
  const filteredBills = useMemo(() => {
    return bills.filter((item) => {
      // 1. Search (Name or NIS)
      if (filter.search) {
        const query = filter.search.toLowerCase();
        const matchName = item.namaSantri.toLowerCase().includes(query);
        const matchNis = item.nis.toLowerCase().includes(query);
        if (!matchName && !matchNis) return false;
      }

      // 2. Unit
      if (filter.unit !== 'Semua Unit' && item.unit !== filter.unit) {
        return false;
      }

      // 3. Kelas
      if (filter.kelas !== 'Semua Kelas' && item.kelas !== filter.kelas) {
        return false;
      }

      // 4. Status Santri (Santri Baru / Santri Lama)
      if (
        filter.statusSantri !== 'Semua Status' &&
        item.statusSantri !== filter.statusSantri
      ) {
        return false;
      }

      // 5. Semester filter
      if (filter.semester === 'Semester Ganjil') {
        // Santri whose semester ganjil items are not all fully paid or checking progress
      } else if (filter.semester === 'Semester Genap') {
        // Semester genap items
      }

      // 6. Payment Status
      if (filter.statusPembayaran !== 'Semua Status') {
        if (filter.statusPembayaran === 'Lunas' && item.status !== 'LUNAS') {
          return false;
        }
        if (
          filter.statusPembayaran === 'Sebagian' &&
          item.status !== 'SEBAGIAN'
        ) {
          return false;
        }
        if (
          filter.statusPembayaran === 'Belum Dibayar' &&
          item.status !== 'BELUM DIBAYAR'
        ) {
          return false;
        }
      }

      return true;
    });
  }, [bills, filter]);

  // Handle Export Excel
  const handleExportExcel = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Santri',
      'Unit',
      'Kelas',
      'Status Santri',
      'Uang Pembangunan (Rp)',
      'Uang Kertas (Rp)',
      'Uang Kegiatan (Rp)',
      'Total Tagihan (Rp)',
      'Sudah Dibayar (Rp)',
      'Sisa Tagihan (Rp)',
      'Status',
    ];

    const rows = filteredBills.map((b) => [
      b.no,
      b.nis,
      b.namaSantri,
      b.unit,
      b.kelas,
      b.statusSantri,
      `Rp ${b.uangPembangunan.toLocaleString('id-ID')}`,
      `Rp ${b.uangKertas.toLocaleString('id-ID')}`,
      `Rp ${b.uangKegiatan.toLocaleString('id-ID')}`,
      `Rp ${b.totalTagihan.toLocaleString('id-ID')}`,
      `Rp ${b.sudahDibayar.toLocaleString('id-ID')}`,
      `Rp ${b.sisaTagihan.toLocaleString('id-ID')}`,
      b.status,
    ]);

    const filename = `Tagihan_Tahunan_${academicYear.replace(/\s|\//g, '_')}.xls`;
    downloadExcelSpreadsheet(filename, {
      title: 'DAFTAR REKAP TAGIHAN TAHUNAN SANTRI',
      subtitle: `Tahun Ajaran ${academicYear} • PM. Raudhatussalam Mahato • Tanggal: ${new Date().toLocaleDateString('id-ID')}`,
      headers,
      rows,
      summary: [
        { label: 'Total Tagihan Ditetapkan', value: `Rp ${summary.totalTarget.toLocaleString('id-ID')}` },
        { label: 'Total Pembayaran Diterima', value: `Rp ${summary.totalTerkumpul.toLocaleString('id-ID')}` },
        { label: 'Sisa Piutang Berjalan', value: `Rp ${summary.totalSisaPiutang.toLocaleString('id-ID')}` },
      ],
    });

    onShowToast(`File ${filename} berhasil diunduh ke folder Downloads!`, 'success');
  };

  // Handle Generation Success
  const handleSuccessGenerate = (config: GenerateYearlyBillingConfig) => {
    const newGeneratedBills = generateAllYearlyBills(config.tahunAjaran);
    setBills(newGeneratedBills);
    setAcademicYear(config.tahunAjaran);
    onShowToast(
      `Tagihan tahunan Tahun Ajaran ${config.tahunAjaran} berhasil di-generate untuk 300 santri aktif!`,
      'success'
    );
  };

  // Handle Payment Recording Success
  const handleSuccessPayment = (
    billId: string,
    paidAmount: number,
    paymentMethod: string
  ) => {
    setBills((prev) =>
      prev.map((item) => {
        if (item.id === billId) {
          const newSudahDibayar = item.sudahDibayar + paidAmount;
          const newSisa = Math.max(0, item.totalTagihan - newSudahDibayar);
          const newStatus: 'LUNAS' | 'SEBAGIAN' | 'BELUM DIBAYAR' =
            newSisa === 0
              ? 'LUNAS'
              : newSudahDibayar > 0
              ? 'SEBAGIAN'
              : 'BELUM DIBAYAR';
          const newPct = Math.round(
            (newSudahDibayar / item.totalTagihan) * 100
          );

          return {
            ...item,
            sudahDibayar: newSudahDibayar,
            sisaTagihan: newSisa,
            status: newStatus,
            persentaseBayar: newPct,
            tanggalBayarTerakhir: '01 September 2026',
            noReferensiTerakhir: `REF-PAY-${Date.now().toString().slice(-6)}`,
          };
        }
        return item;
      })
    );

    // Update summary
    setSummary((prev) => {
      const updatedPaid = prev.sudahDibayarNominal + paidAmount;
      const updatedSisa = Math.max(0, prev.totalTagihanNominal - updatedPaid);
      return {
        ...prev,
        sudahDibayarNominal: updatedPaid,
        sisaTagihanNominal: updatedSisa,
      };
    });

    onShowToast('Pembayaran cicilan tahunan berhasil dicatat!', 'success');
  };

  // Handle WhatsApp Reminder
  const handleSendWhatsapp = (bill: YearlyBillRow) => {
    const text = encodeURIComponent(
      `Assalamu'alaikum Wr. Wb.\n\n` +
      `Kepada Yth. ${bill.namaWali || 'Wali Santri'},\n` +
      `Kami dari Bendahara PM. Raudhatussalam Mahato menginformasikan rincian tagihan tahunan santri an. *${bill.namaSantri}* (NIS: ${bill.nis}, Kelas: ${bill.kelas}):\n\n` +
      `• Total Tagihan: Rp ${bill.totalTagihan.toLocaleString('id-ID')}\n` +
      `• Sudah Dibayar: Rp ${bill.sudahDibayar.toLocaleString('id-ID')}\n` +
      `• Sisa Tagihan: *Rp ${bill.sisaTagihan.toLocaleString('id-ID')}*\n\n` +
      `Pembayaran dapat ditransfer ke rekening BSI: 7123-456-789 an. PM Raudhatussalam.\nJazakumullah Khairan Katsiran.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onShowToast(`Menyiapkan pesan WhatsApp untuk wali ${bill.namaSantri}`, 'info');
  };

  return (
    <div id="tagihan-tahunan-page" className="space-y-6 pb-12">
      {/* 1. YEARLY BILLING SUMMARY (4 Financial Summary Cards) */}
      <section aria-label="Yearly Billing Summary">
        <YearlyBillingSummaryCards
          summary={summary}
          onFilterByStatus={handleFilterByStatus}
          selectedFilterStatus={filter.statusPembayaran}
        />
      </section>

      {/* 2. SEMESTER & ACADEMIC YEAR SELECTOR */}
      <section aria-label="Semester Selector">
        <YearlyPeriodSemesterSelector
          selectedSemester={selectedSemester}
          onSelectSemester={handleSemesterChange}
          academicYear={academicYear}
          onChangeAcademicYear={(yr) => {
            setAcademicYear(yr);
            onShowToast(`Menampilkan data Tahun Ajaran ${yr}`, 'info');
          }}
        />
      </section>

      {/* 3. ALERT SECTION */}
      {summary.santriBelumLunasCount > 0 && (
        <section aria-label="Arrears Warning">
          <YearlyBillingAlertBanner
            unpaidCount={summary.santriBelumLunasCount}
            remainingNominal={summary.sisaTagihanNominal}
            onFilterArrears={handleFilterArrears}
          />
        </section>
      )}

      {/* 4. ANNUAL BILLING BREAKDOWN (Komposisi Tagihan Tahunan) */}
      <section aria-label="Billing Composition">
        <YearlyCompositionCards summary={summary} />
      </section>

      {/* 5. MAIN BILLING SECTION & TABLE */}
      <section aria-label="Main Billing Table Section">
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          {/* Main Card Header */}
          <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
                  Daftar Tagihan Tahunan Santri
                </h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-[#064E3B] border border-emerald-200 text-[11px] font-bold rounded-md">
                  {filteredBills.length} Data
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Monitoring tagihan dan status pembayaran seluruh santri Tahun Ajaran {academicYear}.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
              <button
                type="button"
                id="btn-export-excel-yearly"
                onClick={handleExportExcel}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors shadow-2xs"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Export Excel</span>
              </button>

              <button
                type="button"
                id="btn-open-generate-yearly-modal"
                onClick={() => setIsGenerateModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#064E3B] hover:bg-[#047857] active:scale-98 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Generate Tagihan Tahunan</span>
              </button>
            </div>
          </div>

          {/* Search & Advanced Filter Toolbar */}
          <YearlyBillFilterToolbar
            filter={filter}
            onChangeFilter={handleFilterChange}
            onResetFilter={handleResetFilter}
            totalFiltered={filteredBills.length}
            totalRecords={bills.length}
          />

          {/* Financial Table */}
          <YearlyBillTable
            bills={filteredBills}
            onViewDetail={(b) => setSelectedBillForDetail(b)}
            onPrintReceipt={(b) => setSelectedBillForReceipt(b)}
            onRecordPayment={(b) => setSelectedBillForPayment(b)}
            onSendWhatsapp={handleSendWhatsapp}
            onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
          />
        </div>
      </section>

      {/* 6. SEMESTER PAYMENT BREAKDOWN & BILLING STATUS ANALYSIS */}
      <section aria-label="Billing Performance & Analytics">
        <YearlySemesterBreakdownAnalytics
          summary={summary}
          onFilterByStatus={handleFilterByStatus}
          onFilterByUnit={handleFilterByUnit}
        />
      </section>

      {/* 7. BILL DETAIL DRAWER */}
      <YearlyBillDetailDrawer
        isOpen={Boolean(selectedBillForDetail)}
        bill={selectedBillForDetail}
        onClose={() => setSelectedBillForDetail(null)}
        onNavigateToStudentDetail={onNavigateToStudentDetail}
        onPrintReceipt={(b) => {
          setSelectedBillForDetail(null);
          setSelectedBillForReceipt(b);
        }}
      />

      {/* 8. PRINTABLE RECEIPT MODAL */}
      <YearlyReceiptModal
        isOpen={Boolean(selectedBillForReceipt)}
        bill={selectedBillForReceipt}
        onClose={() => setSelectedBillForReceipt(null)}
      />

      {/* 9. RECORD PAYMENT MODAL */}
      <RecordYearlyPaymentModal
        isOpen={Boolean(selectedBillForPayment)}
        bill={selectedBillForPayment}
        onClose={() => setSelectedBillForPayment(null)}
        onSuccessPayment={handleSuccessPayment}
      />

      {/* 10. GENERATE ANNUAL BILL MODAL */}
      <GenerateYearlyBillModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSuccessGenerate={handleSuccessGenerate}
        existingAcademicYears={['2026 / 2027']}
      />
    </div>
  );
};
