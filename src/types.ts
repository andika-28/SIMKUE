export type TransactionType = 'Pemasukan' | 'Pengeluaran';

export interface Transaction {
  id: string;
  tanggal: string;
  keterangan: string;
  kategori: string;
  jenis: TransactionType;
  nominal: number;
  status: 'Berhasil' | 'Tertunda' | 'Dibatalkan';
  rekening?: string;
  santri?: string;
}

export interface KpiSummary {
  totalPemasukan: number;
  trendPemasukan: string;
  pemasukanPeriod: string;
  totalPengeluaran: number;
  trendPengeluaran: string;
  pengeluaranPeriod: string;
  totalSaldo: number;
  rekeningAktifCount: number;
  totalTunggakan: number;
  santriMenunggakCount: number;
}

export interface MonthlyTrendData {
  bulan: string;
  pemasukan: number;
  pengeluaran: number;
  surplus: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumberMasked: string;
  saldo: number;
  status: 'Aktif' | 'Nonaktif';
}

export interface IncomeCategoryData {
  name: string;
  nominal: number;
  percentage: number;
  color: string;
}

export interface TopExpenseItem {
  id: string;
  rank: number;
  nama: string;
  nominal: number;
  percentage: number;
}

export interface ClassArrears {
  id: string;
  kelas: string;
  santriMenunggak: number;
  totalTunggakan: number;
  status: 'Perlu Perhatian' | 'Normal';
  detailSantri?: {
    nama: string;
    nis: string;
    wali: string;
    bulanTunggakan: string;
    nominal: number;
    telepon: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'payment' | 'warning' | 'info';
}

export type StudentGender = 'Laki-laki' | 'Perempuan';
export type StudentUnit = 'MTs' | 'MA';
export type StudentClass = 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'Kelas 4' | 'Kelas 5' | 'Kelas 6';
export type MealPackageType = 'Paket A' | 'Paket B' | 'Paket C';
export type StudentStatus = 'Aktif' | 'Lulus' | 'Pindah';
export type ScholarshipType =
  | 'Reguler'
  | 'Beasiswa Prestasi (100%)'
  | 'Beasiswa Prestasi (50%)'
  | 'Beasiswa Tahfidz'
  | 'Beasiswa Yatim / Dhuafa';

export interface DetailedBill {
  id: string;
  periode: string;
  tahunAjaran: string;
  semester?: string;
  jenisTagihan: 'Tagihan Bulanan' | 'Tagihan Tahunan';
  rincian: string;
  breakdown: {
    label: string;
    subLabel?: string;
    nominal: number;
    diskon?: number;
  }[];
  nominal: number;
  diskon: number;
  totalAkhir: number;
  terbayar: number;
  tunggakan: number;
  status: 'LUNAS' | 'BELUM LUNAS' | 'MENUNGGU';
  jatuhTempo: string;
  keteranganDiskon?: string;
}

export interface DetailedPayment {
  id: string;
  tanggal: string;
  noReferensi: string;
  jenisPembayaran: string;
  periode: string;
  nominal: number;
  metode: string;
  sumber: string;
  status: 'Berhasil' | 'Tertunda' | 'Dibatalkan';
  namaSantri: string;
  nis: string;
  kelas: string;
  unit: string;
  petugas?: string;
  catatan?: string;
}

export interface FinancialTimelineActivity {
  id: string;
  tanggal: string;
  keterangan: string;
  nominal: number;
  status: 'Berhasil' | 'Menunggu Pembayaran' | 'Dibatalkan';
  jenis: 'pembayaran' | 'tagihan_baru' | 'diskon';
}

export interface StudentBillItem {
  id: string;
  bulan: string;
  tahun: string;
  spp: number;
  potonganSpp?: number;
  uangMakan: number;
  total: number;
  terbayar: number;
  tunggakan: number;
  status: 'Lunas' | 'Sebagian' | 'Belum Lunas';
  jatuhTempo: string;
  keteranganPotongan?: string;
}

export interface StudentPaymentHistory {
  id: string;
  tanggal: string;
  keterangan: string;
  nominal: number;
  metode: string;
  noReferensi: string;
  status: 'Berhasil' | 'Tertunda';
}

export interface Student {
  id: string;
  nis: string;
  nama: string;
  jenisKelamin: StudentGender;
  kelas: StudentClass;
  unit: StudentUnit;
  paketMakan: MealPackageType;
  kategoriBeasiswa: ScholarshipType;
  potonganSPP: number;
  catatanBeasiswa?: string;
  namaWali: string;
  noHpWali: string;
  alamat?: string;
  status: StudentStatus;
  tanggalMasuk: string;
  totalTagihan: number;
  totalDibayar: number;
  totalTunggakan: number;
  tagihanDetail?: StudentBillItem[];
  riwayatPembayaran?: StudentPaymentHistory[];
}

export interface StudentFilterState {
  search: string;
  unit: string;
  kelas: string;
  status: string;
  paketMakan: string;
  beasiswa: string;
}

export interface StudentStatsSummary {
  totalSantri: number;
  santriAktif: number;
  santriMTs: number;
  santriMA: number;
  paketACount: number;
  paketBCount: number;
  paketCCount: number;
  beasiswaPrestasiCount: number;
  totalPenerimaBeasiswa: number;
}

export interface MonthlyBillRow {
  id: string;
  no: number;
  nis: string;
  namaSantri: string;
  unit: StudentUnit;
  kelas: StudentClass;
  paketMakan: MealPackageType;
  spp: number;
  uangMakan: number;
  listrikAir: number;
  diskon: number;
  diskonKeterangan?: string;
  totalTagihan: number;
  status: 'LUNAS' | 'BELUM LUNAS';
  periode: string; // e.g. "Agustus 2026"
  tanggalPembayaran?: string;
  noReferensi?: string;
  sumberPembayaran?: string;
  jatuhTempo?: string;
  namaWali?: string;
  noHpWali?: string;
}

export interface MonthlyBillingSummary {
  periode: string;
  totalTagihanNominal: number;
  totalTagihanSantri: number;
  lunasNominal: number;
  lunasSantriCount: number;
  belumLunasNominal: number;
  belumLunasSantriCount: number;
  persentasePembayaran: number; // e.g. 79.8
}

export interface MonthlyBillingFilter {
  search: string;
  unit: string;
  kelas: string;
  status: string;
  paketMakan: string;
}

export type GenerateStep = 1 | 2 | 3 | 4 | 5;

export interface GenerateBillingConfig {
  tahunAjaran: string;
  bulan: string;
  tanggalJatuhTempo: string;
  sppNominal: number;
  listrikAirNominal: number;
  paketANominal: number;
  paketADiscount: number;
  paketBNominal: number;
  paketBDiscount: number;
  paketCNominal: number;
  paketCDiscount: number;
  catatanDiskon: string;
  targetUnit: string;
}

export interface BillingDraft {
  id: string;
  savedAt: string;
  config: GenerateBillingConfig;
}

export interface YearlyBillRow {
  id: string;
  no: number;
  nis: string;
  namaSantri: string;
  unit: StudentUnit;
  kelas: StudentClass;
  statusSantri: 'Santri Baru' | 'Santri Lama';
  uangPembangunan: number;
  uangKertas: number;
  uangKegiatan: number;
  totalTagihan: number;
  sudahDibayar: number;
  sisaTagihan: number;
  status: 'LUNAS' | 'SEBAGIAN' | 'BELUM DIBAYAR';
  persentaseBayar: number;
  tahunAjaran: string;
  pembangunanTerbayar: number;
  pembangunanStatus: 'LUNAS' | 'SEBAGIAN' | 'BELUM DIBAYAR';
  uangKertasGanjil: { nominal: number; terbayar: number; lunas: boolean };
  uangKertasGenap: { nominal: number; terbayar: number; lunas: boolean };
  uangKegiatanGanjil: { nominal: number; terbayar: number; lunas: boolean };
  uangKegiatanGenap: { nominal: number; terbayar: number; lunas: boolean };
  namaWali?: string;
  noHpWali?: string;
  tanggalBayarTerakhir?: string;
  noReferensiTerakhir?: string;
}

export interface YearlyBillingSummary {
  tahunAjaran: string;
  totalTagihanNominal: number;
  sudahDibayarNominal: number;
  sisaTagihanNominal: number;
  santriBelumLunasCount: number;
  persentasePembayaran: number;
  totalSantri: number;
  santriLunasCount: number;
  santriSebagianCount: number;
  santriBelumBayarCount: number;
  pembangunanTotal: number;
  kertasTotal: number;
  kegiatanTotal: number;
  semesterGanjil: {
    total: number;
    terbayar: number;
    sisa: number;
    persen: number;
  };
  semesterGenap: {
    total: number;
    terbayar: number;
    sisa: number;
    persen: number;
  };
  tunggakanMTs: number;
  tunggakanMA: number;
}

export interface YearlyBillingFilter {
  search: string;
  unit: string;
  kelas: string;
  statusSantri: string;
  semester: string;
  statusPembayaran: string;
}

export interface GenerateYearlyBillingConfig {
  tahunAjaran: string;
  pembangunanSantriBaru: number;
  pembangunanSantriLama: number;
  kertasTahunan: number;
  kertasGanjil: number;
  kertasGenap: number;
  kegiatanTahunan: number;
  kegiatanGanjil: number;
  kegiatanGenap: number;
}

export type DiscountBillingType = 'Uang Makan' | 'SPP' | 'Listrik & Air';
export type DiscountType = 'Nominal Tetap' | 'Persentase';
export type DiscountTargetScope =
  | 'Semua Santri'
  | 'Paket Makan'
  | 'Unit'
  | 'Kelas'
  | 'Santri Tertentu';

export type DiscountStatus = 'AKTIF' | 'DRAFT' | 'SUDAH DITERAPKAN' | 'DIBATALKAN';

export interface BillingDiscount {
  id: string;
  no: number;
  periode: string; // e.g. "Agustus 2026"
  tahunAjaran: string; // e.g. "2026 / 2027"
  namaDiskon: string;
  jenisTagihan: DiscountBillingType;
  tipeDiskon: DiscountType;
  targetDiskon: DiscountTargetScope;
  targetDetail: string; // e.g. "Paket C", "Semua Santri", "Kelas 6"
  targetPaketMakan?: MealPackageType;
  targetUnit?: StudentUnit;
  targetKelas?: StudentClass;
  targetSantriNisList?: string[];
  nominalDiskon: number;
  persentaseDiskon?: number;
  nominalNormal: number;
  nominalAkhir: number;
  santriTerdampakCount: number;
  estimasiTotalDiskon: number;
  status: DiscountStatus;
  alasan: string;
  catatanInternal?: string;
  dibuatOleh: string;
  tanggalDibuat: string;
  terakhirDiubahOleh?: string;
  tanggalDiubah?: string;
  isBillingGenerated?: boolean;
}

export interface DiscountAdjustmentHistory {
  id: string;
  discountId: string;
  tanggal: string; // e.g. "05 Agu 2026"
  periode: string; // e.g. "Agustus 2026"
  jenisTagihan: DiscountBillingType;
  diskonSebelumnya: number;
  diskonBaru: number;
  perubahan: number; // positive or negative
  alasan: string;
  dibuatOleh: string;
  keteranganTambahan?: string;
}

export interface DiscountKPIStats {
  totalDiskonBulanIni: number;
  periodeBulanIni: string;
  jumlahDiskonAktif: number;
  santriTerdampakBulanIni: number;
  totalDiskonTahunIni: number;
  tahunAjaran: string;
}

export interface DiscountFilterState {
  search: string;
  periodeBulan: string;
  tahunAjaran: string;
  status: string;
  jenisTagihan: string;
  targetDiskon: string;
}

// ==========================================
// TUNGGAKAN SANTRI (STUDENT ARREARS) TYPES
// ==========================================

export type ArrearsCategory =
  | '< 1 Bulan'
  | '1 Bulan'
  | '1–2 Bulan'
  | '2–3 Bulan'
  | '> 3 Bulan';

export type ArrearsPriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface MonthlyArrearDetail {
  periode: string;
  spp: number;
  uangMakan: number;
  listrikAir: number;
  total: number;
  status: 'BELUM LUNAS' | 'LUNAS';
}

export interface AnnualArrearDetail {
  pembangunan: { total: number; sudahDibayar: number; sisa: number };
  kertas: { total: number; sudahDibayar: number; sisa: number };
  kegiatan: { total: number; sudahDibayar: number; sisa: number };
  totalTagihan: number;
  totalSudahDibayar: number;
  totalSisa: number;
}

export interface ArrearTimelineItem {
  id: string;
  periode: string;
  tanggal: string;
  keterangan: string;
  nominal?: number;
  status: 'Belum dibayar' | 'Sebagian' | 'Lunas' | 'Masih memiliki tunggakan' | 'Peringatan Terkirim';
}

export interface StudentArrearItem {
  id: string;
  no: number;
  nis: string;
  namaSantri: string;
  unit: StudentUnit;
  kelas: StudentClass;
  jenisKelamin: StudentGender;
  statusSantri: StudentStatus;
  namaWali: string;
  noHpWali: string;
  alamat?: string;
  paketMakan?: MealPackageType;
  tunggakanBulanan: number;
  tunggakanTahunan: number;
  totalTunggakan: number;
  periodeTerlama: string; // e.g. "Juni 2026", "Juli 2026", "Agustus 2026"
  jumlahBulanMenunggak: number;
  kategori: ArrearsCategory;
  priority: ArrearsPriorityLevel;
  usiaTunggakanHari: number;
  rincianBulanan: MonthlyArrearDetail[];
  rincianTahunan: AnnualArrearDetail;
  timelineRiwayat: ArrearTimelineItem[];
}

export interface ArrearsKPIStats {
  totalTunggakan: number;
  tunggakanBulanan: number;
  tunggakanTahunan: number;
  santriMenunggakCount: number;
  totalSantriAktif: number;
  breakdownAlert: {
    lebih3Bulan: { santriCount: number; nominal: number };
    duaHingga3Bulan: { santriCount: number; nominal: number };
    kurang2Bulan: { santriCount: number; nominal: number };
  };
  priorityStats: {
    high: { santriCount: number; nominal: number; label: string };
    medium: { santriCount: number; nominal: number; label: string };
    low: { santriCount: number; nominal: number; label: string };
  };
  unitComparison: Array<{
    unit: StudentUnit;
    label: string;
    santriMenunggak: number;
    totalNominal: number;
    percentage: number;
  }>;
  classComparison: Array<{
    kelas: StudentClass;
    totalNominal: number;
    santriCount: number;
    persen: number;
  }>;
  agingAnalysis: Array<{
    range: string;
    nominal: number;
    santriCount: number;
    color: string;
    description: string;
  }>;
  monthlyTrend: Array<{
    bulan: string;
    totalTunggakan: number;
    tertagih: number;
  }>;
  topArrears: Array<{
    rank: number;
    id: string;
    nis: string;
    namaSantri: string;
    unit: StudentUnit;
    kelas: StudentClass;
    nominal: number;
    kategori: ArrearsCategory;
  }>;
}

export type YearlyArrearItemKey = 'semua' | 'pembangunan' | 'kertas' | 'kegiatan';

export interface ArrearsFilterState {
  search: string;
  unit: string;
  kelas: string;
  jenisTunggakan: string; // 'Semua Jenis' | 'Bulanan Saja' | 'Tahunan Saja' | 'Keduanya'
  filterBulan?: string; // 'Semua Bulan' | 'Agustus 2026' | 'Juli 2026' | ...
  filterItemTahunan?: string; // 'Semua Item Tahunan' | 'pembangunan' | 'kertas' | 'kegiatan'
  kategoriTunggakan: string;
  nominalTunggakan: string;
  statusSantri: string;
  priorityFilter: string;
  sortBy: 'totalDesc' | 'totalAsc' | 'bulananDesc' | 'tahunanDesc' | 'periodeAsc' | 'namaAsc';
}

// ==========================================
// IMPORT PEMBAYARAN TYPES
// ==========================================

export type ImportValidationStatus = 'VALID' | 'PERLU_VALIDASI' | 'DUPLIKAT' | 'TIDAK_DITEMUKAN';

export interface ImportPaymentRecord {
  id: string;
  no: number;
  nomorReferensi: string;
  tanggal: string;
  nis: string;
  namaSantri: string;
  unit: StudentUnit;
  kelas: StudentClass;
  jenisPembayaran: string;
  nominal: number;
  metodePembayaran: string;
  statusEksternal: string;
  tagihanDitemukan: string;
  statusValidasi: ImportValidationStatus;
  matchingConfidence: 'High Confidence' | 'Medium Confidence' | 'Low Confidence';
  expectedNominal?: number;
  receivedNominal?: number;
  nominalDifference?: number;
  validationErrorNote?: string;
  duplicateReferenceDate?: string;
  duplicateImportId?: string;
  systemRule?: string;
  actionTaken?: 'PROSES' | 'LEWATI' | 'TANDAI';
  billComponents?: {
    spp?: number;
    uangMakan?: number;
    listrikAir?: number;
    annualType?: string;
    annualTotal?: number;
    annualPaidBefore?: number;
    annualRemainingAfter?: number;
  };
}

export interface ColumnMappingItem {
  id: string;
  simkeuField: string;
  label: string;
  isRequired: boolean;
  fileColumn: string;
  isAutoDetected: boolean;
  description: string;
}

export interface ImportSummaryStats {
  totalImportMonth: number;
  totalNominalMonth: number;
  berhasilCount: number;
  perluValidasiCount: number;
  duplikatCount: number;
  tidakDitemukanCount: number;
  periodLabel: string;
}

export interface ImportHistoryItem {
  id: string;
  importId: string;
  tanggalImport: string;
  namaFile: string;
  fileSize: string;
  totalData: number;
  berhasil: number;
  bermasalah: number;
  totalNominal: number;
  diimportOleh: string;
  role: string;
  status: 'SELESAI' | 'SEBAGIAN' | 'GAGAL';
  fileHash: string;
  bankRekening: string;
  bankReconciled: boolean;
  notes?: string;
}

export interface BankReconciliationSummary {
  totalImported: number;
  bankMutationTotal: number;
  difference: number;
  status: 'SESUAI' | 'SELISIH';
  accountSource: string;
  lastSync: string;
}

// ==========================================
// MANAJEMEN PENGELUARAN (EXPENSES) TYPES
// ==========================================

export interface ExpenseCategory {
  id: string;
  code: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  budgetAllocated?: number;
  defaultUnit?: string;
  defaultSumberDana?: string;
}

export interface ExpenseInstitutionUnit {
  id: string;
  code: string;
  name: string;
  kategori: 'Pendidikan' | 'Asrama & Santri' | 'Operasional' | 'Sarpras' | 'Usaha' | 'Lainnya';
  penanggungJawab: string;
  kontakPIC?: string;
  alokasiAnggaranBulanan: number;
  sumberDanaUtama: string;
  rekeningDefault?: string;
  isActive: boolean;
  keterangan?: string;
  description?: string;
  isSystemProtected?: boolean;
}

export interface FundingSourceItem {
  id: string;
  code: string;
  name: string;
  tipeDana: 'Kas Operasional' | 'Kas SPP Santri' | 'Kas Dapur' | 'Dana BOS Kemenag' | 'Infaq & Wakaf' | 'Donasi' | 'Kas Usaha';
  rekeningKas: 'BNI Rekening 1' | 'BNI Rekening 2' | 'Kas Tunai Bendahara';
  saldoTersedia: number;
  paguTahunan?: number;
  deskripsi: string;
  isActive: boolean;
  kategoriPrioritas: string[];
  unitPrioritas: string[];
  isDefault?: boolean;
}

export interface ExpenseAttachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'doc';
  uploadDate: string;
  url?: string;
}

export interface ExpenseAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  note?: string;
  previousValue?: string;
  newValue?: string;
}

export type ExpenseUnit = 'MTs' | 'MA' | 'Dapur' | 'Asrama' | 'Kantor' | 'Umum' | string;

export type ExpenseReceiptStatus = 'LENGKAP' | 'MENUNGGU_NOTA' | 'PERLU_PERBAIKAN';

export type ExpenseRecordStatus = 'TERCATAT' | 'DRAFT' | 'DIBATALKAN';

export interface ExpenseItem {
  id: string;
  transactionNo: string;
  tanggal: string;
  kategori: string;
  kategoriCode: string;
  keterangan: string;
  nominal: number;
  rekening: 'BNI Rekening 1' | 'BNI Rekening 2';
  sumberKeuangan?: string;
  saldoSebelum: number;
  saldoSetelah: number;
  buktiList: ExpenseAttachment[];
  statusBukti: ExpenseReceiptStatus;
  dicatatOleh: string;
  rolePelaksana: string;
  pengajuanOleh?: string;
  unit?: ExpenseUnit;
  disetujuiOleh?: string;
  tanggalPersetujuan?: string;
  catatan?: string;
  status: ExpenseRecordStatus;
  alasanBatal?: string;
  riwayatAktivitas: ExpenseAuditLog[];
}

export interface ExpenseKpiSummary {
  totalPengeluaranBulanIni: number;
  pengeluaranHariIni: number;
  pengeluaranHariIniCount: number;
  pengeluaranTerbesarKategori: string;
  pengeluaranTerbesarNominal: number;
  totalTransaksiCount: number;
  periodLabel: string;
}

export interface ExpenseByUnit {
  unit: ExpenseUnit;
  jumlahTransaksi: number;
  totalPengeluaran: number;
  percentage: number;
}

export interface ExpenseCategoryStat {
  kategori: string;
  code: string;
  nominal: number;
  percentage: number;
  color: string;
  iconName: string;
}

export interface MonthlyExpenseTrend {
  bulan: string;
  nominal: number;
  anggaran?: number;
}

// ==========================================
// REKENING BANK & MUTASI SYSTEM TYPES
// ==========================================

export type BankAccountStatus = 'AKTIF' | 'NONAKTIF' | 'ARCHIVED';

export type BankMutationType = 'MASUK' | 'KELUAR' | 'TRANSFER';

export type BankMutationSource =
  | 'PEMBAYARAN_SANTRI'
  | 'IMPORT_PEMBAYARAN'
  | 'PENGELUARAN'
  | 'TRANSFER_ANTAR_REKENING'
  | 'PENYESUAIAN'
  | 'PENYESUAIAN_SALDO'
  | 'PEMASUKAN_LAINNYA';

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountNumberMasked: string;
  atasNama: string;
  saldo: number;
  saldoAwal: number;
  totalMasukBulanIni: number;
  totalKeluarBulanIni: number;
  status: BankAccountStatus;
  lastTransactionDesc: string;
  lastTransactionAmount: number;
  lastTransactionType: BankMutationType;
  lastTransactionTime: string;
  lastUpdated: string;
  minBalanceThreshold: number;
  bankStatementBalance?: number;
  isReconciled?: boolean;
  colorTheme?: string;
  accountTypeLabel: string;
  notes?: string;
}

export interface BankMutationItem {
  id: string;
  transactionNo: string;
  date: string;
  time: string;
  description: string;
  category: string;
  type: BankMutationType;
  source: BankMutationSource;
  sourceLabel: string;
  bankAccountId: string;
  bankAccountName: string;
  amount: number;
  balanceAfter: number;
  status: 'BERHASIL' | 'TERTUNDA' | 'DIBATALKAN' | 'TERCATAT';
  referenceNo?: string;
  notes?: string;
  performedBy?: string;
  transferDestinationId?: string;
  transferDestinationName?: string;
}

export interface BankTransferRecord {
  id: string;
  transferNo: string;
  date: string;
  time: string;
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  amount: number;
  notes: string;
  recordedBy: string;
  status: 'BERHASIL';
}

export interface BankAdjustmentRecord {
  id: string;
  adjustmentNo?: string;
  date?: string;
  time?: string;
  bankAccountId: string;
  bankAccountName: string;
  type: 'PENAMBAHAN' | 'PENGURANGAN';
  amount: number;
  balanceBefore?: number;
  balanceAfter?: number;
  previousBalance?: number;
  newBalance?: number;
  reason: string;
  attachmentName?: string;
  attachment?: string;
  recordedBy?: string;
  createdBy?: string;
  createdDate?: string;
  role?: string;
}

export interface UnreconciledItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'MASUK' | 'KELUAR';
  source: 'SISTEM' | 'BANK';
  status: 'BELUM_TERCATAT' | 'PROSES_KLIRING' | 'SELISIH_ADMIN';
  referenceNo?: string;
  resolved?: boolean;
}

export interface BankReconciliationItem {
  id: string;
  bankAccountId: string;
  bankAccountName: string;
  period: string;
  systemBalance: number;
  bankStatementBalance: number;
  difference: number;
  status: 'SESUAI' | 'PERLU_REKONSILIASI';
  unreconciledItems: UnreconciledItem[];
  lastReconciliationDate: string;
  reconciledBy?: string;
}

export interface BankAnalyticsCashFlow {
  month: string;
  pemasukan: number;
  pengeluaran: number;
  surplus: number;
}

// ----------------------------------------------------
// PUSAT LAPORAN KEUANGAN TYPES
// ----------------------------------------------------

export type ReportCategoryType =
  | 'buku_kas_umum'
  | 'pemasukan'
  | 'pengeluaran'
  | 'harian'
  | 'bulanan'
  | 'semester'
  | 'tahunan'
  | 'pembayaran_santri'
  | 'tunggakan'
  | 'rekening_bank'
  | 'per_unit'
  | 'arus_kas'
  | 'audit_transaksi';

export type ReportPeriodType =
  | 'hari_ini'
  | 'minggu_ini'
  | 'bulan_ini'
  | 'semester_ini'
  | 'tahun_ini'
  | 'custom';

export type UnitType = 'Semua Unit' | 'MTs' | 'MA' | 'Dapur' | 'Asrama' | 'Kantor' | 'Umum';

export type ReportUserRoleType = 'ADMIN' | 'BENDAHARA' | 'PIMPINAN';

export interface ReportFilterState {
  periodType: ReportPeriodType;
  startDate: string;
  endDate: string;
  unit: UnitType;
  academicYear: string;
  semester?: 'Semester Ganjil' | 'Semester Genap';
}

export interface ReportCardMeta {
  id: ReportCategoryType;
  title: string;
  description: string;
  iconName: string;
  dataIncluded?: string[];
  showMetrics?: string[];
  options?: string[];
  badge?: string;
  category: 'Utama' | 'Operasional' | 'Santri' | 'Audit';
}

export interface IncomeBreakdownItem {
  no: number;
  source: string;
  transactionCount: number;
  totalNominal: number;
  percentage: number;
  unit: string;
}

export interface ExpenseBreakdownItem {
  no: number;
  category: string;
  transactionCount: number;
  totalNominal: number;
  percentage: number;
  unit: string;
  sumberKeuangan: string;
  akunKas?: string;
}

export interface ExpenseDetailRecord {
  id: string;
  noBukti: string;
  tanggal: string;
  kategori: string;
  keterangan: string;
  sumberKeuangan: string;
  akunKas: string;
  unit: string;
  nominal: number;
  penerima: string;
  statusNota: 'Lengkap' | 'Menunggu Nota' | 'Perlu SPJ';
}

export interface MonthlyComparisonPoint {
  month: string;
  pemasukan: number;
  pengeluaran: number;
  surplus: number;
  saldoAkhir: number;
}

export interface DailyTransactionJournal {
  time: string;
  transactionNo: string;
  description: string;
  masuk: number | null;
  keluar: number | null;
  saldo: number;
  category: string;
  unit: string;
  pic: string;
}

export interface UnitFinancialReport {
  unit: string;
  pemasukan: number;
  pengeluaran: number;
  net: number;
  percentageOfBudget: number;
}

export interface StudentPaymentStatusStats {
  lunasCount: number;
  lunasPercentage: number;
  lunasNominal: number;
  sebagianCount: number;
  sebagianPercentage: number;
  sebagianNominal: number;
  belumBayarCount: number;
  belumBayarPercentage: number;
  belumBayarNominal: number;
  totalSantri: number;
  totalTagihan: number;
  totalPembayaran: number;
  totalTunggakan: number;
  percentageCollected: number;
}

export interface StudentArrearsReportItem {
  no: number;
  nis: string;
  namaSantri: string;
  kelas: string;
  jenisTagihan: string;
  totalTagihan: number;
  sudahDibayar: number;
  tunggakan: number;
  status: 'MENUNGGAK' | 'SEBAGIAN' | 'LUNAS';
  kontakWali?: string;
}

export interface BankPositionReportItem {
  rekeningName: string;
  bankName: string;
  accountNumber: string;
  saldoAwal: number;
  pemasukan: number;
  pengeluaran: number;
  saldoAkhir: number;
  statusRekonsiliasi: 'TERVERIFIKASI' | 'SESUAI' | 'SELISIH';
}

export interface GeneratedReportAuditRecord {
  id: string;
  reportName: string;
  reportType: ReportCategoryType;
  period: string;
  generatedBy: string;
  role: string;
  generatedDate: string;
  fileFormat: 'PDF' | 'Excel';
  fileSize: string;
  downloadUrl?: string;
}

export interface AuditTransactionReportItem {
  id: string;
  timestamp: string;
  activityType: 'DIBUAT' | 'DIUBAH' | 'DIBATALKAN' | 'PENYESUAIAN_SALDO' | 'EXPORT_DATA';
  description: string;
  amount?: number;
  user: string;
  role: string;
  ipAddress: string;
}

export type BankManagementRole = 'Admin' | 'Bendahara' | 'Pimpinan';

// ================= USER & RBAC TYPES =================
export type UserRoleType = 'Administrator' | 'Bendahara' | 'Pimpinan';
export type UserStatusType = 'Aktif' | 'Nonaktif' | 'Ditangguhkan' | 'Terkunci';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  role: UserRoleType;
  title: string;
  status: UserStatusType;
  phone?: string;
  email?: string;
  avatarColor: string;
  avatarInitials: string;
  createdAt: string;
  lastLogin: string;
  lastActivity: string;
  lastActivityModule: string;
  passwordChangedAt: string;
  failedLoginCount: number;
  totalActionsCount: number;
  isLocked?: boolean;
  deactivationReason?: string;
}

export type PermissionLevel = 'full' | 'limited' | 'view_only' | 'own_only' | 'none';

export interface ModulePermissionItem {
  id: string;
  name: string;
  category: string;
  description: string;
  adminLevel: PermissionLevel;
  bendaharaLevel: PermissionLevel;
  pimpinanLevel: PermissionLevel;
  adminText?: string;
  bendaharaText?: string;
  pimpinanText?: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  iconName: string;
  description: string;
  items: {
    id: string;
    code: string;
    label: string;
    description: string;
    type: 'VIEW' | 'CREATE' | 'EDIT' | 'CANCEL' | 'EXPORT' | 'MANAGE' | 'APPROVE';
    defaultRoles: UserRoleType[];
  }[];
}

export interface UserActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRoleType;
  activityName: string;
  activityType: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'EDIT' | 'IMPORT' | 'GENERATE' | 'EXPORT' | 'CANCEL' | 'DELETE_ATTEMPT' | 'ROLE_CHANGE';
  module: 'Authentication' | 'Dashboard' | 'Data Santri' | 'Tagihan' | 'Pembayaran' | 'Pengeluaran' | 'Rekening Bank' | 'Pusat Laporan' | 'User & Role';
  relatedDataRef?: string;
  relatedDataId?: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  status: 'BERHASIL' | 'GAGAL' | 'DITOLAK';
  notes?: string;
  dataChanges?: {
    field: string;
    before: string;
    after: string;
    reason?: string;
  }[];
}

export interface LoginHistoryRecord {
  id: string;
  timestamp: string;
  username: string;
  name: string;
  role: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  status: 'BERHASIL' | 'GAGAL' | 'DIBLOKIR';
  failureReason?: string;
}

export interface ActiveUserSession {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRoleType;
  device: string;
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  loginTime: string;
  lastActiveTime: string;
  isCurrentSession: boolean;
}

// ================= SYSTEM & ACADEMIC YEAR CONFIGURATION TYPES =================
export interface InstitutionIdentity {
  name: string;
  shortName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  leaderName: string;
  treasurerName: string;
  logoUrl?: string;
  nsm?: string;
  npsn?: string;
  kemenagSk?: string;
}

export interface AcademicYearConfigItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'AKTIF' | 'SELESAI' | 'DIRENCANAKAN';
  studentCount: number;
  billsGeneratedCount: number;
  totalPayment: number;
  createdAt: string;
  isLocked: boolean;
  closedAt?: string;
  closedBy?: string;
}

export interface SemesterConfigItem {
  id: string;
  name: 'Semester Ganjil' | 'Semester Genap';
  period: string;
  startDate: string;
  endDate: string;
  status: 'AKTIF' | 'MENUNGGU' | 'SELESAI';
  academicYear: string;
}

export interface UnitConfigItem {
  id: string;
  code: 'MTs' | 'MA';
  fullName: string;
  classes: number[];
  status: 'Aktif' | 'Nonaktif';
  headmasterName: string;
  totalStudents: number;
}

export interface ClassStructureConfigItem {
  id: string;
  level: number;
  unit: 'MTs' | 'MA';
  status: 'Aktif' | 'Nonaktif';
  studentCount: number;
  waliKelas: string;
  roomName: string;
}

export interface MealPackageConfigItem {
  id: string;
  code: 'A' | 'B' | 'C';
  badge: string;
  name: string;
  description: string;
  monthlyFee: number;
  status: 'Aktif' | 'Nonaktif';
  studentCount: number;
}

export interface MonthlyBillTypeConfigItem {
  id: string;
  code: string;
  name: string;
  defaultAmount: number | 'Berdasarkan Paket';
  frequency: 'Bulanan';
  status: 'Aktif' | 'Nonaktif';
  lastUpdated: string;
  isDynamicMeal?: boolean;
}

export interface AnnualBillTypeConfigItem {
  id: string;
  code: string;
  name: string;
  amountNewStudent: number;
  amountOldStudent: number;
  frequency: 'Tahunan';
  installments: '2 Semester' | 'Sekaligus';
  status: 'Aktif' | 'Nonaktif';
  sem1AmountNew: number;
  sem2AmountNew: number;
  sem1AmountOld: number;
  sem2AmountOld: number;
}

export interface ExpenseCategoryConfigItem {
  id: string;
  code: string;
  name: string;
  status: 'Aktif' | 'Nonaktif';
  transactionCount: number;
  totalSpent: number;
  description: string;
  isSystemProtected?: boolean;
}

export interface DocumentNumberConfigItem {
  id: string;
  name: string;
  documentType: string;
  prefix: string;
  format: string;
  pattern: string;
  resetPeriod: 'Tiap Bulan' | 'Tiap Tahun Ajaran' | 'Tidak Pernah Reset';
  example: string;
  currentCounter: number;
  description: string;
}

export interface ConfigAuditHistoryItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  section: string;
  action: string;
  details: string;
  ipAddress: string;
  date?: string;
  settingCategory?: string;
  itemChanged?: string;
  changeDescription?: string;
  oldValue?: string;
  newValue?: string;
  changedBy?: string;
  role?: string;
  badgeType?: 'emerald' | 'blue' | 'amber' | 'purple';
}

// ================= AUTHENTICATION & SESSION MANAGEMENT TYPES =================
export interface CurrentAuthUser {
  id: string;
  name: string;
  username: string;
  role: UserRoleType;
  title: string;
  status: UserStatusType;
  phone: string;
  email: string;
  avatarColor: string;
  avatarInitials: string;
  lastLogin: string;
  isFirstLogin?: boolean;
  lockUntil?: number; // timestamp in ms
  failedAttempts?: number;
}

export interface AuthAuditLogRecord {
  id: string;
  timestamp: string;
  username: string;
  name: string;
  role: UserRoleType;
  eventType:
    | 'LOGIN SUCCESS'
    | 'LOGIN FAILED'
    | 'LOGOUT'
    | 'SESSION TIMEOUT'
    | 'PASSWORD CHANGED'
    | 'PASSWORD RESET'
    | 'ACCOUNT LOCKED'
    | 'ACCOUNT UNLOCKED'
    | 'ROLE CHANGED'
    | 'FIRST LOGIN VERIFIED';
  ipAddress: string;
  browser: string;
  device: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details: string;
}

export interface PasswordResetRequest {
  id: string;
  username: string;
  fullName: string;
  role: UserRoleType;
  requestedAt: string;
  reason?: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
}

