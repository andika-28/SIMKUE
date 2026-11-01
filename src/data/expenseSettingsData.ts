import {
  ExpenseCategory,
  ExpenseInstitutionUnit,
  FundingSourceItem,
} from '../types';

export const initialFundingSources: FundingSourceItem[] = [
  {
    id: 'src-1',
    code: 'SRC-DPR',
    name: 'Kas Dapur & Uang Makan Santri',
    tipeDana: 'Kas Dapur',
    rekeningKas: 'BNI Rekening 1',
    saldoTersedia: 0,
    paguTahunan: 720000000,
    deskripsi: 'Khusus pembiayaan konsumsi santri (beras, lauk-pauk, sayuran, bumbu, dan gas dapur).',
    isActive: true,
    isDefault: true,
    kategoriPrioritas: ['Belanja Dapur', 'Lainnya'],
    unitPrioritas: ['Dapur', 'Asrama'],
  },
  {
    id: 'src-2',
    code: 'SRC-SPP',
    name: 'Kas SPP Santri & Pendidikan',
    tipeDana: 'Kas SPP Santri',
    rekeningKas: 'BNI Rekening 1',
    saldoTersedia: 0,
    paguTahunan: 1450000000,
    deskripsi: 'Penerimaan iuran SPP untuk honorarium guru MTs & MA, media pembelajaran, dan kegiatan kurikuler.',
    isActive: true,
    isDefault: false,
    kategoriPrioritas: ['Gaji Guru', 'ATK', 'Kegiatan Santri'],
    unitPrioritas: ['MTs', 'MA', 'Kantor'],
  },
  {
    id: 'src-3',
    code: 'SRC-BOS',
    name: 'Dana BOS Madrasah Kemenag',
    tipeDana: 'Dana BOS Kemenag',
    rekeningKas: 'BNI Rekening 1',
    saldoTersedia: 0,
    paguTahunan: 280000000,
    deskripsi: 'Bantuan Operasional Sekolah resmi Kementerian Agama untuk buku ajar, ujian madrasah, dan sarana belajar santri.',
    isActive: true,
    isDefault: false,
    kategoriPrioritas: ['ATK', 'Kegiatan Santri', 'Gaji Guru', 'Perawatan Bangunan'],
    unitPrioritas: ['MTs', 'MA'],
  },
  {
    id: 'src-4',
    code: 'SRC-OPS',
    name: 'Kas Operasional Utama Pesantren',
    tipeDana: 'Kas Operasional',
    rekeningKas: 'BNI Rekening 1',
    saldoTersedia: 0,
    paguTahunan: 550000000,
    deskripsi: 'Kas induk belanja operasional harian, listrik PLN, internet, gaji staf keamanan/kebersihan, dan transport.',
    isActive: true,
    isDefault: false,
    kategoriPrioritas: ['Listrik', 'Air', 'Internet', 'Gaji Karyawan', 'Transportasi'],
    unitPrioritas: ['Kantor', 'Umum', 'Asrama'],
  },
  {
    id: 'src-5',
    code: 'SRC-WKF',
    name: 'Infaq, Sedekah & Wakaf Pesantren',
    tipeDana: 'Infaq & Wakaf',
    rekeningKas: 'BNI Rekening 2',
    saldoTersedia: 0,
    paguTahunan: 480000000,
    deskripsi: 'Dana titipan ummat/donatur untuk kemaslahatan santri dhuafa, beasiswa, kesehatan poskestren, dan syiar dakwah.',
    isActive: true,
    isDefault: false,
    kategoriPrioritas: ['Perawatan Bangunan', 'Pembelian Aset', 'Kesehatan Santri', 'Kegiatan Santri'],
    unitPrioritas: ['Umum', 'Asrama', 'Kesehatan'],
  },
  {
    id: 'src-6',
    code: 'SRC-PBN',
    name: 'Dana Pembangunan & Sarana Prasarana',
    tipeDana: 'Kas Operasional',
    rekeningKas: 'BNI Rekening 2',
    saldoTersedia: 0,
    paguTahunan: 650000000,
    deskripsi: 'Khusus pembangunan gedung asrama baru, instalasi air bersih, renovasi masjid, dan pembelian inventaris besar.',
    isActive: true,
    isDefault: false,
    kategoriPrioritas: ['Perawatan Bangunan', 'Pembelian Aset', 'Air'],
    unitPrioritas: ['Sarpras', 'Umum'],
  },
  {
    id: 'src-7',
    code: 'SRC-USH',
    name: 'Kas Unit Usaha & Kantin Pesantren',
    tipeDana: 'Kas Usaha',
    rekeningKas: 'BNI Rekening 1',
    saldoTersedia: 0,
    paguTahunan: 180000000,
    deskripsi: 'Laba perputaran kantin santri dan mini market pesantren untuk subsidi operasional dan cadangan darurat.',
    isActive: true,
    isDefault: false,
    kategoriPrioritas: ['Lainnya', 'Transportasi', 'Belanja Dapur'],
    unitPrioritas: ['Kantin/Usaha', 'Umum'],
  },
];

export const initialInstitutionUnits: ExpenseInstitutionUnit[] = [
  {
    id: 'unit-1',
    code: 'UNIT-DAPUR',
    name: 'Dapur',
    kategori: 'Asrama & Santri',
    penanggungJawab: 'Ustadzah Maryam (Koordinator Dapur)',
    kontakPIC: '0812-3456-7801',
    alokasiAnggaranBulanan: 65000000,
    sumberDanaUtama: 'Kas Dapur & Uang Makan Santri',
    rekeningDefault: 'BNI Rekening 1',
    isActive: true,
    isSystemProtected: true,
    keterangan: 'Penyediaan makan pagi, siang, dan malam untuk 300+ santri mukim.',
  },
  {
    id: 'unit-2',
    code: 'UNIT-MTS',
    name: 'MTs',
    kategori: 'Pendidikan',
    penanggungJawab: 'Ustadz H. Syamsuddin, S.Pd.I (Kepala MTs)',
    kontakPIC: '0813-9876-1122',
    alokasiAnggaranBulanan: 45000000,
    sumberDanaUtama: 'Kas SPP Santri & Pendidikan',
    rekeningDefault: 'BNI Rekening 1',
    isActive: true,
    isSystemProtected: true,
    keterangan: 'Unit pendidikan formal tingkat menengah pertama pesantren.',
  },
  {
    id: 'unit-3',
    code: 'UNIT-MA',
    name: 'MA',
    kategori: 'Pendidikan',
    penanggungJawab: 'Ustadz Ridwan Hakim, M.Pd (Kepala MA)',
    kontakPIC: '0812-7766-3344',
    alokasiAnggaranBulanan: 40000000,
    sumberDanaUtama: 'Kas SPP Santri & Pendidikan',
    rekeningDefault: 'BNI Rekening 1',
    isActive: true,
    isSystemProtected: true,
    keterangan: 'Unit pendidikan formal tingkat menengah atas pesantren.',
  },
  {
    id: 'unit-4',
    code: 'UNIT-ASRAMA',
    name: 'Asrama',
    kategori: 'Asrama & Santri',
    penanggungJawab: 'Ustadz Farhan Al-Ghazi (Mudabbir Asrama)',
    kontakPIC: '0852-6655-4433',
    alokasiAnggaranBulanan: 25000000,
    sumberDanaUtama: 'Kas Operasional Utama Pesantren',
    rekeningDefault: 'BNI Rekening 1',
    isActive: true,
    isSystemProtected: true,
    keterangan: 'Pembinaan karakter, disiplin santri, dan kebersihan blok kamar.',
  },
  {
    id: 'unit-5',
    code: 'UNIT-KANTOR',
    name: 'Kantor',
    kategori: 'Operasional',
    penanggungJawab: 'Ustadz Hendra Saputra (Kabag Tata Usaha)',
    kontakPIC: '0811-2233-4455',
    alokasiAnggaranBulanan: 30000000,
    sumberDanaUtama: 'Kas Operasional Utama Pesantren',
    rekeningDefault: 'BNI Rekening 1',
    isActive: true,
    isSystemProtected: true,
    keterangan: 'Kesekretariatan yayasan, pelayanan wali santri, dan SIMKEU.',
  },
  {
    id: 'unit-6',
    code: 'UNIT-SARPRAS',
    name: 'Sarpras',
    kategori: 'Sarpras',
    penanggungJawab: 'Ustadz M. Taufiq (Kabag Sarana Prasarana)',
    kontakPIC: '0813-4455-6677',
    alokasiAnggaranBulanan: 35000000,
    sumberDanaUtama: 'Dana Pembangunan & Sarana Prasarana',
    rekeningDefault: 'BNI Rekening 2',
    isActive: true,
    keterangan: 'Pemeliharaan gedung, sanitasi, listrik genset, dan aset pesantren.',
  },
  {
    id: 'unit-7',
    code: 'UNIT-KESEHATAN',
    name: 'Kesehatan',
    kategori: 'Asrama & Santri',
    penanggungJawab: 'dr. Nurul Aisyah (Penanggung Jawab Poskestren)',
    kontakPIC: '0821-3344-5566',
    alokasiAnggaranBulanan: 10000000,
    sumberDanaUtama: 'Infaq, Sedekah & Wakaf Pesantren',
    rekeningDefault: 'BNI Rekening 2',
    isActive: true,
    keterangan: 'Layanan obat santri, perawatan darurat, dan cek kesehatan berkala.',
  },
  {
    id: 'unit-8',
    code: 'UNIT-UMUM',
    name: 'Umum',
    kategori: 'Operasional',
    penanggungJawab: 'H. Ahmad Syarif, M.Pd (Bendahara Pesantren)',
    kontakPIC: '0812-8899-0011',
    alokasiAnggaranBulanan: 20000000,
    sumberDanaUtama: 'Kas Operasional Utama Pesantren',
    rekeningDefault: 'BNI Rekening 1',
    isActive: true,
    isSystemProtected: true,
    keterangan: 'Keperluan umum lintas unit, logistik sosial, dan kemaslahatan.',
  },
];

export const initialConfiguredCategories: ExpenseCategory[] = [
  {
    id: 'cat-1',
    code: 'CAT-GJR',
    name: 'Gaji Guru',
    icon: 'GraduationCap',
    description: 'Honorarium bulanan untuk 80 dewan guru MTs & MA',
    isActive: true,
    budgetAllocated: 50000000,
    defaultUnit: 'MTs',
    defaultSumberDana: 'Kas SPP Santri & Pendidikan',
  },
  {
    id: 'cat-2',
    code: 'CAT-GKR',
    name: 'Gaji Karyawan',
    icon: 'Users',
    description: 'Honorarium bulanan 10 staf keamanan, kebersihan, & admin',
    isActive: true,
    budgetAllocated: 20000000,
    defaultUnit: 'Kantor',
    defaultSumberDana: 'Kas Operasional Utama Pesantren',
  },
  {
    id: 'cat-3',
    code: 'CAT-BDP',
    name: 'Belanja Dapur',
    icon: 'Utensils',
    description: 'Bahan makanan pokok, lauk, sayur, beras untuk 300 santri',
    isActive: true,
    budgetAllocated: 60000000,
    defaultUnit: 'Dapur',
    defaultSumberDana: 'Kas Dapur & Uang Makan Santri',
  },
  {
    id: 'cat-4',
    code: 'CAT-LSK',
    name: 'Listrik',
    icon: 'Zap',
    description: 'Tagihan listrik PLN gedung asrama, kelas, masjid & kantor',
    isActive: true,
    budgetAllocated: 15000000,
    defaultUnit: 'Kantor',
    defaultSumberDana: 'Kas Operasional Utama Pesantren',
  },
  {
    id: 'cat-5',
    code: 'CAT-AIR',
    name: 'Air',
    icon: 'Droplets',
    description: 'Retribusi PDAM & operasional sumur bor/filtrasi air bersih',
    isActive: true,
    budgetAllocated: 5000000,
    defaultUnit: 'Asrama',
    defaultSumberDana: 'Kas Operasional Utama Pesantren',
  },
  {
    id: 'cat-6',
    code: 'CAT-NET',
    name: 'Internet',
    icon: 'Wifi',
    description: 'Langganan internet fiber optik kantor, lab & SIMKEU',
    isActive: true,
    budgetAllocated: 3000000,
    defaultUnit: 'Kantor',
    defaultSumberDana: 'Kas Operasional Utama Pesantren',
  },
  {
    id: 'cat-7',
    code: 'CAT-ATK',
    name: 'ATK',
    icon: 'FileText',
    description: 'Kertas HVS, tinta printer, kwitansi cetak & map raport',
    isActive: true,
    budgetAllocated: 4000000,
    defaultUnit: 'Kantor',
    defaultSumberDana: 'Dana BOS Madrasah Kemenag',
  },
  {
    id: 'cat-8',
    code: 'CAT-PRW',
    name: 'Perawatan Bangunan',
    icon: 'Hammer',
    description: 'Pengecatan, perbaikan plafon, pipa bocor & pintu asrama',
    isActive: true,
    budgetAllocated: 12000000,
    defaultUnit: 'Sarpras',
    defaultSumberDana: 'Dana Pembangunan & Sarana Prasarana',
  },
  {
    id: 'cat-9',
    code: 'CAT-KGT',
    name: 'Kegiatan Santri',
    icon: 'Sparkles',
    description: 'Pekan Muharram, lomba pidato, pramuka & ekstrakurikuler',
    isActive: true,
    budgetAllocated: 8000000,
    defaultUnit: 'MA',
    defaultSumberDana: 'Kas SPP Santri & Pendidikan',
  },
  {
    id: 'cat-10',
    code: 'CAT-TRN',
    name: 'Transportasi',
    icon: 'Truck',
    description: 'BBM mobil inventaris pesantren & uang jalan dinas',
    isActive: true,
    budgetAllocated: 5000000,
    defaultUnit: 'Umum',
    defaultSumberDana: 'Kas Operasional Utama Pesantren',
  },
  {
    id: 'cat-11',
    code: 'CAT-KSH',
    name: 'Kesehatan Santri',
    icon: 'HeartPulse',
    description: 'Stok obat-obatan UKS/Poskestren & biaya rujukan santri sakit',
    isActive: true,
    budgetAllocated: 4000000,
    defaultUnit: 'Kesehatan',
    defaultSumberDana: 'Infaq, Sedekah & Wakaf Pesantren',
  },
  {
    id: 'cat-12',
    code: 'CAT-AST',
    name: 'Pembelian Aset',
    icon: 'PackageCheck',
    description: 'Pengadaan laptop kantor, sound system masjid & lemari santri',
    isActive: true,
    budgetAllocated: 20000000,
    defaultUnit: 'Sarpras',
    defaultSumberDana: 'Dana Pembangunan & Sarana Prasarana',
  },
  {
    id: 'cat-13',
    code: 'CAT-LNN',
    name: 'Lainnya',
    icon: 'HelpCircle',
    description: 'Biaya tak terduga, konsumsi tamu kiai, dan darurat',
    isActive: true,
    budgetAllocated: 3000000,
    defaultUnit: 'Umum',
    defaultSumberDana: 'Kas Operasional Utama Pesantren',
  },
];

// LocalStorage Persistence Keys
const STORAGE_KEY_CATEGORIES = 'simkeu_expense_categories_v2';
const STORAGE_KEY_UNITS = 'simkeu_expense_units_v2';
const STORAGE_KEY_FUNDING_SOURCES = 'simkeu_expense_funding_sources_v2';

export const loadStoredCategories = (): ExpenseCategory[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load expense categories from storage', e);
  }
  return initialConfiguredCategories;
};

export const saveStoredCategories = (items: ExpenseCategory[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save expense categories', e);
  }
};

export const loadStoredInstitutionUnits = (): ExpenseInstitutionUnit[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_UNITS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load institution units from storage', e);
  }
  return initialInstitutionUnits;
};

export const saveStoredInstitutionUnits = (items: ExpenseInstitutionUnit[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_UNITS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save institution units', e);
  }
};

export const loadStoredFundingSources = (): FundingSourceItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_FUNDING_SOURCES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load funding sources from storage', e);
  }
  return initialFundingSources;
};

export const saveStoredFundingSources = (items: FundingSourceItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_FUNDING_SOURCES, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save funding sources', e);
  }
};

/**
 * Helper to determine default funding source for a selected category & unit
 */
export const getSuggestedFundingSource = (
  categoryName: string,
  unitName?: string,
  allCategories = initialConfiguredCategories,
  allUnits = initialInstitutionUnits,
  allSources = initialFundingSources
): { sourceName: string; rekeningKas: 'BNI Rekening 1' | 'BNI Rekening 2' } => {
  // 1. Check category default
  const cat = allCategories.find((c) => c.name === categoryName);
  if (cat?.defaultSumberDana) {
    const matchedSource = allSources.find((s) => s.name === cat.defaultSumberDana);
    if (matchedSource) {
      return {
        sourceName: matchedSource.name,
        rekeningKas: matchedSource.rekeningKas === 'BNI Rekening 2' ? 'BNI Rekening 2' : 'BNI Rekening 1',
      };
    }
  }

  // 2. Check unit default
  if (unitName) {
    const unit = allUnits.find((u) => u.name === unitName);
    if (unit?.sumberDanaUtama) {
      const matchedSource = allSources.find((s) => s.name === unit.sumberDanaUtama);
      if (matchedSource) {
        return {
          sourceName: matchedSource.name,
          rekeningKas: matchedSource.rekeningKas === 'BNI Rekening 2' ? 'BNI Rekening 2' : 'BNI Rekening 1',
        };
      }
    }
  }

  // 3. Fallback heuristic
  if (categoryName.toLowerCase().includes('dapur')) {
    return { sourceName: 'Kas Dapur & Uang Makan Santri', rekeningKas: 'BNI Rekening 1' };
  }
  if (categoryName.toLowerCase().includes('gaji')) {
    return { sourceName: 'Kas SPP Santri & Pendidikan', rekeningKas: 'BNI Rekening 1' };
  }
  if (categoryName.toLowerCase().includes('bangunan') || categoryName.toLowerCase().includes('aset')) {
    return { sourceName: 'Dana Pembangunan & Sarana Prasarana', rekeningKas: 'BNI Rekening 2' };
  }

  return { sourceName: 'Kas Operasional Utama Pesantren', rekeningKas: 'BNI Rekening 1' };
};
