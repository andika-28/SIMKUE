export interface TrendArusKasItem {
  bulan: string;
  pemasukan: number;
  pengeluaran: number;
  surplus: number;
  marginPersen?: number;
}

export interface IncomeCategoryBreakdown {
  name: string;
  nominal: number;
  percentage: number;
  color: string;
}

export interface UnitComparisonItem {
  unit: string;
  santriCount: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  surplus: number;
  collectionRate: number;
  arrears: number;
  color: string;
}

export interface BudgetRealizationItem {
  kategori: string;
  anggaran: number;
  realisasi: number;
  persen: number;
  jenis: 'pemasukan' | 'pengeluaran';
}

export interface PeriodFinancialData {
  periodKey: 'bulan_ini' | 'semester_ganjil' | 'tahunan';
  periodLabel: string;
  periodBadge: string;
  periodSubtitle: string;
  totalPemasukan: number;
  totalPengeluaran: number;
  surplus: number;
  netMargin: string;
  totalSaldoBank: number;
  runwayMonths: string;
  runwayStatus: string;
  collectionRate: string;
  lunasCount: number;
  totalSantri: number;
  tunggakan: number;
  tunggakanLabel: string;
  oerPercentage: string;
  oerStatus: string;
  avgMonthlyExpense: number;
  trendArusKas: TrendArusKasItem[];
  trendChartSubtitle: string;
  trendInsight: string;
  incomeCategories: IncomeCategoryBreakdown[];
  unitComparison: UnitComparisonItem[];
  budgetVsRealization: BudgetRealizationItem[];
}

const emptyPeriod = (
  key: 'bulan_ini' | 'semester_ganjil' | 'tahunan',
  label: string,
  badge: string,
  subtitle: string
): PeriodFinancialData => ({
  periodKey: key,
  periodLabel: label,
  periodBadge: badge,
  periodSubtitle: subtitle,
  totalPemasukan: 0,
  totalPengeluaran: 0,
  surplus: 0,
  netMargin: '0',
  totalSaldoBank: 0,
  runwayMonths: '0',
  runwayStatus: 'Kas Bersih Siap Digunakan',
  collectionRate: '0%',
  lunasCount: 0,
  totalSantri: 0,
  tunggakan: 0,
  tunggakanLabel: 'Belum ada tunggakan',
  oerPercentage: '0%',
  oerStatus: 'Normal',
  avgMonthlyExpense: 0,
  trendChartSubtitle: 'Belum ada data transaksi pada periode ini',
  trendArusKas: [],
  trendInsight: 'Belum ada data transaksi yang tercatat.',
  incomeCategories: [],
  unitComparison: [],
  budgetVsRealization: [],
});

export const ringkasanPeriodsData: Record<'bulan_ini' | 'semester_ganjil' | 'tahunan', PeriodFinancialData> = {
  bulan_ini: emptyPeriod(
    'bulan_ini',
    'Bulan Berjalan',
    'Bulan Ini',
    'Kinerja penerimaan SPP, operasional dapur santri, dan serapan anggaran bulan berjalan'
  ),
  semester_ganjil: emptyPeriod(
    'semester_ganjil',
    'Semester Ganjil 2026/2027',
    'Semester Ganjil',
    'Konsolidasi kinerja keuangan semester ganjil'
  ),
  tahunan: emptyPeriod(
    'tahunan',
    'Tahun Anggaran 2026 / 2027',
    'Tahunan',
    'Konsolidasi kinerja keuangan tahun buku berjalan'
  ),
};
