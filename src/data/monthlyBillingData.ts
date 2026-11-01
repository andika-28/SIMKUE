import { MonthlyBillRow, MonthlyBillingSummary, StudentClass, StudentUnit, MealPackageType } from '../types';

export const INITIAL_MONTHLY_BILLING_SUMMARY: MonthlyBillingSummary = {
  periode: 'Bulan Ini',
  totalTagihanNominal: 0,
  totalTagihanSantri: 0,
  lunasNominal: 0,
  lunasSantriCount: 0,
  belumLunasNominal: 0,
  belumLunasSantriCount: 0,
  persentasePembayaran: 0,
};

export const UNIT_BILLING_PERFORMANCE = [
  {
    unit: 'MTs' as StudentUnit,
    label: 'Madrasah Tsanawiyah (MTs)',
    totalTagihan: 0,
    sudahDibayar: 0,
    belumDibayar: 0,
    percentage: 0,
    santriCount: 0,
  },
  {
    unit: 'MA' as StudentUnit,
    label: 'Madrasah Aliyah (MA)',
    totalTagihan: 0,
    sudahDibayar: 0,
    belumDibayar: 0,
    percentage: 0,
    santriCount: 0,
  },
];

export const CLASS_BILLING_PERFORMANCE = [
  { kelas: 'Kelas 1' as StudentClass, percentage: 0, totalSantri: 0, lunasCount: 0, belumLunasCount: 0 },
  { kelas: 'Kelas 2' as StudentClass, percentage: 0, totalSantri: 0, lunasCount: 0, belumLunasCount: 0 },
  { kelas: 'Kelas 3' as StudentClass, percentage: 0, totalSantri: 0, lunasCount: 0, belumLunasCount: 0 },
  { kelas: 'Kelas 4' as StudentClass, percentage: 0, totalSantri: 0, lunasCount: 0, belumLunasCount: 0 },
  { kelas: 'Kelas 5' as StudentClass, percentage: 0, totalSantri: 0, lunasCount: 0, belumLunasCount: 0 },
  { kelas: 'Kelas 6' as StudentClass, percentage: 0, totalSantri: 0, lunasCount: 0, belumLunasCount: 0 },
];

export const AVAILABLE_MONTHS = [
  { id: '2026-07', label: 'Juli 2026', academicYear: '2026/2027', hasData: false },
  { id: '2026-08', label: 'Agustus 2026', academicYear: '2026/2027', hasData: false, isCurrent: true },
  { id: '2026-09', label: 'September 2026', academicYear: '2026/2027', hasData: false },
  { id: '2026-10', label: 'Oktober 2026', academicYear: '2026/2027', hasData: false },
  { id: '2026-11', label: 'November 2026', academicYear: '2026/2027', hasData: false },
  { id: '2026-12', label: 'Desember 2026', academicYear: '2026/2027', hasData: false },
];

export function generateMonthlyBillsData(periode: string = 'Agustus 2026'): MonthlyBillRow[] {
  return [];
}

export const INITIAL_MONTHLY_BILLS: MonthlyBillRow[] = [];
