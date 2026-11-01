import {
  ImportSummaryStats,
  ColumnMappingItem,
  ImportPaymentRecord,
  ImportHistoryItem,
  BankReconciliationSummary,
} from '../types';

export const initialImportSummaryStats: ImportSummaryStats = {
  totalImportMonth: 0,
  totalNominalMonth: 0,
  berhasilCount: 0,
  perluValidasiCount: 0,
  duplikatCount: 0,
  tidakDitemukanCount: 0,
  periodLabel: 'Bulan Ini',
};

export const defaultColumnMappings: ColumnMappingItem[] = [
  {
    id: 'col-ref',
    simkeuField: 'nomorReferensi',
    label: 'Nomor Referensi / No. Transaksi',
    isRequired: true,
    fileColumn: 'No. Transaksi',
    isAutoDetected: true,
    description: 'Kode unik transaksi dari payment gateway (e.g. PAY-001245)',
  },
  {
    id: 'col-date',
    simkeuField: 'tanggalPembayaran',
    label: 'Tanggal Pembayaran',
    isRequired: true,
    fileColumn: 'Tanggal Bayar',
    isAutoDetected: true,
    description: 'Format YYYY-MM-DD atau DD/MM/YYYY',
  },
  {
    id: 'col-nis',
    simkeuField: 'nisSantri',
    label: 'NIS Santri',
    isRequired: true,
    fileColumn: 'NIS',
    isAutoDetected: true,
    description: 'Nomor Induk Santri terdaftar di SIMKEU (e.g. 2026001)',
  },
  {
    id: 'col-name',
    simkeuField: 'namaSantri',
    label: 'Nama Santri',
    isRequired: false,
    fileColumn: 'Nama',
    isAutoDetected: true,
    description: 'Nama lengkap santri untuk verifikasi sekunder',
  },
  {
    id: 'col-type',
    simkeuField: 'jenisPembayaran',
    label: 'Jenis Pembayaran',
    isRequired: false,
    fileColumn: 'Jenis Tagihan',
    isAutoDetected: true,
    description: 'Tagihan Bulanan, Uang Pembangunan, Uang Kertas, dsb.',
  },
  {
    id: 'col-amount',
    simkeuField: 'nominalPembayaran',
    label: 'Nominal Pembayaran (Rp)',
    isRequired: true,
    fileColumn: 'Nominal',
    isAutoDetected: true,
    description: 'Angka nominal yang ditransfer atau dibayar',
  },
  {
    id: 'col-method',
    simkeuField: 'metodePembayaran',
    label: 'Metode Pembayaran',
    isRequired: false,
    fileColumn: 'Metode',
    isAutoDetected: true,
    description: 'BNI Virtual Account, QRIS, Bank Transfer, Loket',
  },
  {
    id: 'col-status',
    simkeuField: 'statusPembayaran',
    label: 'Status Pembayaran Eksternal',
    isRequired: false,
    fileColumn: 'Status',
    isAutoDetected: true,
    description: 'SUCCESS, SETTLED, PAID dari aplikasi eksternal',
  },
];


export const sampleRawFilePreview: any[] = [];

export const sampleImportPaymentRecords: ImportPaymentRecord[] = [];

export const sampleImportHistory: ImportHistoryItem[] = [];

export const sampleBankReconciliation: BankReconciliationSummary = {
  totalImported: 0,
  bankMutationTotal: 0,
  difference: 0,
  status: 'SESUAI',
  accountSource: 'BNI Rekening 1',
  lastSync: 'Belum pernah rekonsiliasi',
};

export const sampleBankReconciliations: any[] = [];

export const sampleImportSummaryStats = initialImportSummaryStats;
