import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { SettingsNavPanel, SettingsSectionId } from './SettingsNavPanel';
import { SectionIdentitasPesantren } from './SectionIdentitasPesantren';
import { SectionTahunAjaran } from './SectionTahunAjaran';
import { SectionSemester } from './SectionSemester';
import { SectionUnitKelas } from './SectionUnitKelas';
import { SectionPaketMakan } from './SectionPaketMakan';
import { SectionJenisNominalTagihan } from './SectionJenisNominalTagihan';
import { SectionDiskonBulanan } from './SectionDiskonBulanan';
import { SectionKategoriPengeluaran } from './SectionKategoriPengeluaran';
import { SectionRekeningBank } from './SectionRekeningBank';
import { SectionPenomoranDokumen } from './SectionPenomoranDokumen';
import { SectionAturanPembayaran } from './SectionAturanPembayaran';
import { SectionFormatLaporan } from './SectionFormatLaporan';
import { SectionKeamananSistem } from './SectionKeamananSistem';

import {
  mockInstitutionIdentity,
  mockAcademicYears,
  mockSemesters,
  mockUnits,
  mockClassStructures,
  mockMealPackages,
  mockMonthlyBillTypes,
  mockAnnualBillTypes,
  mockExpenseCategories,
  mockDocumentNumbers,
  mockConfigAuditHistory,
} from '../../data/systemConfigData';

import {
  InstitutionIdentity,
  AcademicYearConfigItem,
  SemesterConfigItem,
  ClassStructureConfigItem,
  MealPackageConfigItem,
  MonthlyBillTypeConfigItem,
  AnnualBillTypeConfigItem,
  ExpenseCategoryConfigItem,
  DocumentNumberConfigItem,
} from '../../types';
import {
  getStoredInstitutionIdentity,
  saveStoredInstitutionIdentity,
} from '../../utils/institutionStorage';

interface PengaturanSistemViewProps {
  onNavigateToNav?: (navId: string) => void;
}

export const PengaturanSistemView: React.FC<PengaturanSistemViewProps> = ({
  onNavigateToNav,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('identitas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States
  const [identity, setIdentity] = useState<InstitutionIdentity>(() => getStoredInstitutionIdentity());
  const [academicYears, setAcademicYears] = useState<AcademicYearConfigItem[]>(mockAcademicYears);
  const [semesters, setSemesters] = useState<SemesterConfigItem[]>(mockSemesters);
  const [classes, setClasses] = useState<ClassStructureConfigItem[]>(mockClassStructures);
  const [mealPackages, setMealPackages] = useState<MealPackageConfigItem[]>(mockMealPackages);
  const [monthlyBills, setMonthlyBills] = useState<MonthlyBillTypeConfigItem[]>(mockMonthlyBillTypes);
  const [annualBills, setAnnualBills] = useState<AnnualBillTypeConfigItem[]>(mockAnnualBillTypes);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryConfigItem[]>(mockExpenseCategories);
  const [documentNumbers, setDocumentNumbers] = useState<DocumentNumberConfigItem[]>(mockDocumentNumbers);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers
  const handleUpdateIdentity = (updated: InstitutionIdentity) => {
    setIdentity(updated);
    saveStoredInstitutionIdentity(updated);
  };

  const handleAddAcademicYear = (newYear: AcademicYearConfigItem) => {
    setAcademicYears((prev) => [newYear, ...prev]);
  };

  const handleActivateAcademicYear = (yearId: string) => {
    setAcademicYears((prev) =>
      prev.map((y) => {
        if (y.id === yearId) {
          return { ...y, status: 'AKTIF' };
        }
        if (y.status === 'AKTIF') {
          return { ...y, status: 'SELESAI', isLocked: true };
        }
        return y;
      })
    );
  };

  const handleCloseAcademicYear = (yearId: string) => {
    setAcademicYears((prev) =>
      prev.map((y) => (y.id === yearId ? { ...y, status: 'SELESAI', isLocked: true } : y))
    );
  };

  const handleUpdateSemester = (updatedSem: SemesterConfigItem) => {
    setSemesters((prev) => prev.map((s) => (s.id === updatedSem.id ? updatedSem : s)));
  };

  const handleUpdateClass = (updatedClass: ClassStructureConfigItem) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
  };

  const handleUpdateMealPackage = (updatedPkg: MealPackageConfigItem) => {
    setMealPackages((prev) => prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)));
  };

  const handleAddMealPackage = (newPkg: MealPackageConfigItem) => {
    setMealPackages((prev) => [...prev, newPkg]);
  };

  const handleUpdateMonthlyBill = (updated: MonthlyBillTypeConfigItem) => {
    setMonthlyBills((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleUpdateAnnualBill = (updated: AnnualBillTypeConfigItem) => {
    setAnnualBills((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleAddExpenseCategory = (newCat: ExpenseCategoryConfigItem) => {
    setExpenseCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateExpenseCategory = (updatedCat: ExpenseCategoryConfigItem) => {
    setExpenseCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
  };

  const handleUpdateDocumentNumber = (updated: DocumentNumberConfigItem) => {
    setDocumentNumbers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  return (
    <div className="min-h-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <p className="text-xs font-semibold leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* 2-Column Responsive Layout: Nav Panel + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sticky Navigation Column (4 cols on lg, 3 on xl) */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20 z-10">
          <SettingsNavPanel
            activeSection={activeSection}
            onSelectSection={setActiveSection}
          />
        </div>

        {/* Right Content Area (8 cols on lg, 9 on xl) */}
        <div className="lg:col-span-8 xl:col-span-9 bg-slate-50/50 rounded-2xl">
          {activeSection === 'identitas' && (
            <SectionIdentitasPesantren
              identity={identity}
              onUpdateIdentity={handleUpdateIdentity}
              onShowToast={showToast}
            />
          )}

          {activeSection === 'tahun-ajaran' && (
            <SectionTahunAjaran
              academicYears={academicYears}
              onAddAcademicYear={handleAddAcademicYear}
              onActivateAcademicYear={handleActivateAcademicYear}
              onCloseAcademicYear={handleCloseAcademicYear}
              onShowToast={showToast}
            />
          )}

          {activeSection === 'semester' && (
            <SectionSemester
              semesters={semesters}
              onUpdateSemester={handleUpdateSemester}
              onShowToast={showToast}
            />
          )}

          {activeSection === 'unit-kelas' && (
            <SectionUnitKelas
              units={mockUnits}
              classes={classes}
              onUpdateClass={handleUpdateClass}
              onShowToast={showToast}
            />
          )}

          {activeSection === 'paket-makan' && (
            <SectionPaketMakan
              packages={mealPackages}
              onUpdatePackage={handleUpdateMealPackage}
              onAddPackage={handleAddMealPackage}
              onShowToast={showToast}
            />
          )}

          {activeSection === 'jenis-tagihan' && (
            <SectionJenisNominalTagihan
              monthlyBills={monthlyBills}
              annualBills={annualBills}
              onUpdateMonthlyBill={handleUpdateMonthlyBill}
              onUpdateAnnualBill={handleUpdateAnnualBill}
              onShowToast={showToast}
            />
          )}

          {activeSection === 'diskon' && (
            <SectionDiskonBulanan onShowToast={showToast} />
          )}

          {activeSection === 'kategori-pengeluaran' && (
            <SectionKategoriPengeluaran
              categories={expenseCategories}
              onAddCategory={handleAddExpenseCategory}
              onUpdateCategory={handleUpdateExpenseCategory}
              onShowToast={showToast}
            />
          )}

          {activeSection === 'rekening-bank' && (
            <SectionRekeningBank
              onNavigateToBankModule={() => {
                if (onNavigateToNav) onNavigateToNav('rekening-bank');
              }}
              onShowToast={showToast}
            />
          )}

          {activeSection === 'penomoran' && (
            <SectionPenomoranDokumen
              documents={documentNumbers}
              onUpdateDocument={handleUpdateDocumentNumber}
              onShowToast={showToast}
            />
          )}

          {activeSection === 'pembayaran' && (
            <SectionAturanPembayaran onShowToast={showToast} />
          )}

          {activeSection === 'laporan' && (
            <SectionFormatLaporan onShowToast={showToast} />
          )}

          {activeSection === 'keamanan' && (
            <SectionKeamananSistem
              auditLogs={mockConfigAuditHistory}
              onShowToast={showToast}
            />
          )}
        </div>
      </div>
    </div>
  );
};
