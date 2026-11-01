import {
  BankAccountItem,
  BankMutationItem,
  BankReconciliationItem,
  BankAnalyticsCashFlow,
  BankAdjustmentRecord,
  BankTransferRecord,
} from '../types';

export const initialBankAccounts: BankAccountItem[] = [
  {
    id: 'rek-bni-1',
    bankName: 'BNI',
    accountName: 'BNI Rekening Operasional',
    accountNumber: '0389 4412 1234',
    accountNumberMasked: '**** **** **** 1234',
    atasNama: 'PM. RAUDHATUSSALAM MAHATO',
    saldo: 0,
    saldoAwal: 0,
    totalMasukBulanIni: 0,
    totalKeluarBulanIni: 0,
    status: 'AKTIF',
    lastTransactionDesc: 'Belum ada transaksi',
    lastTransactionAmount: 0,
    lastTransactionType: 'MASUK',
    lastTransactionTime: '-',
    lastUpdated: 'Belum ada data',
    minBalanceThreshold: 50000000,
    bankStatementBalance: 0,
    isReconciled: true,
    colorTheme: 'emerald',
    accountTypeLabel: 'Operasional & SPP Santri',
    notes: 'Rekening utama penampungan SPP, uang makan, dan operasional harian pesantren.',
  },
  {
    id: 'rek-bni-2',
    bankName: 'BNI',
    accountName: 'BNI Rekening Utama',
    accountNumber: '0389 9928 5678',
    accountNumberMasked: '**** **** **** 5678',
    atasNama: 'PM. RAUDHATUSSALAM MAHATO',
    saldo: 0,
    saldoAwal: 0,
    totalMasukBulanIni: 0,
    totalKeluarBulanIni: 0,
    status: 'AKTIF',
    lastTransactionDesc: 'Belum ada transaksi',
    lastTransactionAmount: 0,
    lastTransactionType: 'MASUK',
    lastTransactionTime: '-',
    lastUpdated: 'Belum ada data',
    minBalanceThreshold: 30000000,
    bankStatementBalance: 0,
    isReconciled: true,
    colorTheme: 'teal',
    accountTypeLabel: 'Pembangunan & Dana Cadangan',
    notes: 'Rekening penerimaan infaq pembangunan, dana abadi, dan cadangan yayasan.',
  },
];

export const sampleBankMutations: BankMutationItem[] = [];

export const sampleBalanceTrends: Array<{ date: string; [key: string]: string | number }> = [];

export const sampleCashFlowHistory: BankAnalyticsCashFlow[] = [];

export const sampleReconciliationData: BankReconciliationItem[] = [];

export const sampleAdjustments: BankAdjustmentRecord[] = [];

export const sampleTransferHistory: BankTransferRecord[] = [];

// Alias Exports for clean component consumption
export const initialBankMutations = sampleBankMutations;
export const initialBankReconciliations = sampleReconciliationData;
export const initialBankCashFlow = sampleCashFlowHistory;
export const initialBankBalanceHistory = sampleBalanceTrends;
export const initialBankAdjustments = sampleAdjustments;
export const initialBankTransfers = sampleTransferHistory;
