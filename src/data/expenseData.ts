import {
  ExpenseCategory,
  ExpenseItem,
  ExpenseKpiSummary,
  ExpenseByUnit,
  ExpenseCategoryStat,
  MonthlyExpenseTrend,
} from '../types';

export const initialExpenseCategories: ExpenseCategory[] = [
  {
    id: 'cat-1',
    code: 'CAT-GJR',
    name: 'Gaji Guru',
    icon: 'GraduationCap',
    description: 'Honorarium bulanan untuk 80 dewan guru MTs & MA',
    isActive: true,
    budgetAllocated: 50000000,
  },
  {
    id: 'cat-2',
    code: 'CAT-GKR',
    name: 'Gaji Karyawan',
    icon: 'Users',
    description: 'Honorarium bulanan 10 staf keamanan, kebersihan, & admin',
    isActive: true,
    budgetAllocated: 20000000,
  },
  {
    id: 'cat-3',
    code: 'CAT-BDP',
    name: 'Belanja Dapur',
    icon: 'Utensils',
    description: 'Bahan makanan pokok, lauk, sayur, beras untuk 300 santri',
    isActive: true,
    budgetAllocated: 60000000,
  },
  {
    id: 'cat-4',
    code: 'CAT-LSK',
    name: 'Listrik',
    icon: 'Zap',
    description: 'Tagihan listrik PLN gedung asrama, kelas, masjid & kantor',
    isActive: true,
    budgetAllocated: 15000000,
  },
  {
    id: 'cat-5',
    code: 'CAT-AIR',
    name: 'Air',
    icon: 'Droplets',
    description: 'Retribusi PDAM & operasional sumur bor/filtrasi air bersih',
    isActive: true,
    budgetAllocated: 5000000,
  },
  {
    id: 'cat-6',
    code: 'CAT-NET',
    name: 'Internet',
    icon: 'Wifi',
    description: 'Langganan internet fiber optik lab komputer & kantor administrasi',
    isActive: true,
    budgetAllocated: 3500000,
  },
  {
    id: 'cat-7',
    code: 'CAT-ATK',
    name: 'ATK',
    icon: 'PenTool',
    description: 'Kertas, tinta printer, spidol board, map, dan alat tulis kantor',
    isActive: true,
    budgetAllocated: 4000000,
  },
  {
    id: 'cat-8',
    code: 'CAT-PBN',
    name: 'Perawatan Pembangunan',
    icon: 'Hammer',
    description: 'Pemeliharaan gedung, cat, perbaikan atap, pipa, dan fasilitas santri',
    isActive: true,
    budgetAllocated: 25000000,
  },
  {
    id: 'cat-9',
    code: 'CAT-KSN',
    name: 'Kegiatan Santri',
    icon: 'Sparkles',
    description: 'Kajian akbar, muhadhoroh, pramuka, olahraga, & PHBI',
    isActive: true,
    budgetAllocated: 15000000,
  },
  {
    id: 'cat-10',
    code: 'CAT-TRP',
    name: 'Transportasi',
    icon: 'Car',
    description: 'BBM kendaraan operasional pesantren, sewa bus safari dakwah & servis',
    isActive: true,
    budgetAllocated: 8000000,
  },
  {
    id: 'cat-11',
    code: 'CAT-KST',
    name: 'Kesehatan',
    icon: 'HeartPulse',
    description: 'Obat-obatan poskestren, rujukan dokter, & fasilitas P3K santri',
    isActive: true,
    budgetAllocated: 5000000,
  },
  {
    id: 'cat-12',
    code: 'CAT-AST',
    name: 'Pembelian Aset',
    icon: 'Package',
    description: 'Pengadaan lemari asrama, kasur santri, sound system, & proyektor',
    isActive: true,
    budgetAllocated: 30000000,
  },
  {
    id: 'cat-13',
    code: 'CAT-LNY',
    name: 'Lainnya',
    icon: 'HelpCircle',
    description: 'Biaya tak terduga, jamuan tamu pimpinan, dan konsumsi rapat',
    isActive: true,
    budgetAllocated: 5000000,
  },
];

export const initialBankBalances = {
  'BNI Rekening 1': {
    name: 'BNI Rekening 1 (Operasional & SPP)',
    accountNumber: '0389271829',
    saldo: 425500000,
  },
  'BNI Rekening 2': {
    name: 'BNI Rekening 2 (Pembangunan & Kegiatan)',
    accountNumber: '0847291038',
    saldo: 195000000,
  },
};

export const initialExpenseKpiSummary: ExpenseKpiSummary = {
  totalPengeluaranBulanIni: 0,
  pengeluaranHariIni: 0,
  pengeluaranHariIniCount: 0,
  pengeluaranTerbesarKategori: '-',
  pengeluaranTerbesarNominal: 0,
  totalTransaksiCount: 0,
  periodLabel: 'Bulan Ini',
};

// Data sample pengeluaran dikosongkan (siap untuk pencatatan transaksi riil)
export const sampleExpenses: ExpenseItem[] = [];

export const sampleCategoryStats: ExpenseCategoryStat[] = [];

export const sampleMonthlyExpenseTrend: MonthlyExpenseTrend[] = [];

export const sampleAccountDistribution: Array<{
  accountName: string;
  nominal: number;
  percentage: number;
  color: string;
  usage: string;
}> = [];

export const sampleExpensesByUnit: ExpenseByUnit[] = [];

export const sampleMissingReceipts: Array<{
  id: string;
  transactionNo: string;
  kategori: string;
  nominal: number;
  tanggal: string;
  dicatatOleh: string;
  statusNote: string;
  unit: string;
}> = [];
