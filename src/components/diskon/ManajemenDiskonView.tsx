import React, { useState, useMemo } from 'react';
import {
  Tag,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import {
  BillingDiscount,
  DiscountAdjustmentHistory,
  DiscountFilterState,
  DiscountKPIStats,
  DiscountStatus,
} from '../../types';
import {
  initialDiscounts,
  initialAdjustmentHistories,
  initialDiscountKPI,
} from '../../data/discountData';
import { DiscountSummaryCards } from './DiscountSummaryCards';
import { DiscountPeriodFilterBar } from './DiscountPeriodFilterBar';
import { DiscountTableToolbar } from './DiscountTableToolbar';
import { DiscountTable } from './DiscountTable';
import { DiscountDetailDrawer } from './DiscountDetailDrawer';
import { CreateDiscountModal } from './CreateDiscountModal';
import { ActivateDiscountConfirmationModal } from './ActivateDiscountConfirmationModal';
import { DiscountAdjustmentModal } from './DiscountAdjustmentModal';
import { DiscountAdjustmentHistoryTable } from './DiscountAdjustmentHistoryTable';
import { DiscountImpactAnalytics } from './DiscountImpactAnalytics';
import { DiscountProtectionBanner } from './DiscountProtectionBanner';

interface ManajemenDiskonViewProps {
  onNavigateToGenerate?: () => void;
}

export const ManajemenDiskonView: React.FC<ManajemenDiskonViewProps> = ({
  onNavigateToGenerate,
}) => {
  // State
  const [discounts, setDiscounts] = useState<BillingDiscount[]>(initialDiscounts);
  const [adjustments, setAdjustments] = useState<DiscountAdjustmentHistory[]>(
    initialAdjustmentHistories
  );
  const [kpi, setKpi] = useState<DiscountKPIStats>(initialDiscountKPI);

  // Global Period Filters
  const [selectedMonth, setSelectedMonth] = useState<string>('Agustus 2026');
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<string>('2026 / 2027');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua Status');

  // Table-specific Filters
  const [filter, setFilter] = useState<DiscountFilterState>({
    search: '',
    periodeBulan: 'Agustus 2026',
    tahunAjaran: '2026 / 2027',
    status: 'Semua Status',
    jenisTagihan: 'Semua Jenis',
    targetDiskon: 'Semua Target',
  });

  // Modal & Drawer visibility states
  const [selectedDiscountForDetail, setSelectedDiscountForDetail] =
    useState<BillingDiscount | null>(null);
  const [selectedDiscountForEdit, setSelectedDiscountForEdit] =
    useState<BillingDiscount | null>(null);
  const [selectedDiscountForAdjustment, setSelectedDiscountForAdjustment] =
    useState<BillingDiscount | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isConfirmActivateModalOpen, setIsConfirmActivateModalOpen] =
    useState<boolean>(false);
  const [pendingDiscountToSave, setPendingDiscountToSave] =
    useState<Omit<BillingDiscount, 'id' | 'no' | 'tanggalDibuat'> | null>(null);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync selected status from filter bar or cards
  const handleFilterByStatus = (status: string) => {
    setSelectedStatus(status);
    setFilter((prev) => ({ ...prev, status }));
  };

  // Filtered Discounts based on selected month, academic year, status, search, and dropdowns
  const filteredDiscounts = useMemo(() => {
    return discounts.filter((item) => {
      // Month Filter
      if (selectedMonth !== 'Semua Periode' && item.periode !== selectedMonth) {
        return false;
      }
      // Academic Year Filter
      if (
        selectedAcademicYear !== '' &&
        item.tahunAjaran !== selectedAcademicYear
      ) {
        return false;
      }
      // Status Filter
      if (selectedStatus !== 'Semua Status') {
        const normSelected = selectedStatus.toUpperCase();
        const normItem = item.status.toUpperCase();
        if (normItem !== normSelected) return false;
      }
      // Search
      if (filter.search.trim() !== '') {
        const q = filter.search.toLowerCase();
        const matchName = item.namaDiskon.toLowerCase().includes(q);
        const matchReason = item.alasan.toLowerCase().includes(q);
        const matchTarget = item.targetDetail.toLowerCase().includes(q);
        const matchCreator = item.dibuatOleh.toLowerCase().includes(q);
        if (!matchName && !matchReason && !matchTarget && !matchCreator) {
          return false;
        }
      }
      // Jenis Tagihan Filter
      if (
        filter.jenisTagihan !== 'Semua Jenis' &&
        item.jenisTagihan !== filter.jenisTagihan
      ) {
        return false;
      }
      // Target Diskon Filter
      if (
        filter.targetDiskon !== 'Semua Target' &&
        item.targetDiskon !== filter.targetDiskon
      ) {
        return false;
      }

      return true;
    });
  }, [discounts, selectedMonth, selectedAcademicYear, selectedStatus, filter]);

  // Handler: Save from Create / Edit Modal
  const handleSaveDiscount = (
    discountData: Omit<BillingDiscount, 'id' | 'no' | 'tanggalDibuat'>,
    asActive: boolean
  ) => {
    if (asActive) {
      setPendingDiscountToSave(discountData);
      setIsConfirmActivateModalOpen(true);
    } else {
      // Save as DRAFT directly
      saveDiscountRecord(discountData, 'DRAFT');
      setIsCreateModalOpen(false);
      setSelectedDiscountForEdit(null);
      showToast('Diskon berhasil disimpan sebagai Draft.');
    }
  };

  // Handler: Confirm Activation
  const handleConfirmActivation = () => {
    if (pendingDiscountToSave) {
      saveDiscountRecord(pendingDiscountToSave, 'AKTIF');
      setIsConfirmActivateModalOpen(false);
      setIsCreateModalOpen(false);
      setSelectedDiscountForEdit(null);
      setPendingDiscountToSave(null);
      showToast('Diskon berhasil diaktifkan untuk periode yang dipilih.');
    }
  };

  const saveDiscountRecord = (
    discountData: Omit<BillingDiscount, 'id' | 'no' | 'tanggalDibuat'>,
    status: DiscountStatus
  ) => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')} Agu 2026`;

    if (selectedDiscountForEdit) {
      // Edit existing
      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === selectedDiscountForEdit.id
            ? {
                ...d,
                ...discountData,
                status,
                terakhirDiubahOleh: 'Administrator',
                tanggalDiubah: formattedDate,
              }
            : d
        )
      );
    } else {
      // Create new
      const newId = `dsc-${(discounts.length + 1).toString().padStart(3, '0')}`;
      const newDiscount: BillingDiscount = {
        id: newId,
        no: discounts.length + 1,
        ...discountData,
        status,
        tanggalDibuat: formattedDate,
      };
      setDiscounts((prev) => [newDiscount, ...prev]);

      // Update KPI
      if (status === 'AKTIF') {
        setKpi((prev) => ({
          ...prev,
          jumlahDiskonAktif: prev.jumlahDiskonAktif + 1,
          totalDiskonBulanIni: prev.totalDiskonBulanIni + discountData.estimasiTotalDiskon,
          totalDiskonTahunIni: prev.totalDiskonTahunIni + discountData.estimasiTotalDiskon,
        }));
      }
    }
  };

  // Handler: Toggle Status (Aktifkan / Batalkan)
  const handleToggleStatus = (
    discount: BillingDiscount,
    newStatus: DiscountStatus
  ) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === discount.id ? { ...d, status: newStatus } : d))
    );
    showToast(
      `Status diskon "${discount.namaDiskon}" diubah menjadi ${newStatus}.`
    );
  };

  // Handler: Save Adjustment
  const handleSaveAdjustment = (
    adjustmentData: Omit<DiscountAdjustmentHistory, 'id'>
  ) => {
    const newId = `adj-${(adjustments.length + 1).toString().padStart(3, '0')}`;
    const newAdj: DiscountAdjustmentHistory = {
      id: newId,
      ...adjustmentData,
    };
    setAdjustments((prev) => [newAdj, ...prev]);

    // Update the nominal in discounts list too
    setDiscounts((prev) =>
      prev.map((d) =>
        d.id === adjustmentData.discountId
          ? {
              ...d,
              nominalDiskon: adjustmentData.diskonBaru,
              nominalAkhir: Math.max(
                0,
                d.nominalNormal - adjustmentData.diskonBaru
              ),
              estimasiTotalDiskon:
                adjustmentData.diskonBaru * d.santriTerdampakCount,
              terakhirDiubahOleh: 'Administrator',
              tanggalDiubah: adjustmentData.tanggal,
            }
          : d
      )
    );

    setIsSelectedDiscountForAdjustmentNull();
    showToast('Penyesuaian diskon resmi berhasil dicatat dalam buku audit.');
  };

  const setIsSelectedDiscountForAdjustmentNull = () => {
    setSelectedDiscountForAdjustment(null);
  };

  const resetFilters = () => {
    setFilter({
      search: '',
      periodeBulan: 'Agustus 2026',
      tahunAjaran: '2026 / 2027',
      status: 'Semua Status',
      jenisTagihan: 'Semua Jenis',
      targetDiskon: 'Semua Target',
    });
    setSelectedMonth('Agustus 2026');
    setSelectedAcademicYear('2026 / 2027');
    setSelectedStatus('Semua Status');
  };

  return (
    <div id="view-manajemen-diskon-tagihan" className="space-y-6 pb-12">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-70 bg-[#064E3B] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-400 animate-in slide-in-from-top-4 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Keuangan</span>
            <span>/</span>
            <span>Tagihan</span>
            <span>/</span>
            <span className="text-[#064E3B] font-bold">
              Manajemen Diskon Tagihan
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Manajemen Diskon Tagihan
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Konfigurasi, kontrol, dan rekam audit potongan manual tagihan santri per periode.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {onNavigateToGenerate && (
            <button
              type="button"
              id="btn-quick-nav-generate-billing"
              onClick={onNavigateToGenerate}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-300 shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#064E3B]" />
              <span>Ke Generate Tagihan</span>
            </button>
          )}

          <button
            type="button"
            id="btn-header-create-discount"
            onClick={() => {
              setSelectedDiscountForEdit(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Diskon Baru</span>
          </button>
        </div>
      </div>

      {/* 1. Summary KPI Cards (4 Cards) */}
      <DiscountSummaryCards
        kpi={kpi}
        selectedStatus={selectedStatus}
        onFilterByStatus={handleFilterByStatus}
      />

      {/* 2. Period Filter Bar */}
      <DiscountPeriodFilterBar
        selectedMonth={selectedMonth}
        onChangeMonth={(m) => {
          setSelectedMonth(m);
          setFilter((prev) => ({ ...prev, periodeBulan: m }));
        }}
        selectedAcademicYear={selectedAcademicYear}
        onChangeAcademicYear={(y) => {
          setSelectedAcademicYear(y);
          setFilter((prev) => ({ ...prev, tahunAjaran: y }));
        }}
        selectedStatus={selectedStatus}
        onChangeStatus={(s) => {
          setSelectedStatus(s);
          setFilter((prev) => ({ ...prev, status: s }));
        }}
        onOpenCreateModal={() => {
          setSelectedDiscountForEdit(null);
          setIsCreateModalOpen(true);
        }}
      />

      {/* 3. Main Discount List Card */}
      <div
        id="card-main-discount-list"
        className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        {/* Card Header & Subtitle */}
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#064E3B]" />
              <h3 className="text-base font-bold text-slate-900">
                Daftar Diskon
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Riwayat dan konfigurasi diskon tagihan berdasarkan periode.
            </p>
          </div>
        </div>

        {/* Toolbar with search, filters, reset */}
        <DiscountTableToolbar
          filter={filter}
          onChangeFilter={(updates) =>
            setFilter((prev) => ({ ...prev, ...updates }))
          }
          onResetFilter={resetFilters}
          totalFiltered={filteredDiscounts.length}
          totalRecords={discounts.length}
        />

        {/* Discount Table */}
        <DiscountTable
          discounts={filteredDiscounts}
          onViewDetail={(item) => setSelectedDiscountForDetail(item)}
          onEditDiscount={(item) => {
            setSelectedDiscountForEdit(item);
            setIsCreateModalOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          onOpenAdjustmentModal={(item) => setSelectedDiscountForAdjustment(item)}
          onOpenCreateModal={() => {
            setSelectedDiscountForEdit(null);
            setIsCreateModalOpen(true);
          }}
        />
      </div>

      {/* 4. Discount Impact Analytics (3 Cards: Donut, Bar, Distribution) */}
      <DiscountImpactAnalytics />

      {/* 5. Discount Adjustment History Table */}
      <DiscountAdjustmentHistoryTable histories={adjustments} />

      {/* 6. Protection & Integrity Guidelines Banner */}
      <DiscountProtectionBanner />

      {/* Modals & Drawers */}

      {/* Detail Drawer */}
      <DiscountDetailDrawer
        isOpen={Boolean(selectedDiscountForDetail)}
        onClose={() => setSelectedDiscountForDetail(null)}
        discount={selectedDiscountForDetail}
        onEditDiscount={(d) => {
          setSelectedDiscountForDetail(null);
          setSelectedDiscountForEdit(d);
          setIsCreateModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        onOpenAdjustmentModal={(d) => {
          setSelectedDiscountForDetail(null);
          setSelectedDiscountForAdjustment(d);
        }}
      />

      {/* Create / Edit Discount Modal */}
      <CreateDiscountModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedDiscountForEdit(null);
        }}
        onSaveDiscount={handleSaveDiscount}
        initialData={selectedDiscountForEdit}
      />

      {/* Confirmation Modal */}
      <ActivateDiscountConfirmationModal
        isOpen={isConfirmActivateModalOpen}
        onClose={() => setIsConfirmActivateModalOpen(false)}
        discountData={pendingDiscountToSave}
        onConfirm={handleConfirmActivation}
      />

      {/* Adjustment Modal */}
      <DiscountAdjustmentModal
        isOpen={Boolean(selectedDiscountForAdjustment)}
        onClose={setIsSelectedDiscountForAdjustmentNull}
        discount={selectedDiscountForAdjustment}
        onSaveAdjustment={handleSaveAdjustment}
      />
    </div>
  );
};
