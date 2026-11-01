import {
  Student,
  StudentClass,
  StudentGender,
  StudentStatsSummary,
  StudentUnit,
  MealPackageType,
  StudentStatus,
  ScholarshipType,
} from '../types';

export const MEAL_PACKAGES_INFO = {
  'Paket A': {
    name: 'Paket A',
    label: 'Full makan di rumah',
    price: 0,
    priceFormatted: 'Rp0 / bulan',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    description: 'Santri membawa/mengatur konsumsi penuh secara mandiri dari luar/rumah.',
  },
  'Paket B': {
    name: 'Paket B',
    label: '2x makan di rumah',
    price: 200000,
    priceFormatted: 'Rp200.000 / bulan',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Santri mendapatkan 1x makan siang pesantren, 2x makan di rumah.',
  },
  'Paket C': {
    name: 'Paket C',
    label: 'Full makan di pesantren',
    price: 600000,
    priceFormatted: 'Rp600.000 / bulan',
    badgeColor: 'bg-emerald-50 text-[#064E3B] border-emerald-200',
    description: 'Santri mendapatkan 3x makan harian lengkap standar gizi dapur pesantren.',
  },
};

export const SCHOLARSHIP_PACKAGES_INFO: Record<
  ScholarshipType,
  {
    name: ScholarshipType;
    shortLabel: string;
    discountAmount: number;
    discountFormatted: string;
    badgeColor: string;
    icon: string;
    description: string;
  }
> = {
  'Reguler': {
    name: 'Reguler',
    shortLabel: 'Reguler (SPP Penuh)',
    discountAmount: 0,
    discountFormatted: 'Rp0',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: 'Standard',
    description: 'Kewajiban SPP penuh Rp500.000 / bulan (tanpa potongan beasiswa).',
  },
  'Beasiswa Prestasi (100%)': {
    name: 'Beasiswa Prestasi (100%)',
    shortLabel: 'Prestasi 100% (Bebas SPP)',
    discountAmount: 500000,
    discountFormatted: '-Rp500.000 / bln',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-100',
    icon: 'Trophy',
    description: 'Bebas 100% biaya SPP bulanan karena prestasi akademik/musabaqah tingkat provinsi/nasional.',
  },
  'Beasiswa Prestasi (50%)': {
    name: 'Beasiswa Prestasi (50%)',
    shortLabel: 'Prestasi 50% (Potongan SPP)',
    discountAmount: 250000,
    discountFormatted: '-Rp250.000 / bln',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: 'Award',
    description: 'Potongan 50% biaya SPP bulanan (cukup bayar Rp250.000/bln) atas capaian prestasi terpilih.',
  },
  'Beasiswa Tahfidz': {
    name: 'Beasiswa Tahfidz',
    shortLabel: 'Tahfidz Al-Qur\'an',
    discountAmount: 500000,
    discountFormatted: '-Rp500.000 / bln',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: 'BookOpen',
    description: 'Bebas 100% SPP untuk santri berprestasi dengan hafalan mutqin minimal 10–30 Juz.',
  },
  'Beasiswa Yatim / Dhuafa': {
    name: 'Beasiswa Yatim / Dhuafa',
    shortLabel: 'Yatim & Dhuafa',
    discountAmount: 500000,
    discountFormatted: '-Rp500.000 / bln',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: 'HeartHandshake',
    description: 'Bantuan sosial subsidi penuh biaya SPP dari dana infaq & zakat pesantren.',
  },
};

export const getClassUnit = (kelas: string): StudentUnit => {
  if (kelas === 'Kelas 1' || kelas === 'Kelas 2' || kelas === 'Kelas 3') {
    return 'MTs';
  }
  return 'MA';
};

export const emptyStudentPlaceholder: Student = {
  id: '',
  nis: '',
  nama: 'Belum Ada Santri',
  jenisKelamin: 'Laki-laki',
  unit: 'MTs',
  kelas: 'Kelas 1',
  paketMakan: 'Paket A',
  kategoriBeasiswa: 'Reguler',
  potonganSPP: 0,
  namaWali: '-',
  noHpWali: '-',
  alamat: '-',
  status: 'Aktif',
  tanggalMasuk: '-',
  totalTagihan: 0,
  totalDibayar: 0,
  totalTunggakan: 0,
  tagihanDetail: [],
  riwayatPembayaran: [],
};

// Data santri awal dikosongkan (siap untuk pendaftaran santri baru/impor data)
export const initialStudents: Student[] = [];

export const initialStudentStats: StudentStatsSummary = {
  totalSantri: 0,
  santriAktif: 0,
  santriMTs: 0,
  santriMA: 0,
  paketACount: 0,
  paketBCount: 0,
  paketCCount: 0,
  beasiswaPrestasiCount: 0,
  totalPenerimaBeasiswa: 0,
};
