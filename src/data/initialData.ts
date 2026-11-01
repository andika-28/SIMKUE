import { BankAccount, ClassArrears, IncomeCategoryData, KpiSummary, MonthlyTrendData, NotificationItem, TopExpenseItem, Transaction } from '../types';

export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number).replace('IDR', 'Rp');
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('id-ID').format(number);
};

export const initialKpiSummary: KpiSummary = {
  totalPemasukan: 0,
  trendPemasukan: 'Belum ada transaksi',
  pemasukanPeriod: 'Bulan Ini',
  totalPengeluaran: 0,
  trendPengeluaran: 'Belum ada transaksi',
  pengeluaranPeriod: 'Bulan Ini',
  totalSaldo: 0,
  rekeningAktifCount: 2,
  totalTunggakan: 0,
  santriMenunggakCount: 0,
};

export const monthlyTrendData: MonthlyTrendData[] = [];

export const bankAccountsData: BankAccount[] = [
  {
    id: 'rek-1',
    bankName: 'BNI',
    accountType: 'Rekening Operasional',
    accountNumberMasked: '•••• 8821',
    saldo: 0,
    status: 'Aktif',
  },
  {
    id: 'rek-2',
    bankName: 'BNI',
    accountType: 'Rekening Utama',
    accountNumberMasked: '•••• 4092',
    saldo: 0,
    status: 'Aktif',
  },
];

export const incomeCategoriesData: IncomeCategoryData[] = [];

export const topExpensesData: TopExpenseItem[] = [];

export const classArrearsData: ClassArrears[] = [];

export const initialTransactions: Transaction[] = [];

export const initialNotifications: NotificationItem[] = [];
