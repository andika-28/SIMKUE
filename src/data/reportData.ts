import {
  AuditTransactionReportItem,
  BankPositionReportItem,
  DailyTransactionJournal,
  ExpenseBreakdownItem,
  ExpenseDetailRecord,
  GeneratedReportAuditRecord,
  IncomeBreakdownItem,
  MonthlyComparisonPoint,
  ReportCardMeta,
  ReportPeriodType,
  StudentArrearsReportItem,
  StudentPaymentStatusStats,
  UnitFinancialReport,
} from '../types';

// =========================================================================
// EXECUTIVE FINANCIAL SUMMARY (MULTI-PERIODE)
// =========================================================================
export interface PeriodFinancialSummary {
  periodType: ReportPeriodType;
  periodLabel: string;
  periodTypeLabel: string;
  dateRangeText: string;
  totalPemasukan: number;
  pemasukanPeriod: string;
  pemasukanTrend: string;
  totalPengeluaran: number;
  pengeluaranPeriod: string;
  pengeluaranTrend: string;
  surplusPeriode: number;
  surplusFormula: string;
  totalSaldoBank: number;
  saldoSubtitle: string;
  saldoAwal: number;
  saldoAkhir: number;
  lastUpdated: string;
  verifiedBy: string;
  statusData: string;
}

const createEmptySummary = (type: ReportPeriodType, label: string, typeLabel: string): PeriodFinancialSummary => ({
  periodType: type,
  periodLabel: label,
  periodTypeLabel: typeLabel,
  dateRangeText: label,
  totalPemasukan: 0,
  pemasukanPeriod: label,
  pemasukanTrend: '0 Transaksi Masuk',
  totalPengeluaran: 0,
  pengeluaranPeriod: label,
  pengeluaranTrend: '0 Transaksi Keluar',
  surplusPeriode: 0,
  surplusFormula: 'Pemasukan - Pengeluaran',
  totalSaldoBank: 0,
  saldoSubtitle: 'Kas & Rekening Operasional',
  saldoAwal: 0,
  saldoAkhir: 0,
  lastUpdated: 'Belum ada transaksi',
  verifiedBy: 'Sistem Terintegrasi',
  statusData: 'VALID',
});

export const periodFinancialSummaries: Record<ReportPeriodType, PeriodFinancialSummary> = {
  hari_ini: createEmptySummary('hari_ini', 'Hari Ini', 'Harian (Hari Ini)'),
  minggu_ini: createEmptySummary('minggu_ini', 'Pekan Ini', 'Mingguan'),
  bulan_ini: createEmptySummary('bulan_ini', 'Bulan Berjalan', 'Bulanan'),
  semester_ini: createEmptySummary('semester_ini', 'Semester Berjalan', 'Semester'),
  tahun_ini: createEmptySummary('tahun_ini', 'Tahun Berjalan', 'Tahunan'),
  custom: createEmptySummary('custom', 'Kustom', 'Rentang Kustom'),
};

export const getFinancialSummary = (periodType: ReportPeriodType): PeriodFinancialSummary => {
  return periodFinancialSummaries[periodType] || periodFinancialSummaries.bulan_ini;
};

export const reportExecutiveSummary = periodFinancialSummaries.bulan_ini;

// =========================================================================
// REPORT METADATA CARDS
// =========================================================================
export const reportCardsCatalog: ReportCardMeta[] = [
  {
    id: 'buku_kas_umum',
    title: 'Buku Kas Umum (BKU)',
    description: 'Buku jurnal kas umum resmi pencatatan debit, kredit, dan saldo berjalan seluruh transaksi keuangan pesantren.',
    iconName: 'BookOpen',
    dataIncluded: [
      'Penerimaan (Debit)',
      'Pengeluaran (Kredit)',
      'Saldo Berjalan',
      'Kas Tunai Bendahara',
      'Rekening Bank Operasional',
      'Rekapitulasi Fisik Kas',
    ],
    badge: 'Format Standar BKU',
    category: 'Utama',
  },
  {
    id: 'pemasukan',
    title: 'Laporan Pemasukan',
    description: 'Ringkasan seluruh pemasukan pesantren berdasarkan sumber pendapatan.',
    iconName: 'TrendingUp',
    dataIncluded: [
      'SPP',
      'Uang Makan',
      'Listrik & Air',
      'Uang Pembangunan',
      'Uang Kertas',
      'Uang Kegiatan',
      'Pemasukan Lainnya',
    ],
    badge: 'Real-Time',
    category: 'Utama',
  },
  {
    id: 'pengeluaran',
    title: 'Laporan Pengeluaran',
    description: 'Rincian seluruh pengeluaran berdasarkan kategori dan periode.',
    iconName: 'TrendingDown',
    dataIncluded: [
      'Gaji Guru',
      'Gaji Karyawan',
      'Belanja Dapur',
      'Listrik',
      'Air',
      'Internet',
      'ATK',
      'Perawatan',
      'Kegiatan',
      'Transportasi',
      'Kesehatan',
      'Pembelian Aset',
      'Lainnya',
    ],
    badge: 'Audit Nota',
    category: 'Utama',
  },
  {
    id: 'harian',
    title: 'Laporan Harian',
    description: 'Ringkasan aktivitas keuangan dalam satu hari.',
    iconName: 'Calendar',
    showMetrics: [
      'Pemasukan Hari Ini',
      'Pengeluaran Hari Ini',
      'Transaksi Masuk',
      'Transaksi Keluar',
      'Saldo Akhir Hari',
    ],
    badge: '01 Sep 2026',
    category: 'Operasional',
  },
  {
    id: 'bulanan',
    title: 'Laporan Bulanan',
    description: 'Ringkasan lengkap kondisi keuangan setiap bulan.',
    iconName: 'CalendarDays',
    showMetrics: [
      'Total Pemasukan',
      'Total Pengeluaran',
      'Surplus / Defisit',
      'Saldo Awal',
      'Saldo Akhir',
    ],
    badge: 'Agustus 2026',
    category: 'Utama',
  },
  {
    id: 'semester',
    title: 'Laporan Semester',
    description: 'Ringkasan keuangan untuk Semester Ganjil atau Genap.',
    iconName: 'BookOpen',
    options: ['Semester Ganjil', 'Semester Genap'],
    badge: 'Ganjil 26/27',
    category: 'Utama',
  },
  {
    id: 'tahunan',
    title: 'Laporan Tahunan',
    description: 'Laporan keuangan lengkap berdasarkan tahun ajaran.',
    iconName: 'CalendarRange',
    showMetrics: [
      'Total Pendapatan',
      'Total Pengeluaran',
      'Total Saldo',
      'Tren Bulanan',
      'Perbandingan Bulan',
    ],
    badge: 'TA 2026/2027',
    category: 'Utama',
  },
  {
    id: 'pembayaran_santri',
    title: 'Laporan Pembayaran Santri',
    description: 'Monitoring seluruh pembayaran santri.',
    iconName: 'Users',
    showMetrics: [
      'Santri Lunas',
      'Santri Belum Lunas',
      'Total Pembayaran',
      'Pembayaran Bulanan',
      'Pembayaran Tahunan',
    ],
    badge: '300 Santri',
    category: 'Santri',
  },
  {
    id: 'tunggakan',
    title: 'Laporan Tunggakan',
    description: 'Daftar santri yang masih memiliki tagihan.',
    iconName: 'AlertCircle',
    showMetrics: [
      'Total Tunggakan',
      'Jumlah Santri Menunggak',
      'Tunggakan Bulanan',
      'Tunggakan Tahunan',
      'Santri Tunggakan Terbesar',
    ],
    badge: '45 Santri',
    category: 'Santri',
  },
  {
    id: 'rekening_bank',
    title: 'Laporan Rekening Bank',
    description: 'Monitoring saldo dan mutasi seluruh rekening pesantren.',
    iconName: 'Building2',
    showMetrics: [
      'Saldo Per Rekening',
      'Total Masuk',
      'Total Keluar',
      'Saldo Akhir',
      'Rekonsiliasi',
    ],
    badge: 'BNI Sync',
    category: 'Operasional',
  },
  {
    id: 'per_unit',
    title: 'Laporan Per Unit',
    description: 'Analisis keuangan berdasarkan unit atau bagian pesantren.',
    iconName: 'PieChart',
    options: ['MTs', 'MA', 'Dapur', 'Asrama', 'Kantor', 'Umum'],
    badge: '6 Unit',
    category: 'Operasional',
  },
  {
    id: 'arus_kas',
    title: 'Laporan Arus Kas',
    description: 'Analisis arus uang masuk dan keluar pesantren.',
    iconName: 'Receipt',
    showMetrics: ['Arus Kas Masuk', 'Arus Kas Keluar', 'Saldo Bersih', 'Tren Arus Kas'],
    badge: 'Cash Flow',
    category: 'Utama',
  },
  {
    id: 'audit_transaksi',
    title: 'Laporan Audit Transaksi',
    description: 'Riwayat aktivitas dan perubahan transaksi keuangan.',
    iconName: 'ClipboardCheck',
    showMetrics: [
      'Transaksi Dibuat',
      'Transaksi Diubah',
      'Transaksi Dibatalkan',
      'Penyesuaian Saldo',
      'User Activity',
    ],
    badge: 'Security Log',
    category: 'Audit',
  },
];

// =========================================================================
// RINCIAN PEMASUKAN TABLE DATA
// =========================================================================

// =========================================================================
// DATA TABLES & BREAKDOWN
// =========================================================================
export const initialIncomeBreakdown: IncomeBreakdownItem[] = [];
export const initialExpenseBreakdown: ExpenseBreakdownItem[] = [];

export const dailyIncomeBreakdown: IncomeBreakdownItem[] = [];
export const dailyExpenseBreakdown: ExpenseBreakdownItem[] = [];

export const weeklyIncomeBreakdown: IncomeBreakdownItem[] = [];
export const weeklyExpenseBreakdown: ExpenseBreakdownItem[] = [];

export const semesterIncomeBreakdown: IncomeBreakdownItem[] = [];
export const semesterExpenseBreakdown: ExpenseBreakdownItem[] = [];

export const annualIncomeBreakdown: IncomeBreakdownItem[] = [];
export const annualExpenseBreakdown: ExpenseBreakdownItem[] = [];

export const getIncomeBreakdown = (periodType: ReportPeriodType): IncomeBreakdownItem[] => {
  return [];
};

export const getExpenseBreakdown = (periodType: ReportPeriodType): ExpenseBreakdownItem[] => {
  return [];
};

export const initialMonthlyComparison: MonthlyComparisonPoint[] = [];

export const initialDailyCashFlowTrend: Array<{ date: string; pemasukan: number; pengeluaran: number; saldo: number }> = [];

export const arrearsSummaryStats = {
  totalSantri: 0,
  santriMenunggak: 0,
  totalTunggakan: 0,
  rataRataTunggakan: 0,
  totalSantriMenunggak: 0,
  tunggakanBulanan: 0,
  tunggakanTahunan: 0,
  collectionRate: 0,
};

export const initialArrearsReportTable: StudentArrearsReportItem[] = [];

export const studentPaymentReportStats: StudentPaymentStatusStats = {
  lunasCount: 0,
  lunasPercentage: 0,
  lunasNominal: 0,
  sebagianCount: 0,
  sebagianPercentage: 0,
  sebagianNominal: 0,
  belumBayarCount: 0,
  belumBayarPercentage: 0,
  belumBayarNominal: 0,
  totalSantri: 0,
  totalTagihan: 0,
  totalPembayaran: 0,
  totalTunggakan: 0,
  percentageCollected: 0,
};

export const bankPositionReports: BankPositionReportItem[] = [
  {
    rekeningName: 'BNI Rekening Operasional',
    bankName: 'Bank Negara Indonesia (BNI)',
    accountNumber: '0389 4412 1234',
    saldoAwal: 0,
    pemasukan: 0,
    pengeluaran: 0,
    saldoAkhir: 0,
    statusRekonsiliasi: 'SESUAI',
  },
  {
    rekeningName: 'BNI Rekening Utama',
    bankName: 'Bank Negara Indonesia (BNI)',
    accountNumber: '0389 9928 5678',
    saldoAwal: 0,
    pemasukan: 0,
    pengeluaran: 0,
    saldoAkhir: 0,
    statusRekonsiliasi: 'SESUAI',
  },
];

export const dailyReportSummary = {
  saldoAwal: 0,
  date: 'Hari ini',
  pemasukanHariIni: 0,
  pengeluaranHariIni: 0,
  saldoAkhir: 0,
  totalTransaksi: 0,
  totalPemasukan: 0,
  totalPengeluaran: 0,
  surplus: 0,
};

export const dailyTransactionJournal: DailyTransactionJournal[] = [];

export const unitFinancialReports: UnitFinancialReport[] = [];

export const semesterGanjilReport = {
  totalPemasukan: 0,
  totalPengeluaran: 0,
  surplus: 0,
  realisasiPemasukanPersen: 0,
  realisasiPengeluaranPersen: 0,
};

export const semesterGenapReport = {
  totalPemasukan: 0,
  totalPengeluaran: 0,
  surplus: 0,
  realisasiPemasukanPersen: 0,
  realisasiPengeluaranPersen: 0,
};

export const annualReportTable: any[] = [];

export const initialRecentReports: GeneratedReportAuditRecord[] = [];

export const initialAuditTransactionLogs: AuditTransactionReportItem[] = [];

export const sampleExpenseDetailRecords: ExpenseDetailRecord[] = [];
