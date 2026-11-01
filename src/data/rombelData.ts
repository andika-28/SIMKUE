import { StudentClass } from '../types';
import { initialStudents } from './studentsData';

export interface RombelItem {
  id: string;
  kodeRombel: string;
  namaRombel: string;
  tingkat: StudentClass;
  tingkatAngka: number;
  unit: 'MTs' | 'MA';
  gender: 'Banin' | 'Banat';
  genderLabel: 'Putra' | 'Putri';
  waliKelas: string;
  waliKelasNip: string;
  waliKelasHp: string;
  ruangKelas: string;
  gedung: string;
  kapasitas: number;
  jumlahSantri: number;
  totalTunggakan: number;
  persentaseLunas: number;
  ketuaKelas: string;
}

export interface SantriRombelMember {
  id: string;
  nis: string;
  nama: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  kelas: string;
  rombelKode: string;
  rombelId: string;
  paketMakan: 'Paket A' | 'Paket B' | 'Paket C';
  beasiswa: string;
  namaWali: string;
  noHpWali: string;
  statusSPP: 'Lunas' | 'Menunggak' | 'Sebagian';
  nominalTunggakan: number;
}

export const initialRombelList: RombelItem[] = [
  {
    id: 'rmb-1a',
    kodeRombel: '1-A',
    namaRombel: 'Kelas 1-A (MTs Banin)',
    tingkat: 'Kelas 1',
    tingkatAngka: 1,
    unit: 'MTs',
    gender: 'Banin',
    genderLabel: 'Putra',
    waliKelas: 'Ust. Zulkifli, S.Pd',
    waliKelasNip: '19850412-201501-1-003',
    waliKelasHp: '0813-7123-4567',
    ruangKelas: 'Ruang Abu Bakar As-Siddiq',
    gedung: 'Gedung Timur Lt. 1',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-1b',
    kodeRombel: '1-B',
    namaRombel: 'Kelas 1-B (MTs Banat)',
    tingkat: 'Kelas 1',
    tingkatAngka: 1,
    unit: 'MTs',
    gender: 'Banat',
    genderLabel: 'Putri',
    waliKelas: 'Usth. Maryam Rahmah, S.Pd.I',
    waliKelasNip: '19890820-201701-2-005',
    waliKelasHp: '0812-6543-9871',
    ruangKelas: 'Ruang Khadijah binti Khuwailid',
    gedung: 'Gedung Khodijah Lt. 1',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-2a',
    kodeRombel: '2-A',
    namaRombel: 'Kelas 2-A (MTs Banin)',
    tingkat: 'Kelas 2',
    tingkatAngka: 2,
    unit: 'MTs',
    gender: 'Banin',
    genderLabel: 'Putra',
    waliKelas: 'Ust. Salman Faris, S.Pd',
    waliKelasNip: '19870315-201602-1-008',
    waliKelasHp: '0821-8976-1122',
    ruangKelas: 'Ruang Umar bin Khattab',
    gedung: 'Gedung Timur Lt. 2',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-2b',
    kodeRombel: '2-B',
    namaRombel: 'Kelas 2-B (MTs Banat)',
    tingkat: 'Kelas 2',
    tingkatAngka: 2,
    unit: 'MTs',
    gender: 'Banat',
    genderLabel: 'Putri',
    waliKelas: 'Usth. Fatimah Az-Zahra, M.Pd',
    waliKelasNip: '19901104-201801-2-012',
    waliKelasHp: '0852-7788-9900',
    ruangKelas: 'Ruang Fatimah Az-Zahra',
    gedung: 'Gedung Khodijah Lt. 2',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-3a',
    kodeRombel: '3-A',
    namaRombel: 'Kelas 3-A (MTs Banin)',
    tingkat: 'Kelas 3',
    tingkatAngka: 3,
    unit: 'MTs',
    gender: 'Banin',
    genderLabel: 'Putra',
    waliKelas: 'Ust. Hasan Basri, S.Pd.I',
    waliKelasNip: '19840210-201401-1-002',
    waliKelasHp: '0813-9090-4433',
    ruangKelas: 'Ruang Utsman bin Affan',
    gedung: 'Gedung Barat Lt. 1',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-3b',
    kodeRombel: '3-B',
    namaRombel: 'Kelas 3-B (MTs Banat)',
    tingkat: 'Kelas 3',
    tingkatAngka: 3,
    unit: 'MTs',
    gender: 'Banat',
    genderLabel: 'Putri',
    waliKelas: 'Usth. Zainab binti Ali, S.Ag',
    waliKelasNip: '19880612-201602-2-007',
    waliKelasHp: '0822-4455-6677',
    ruangKelas: 'Ruang Asma binti Abu Bakar',
    gedung: 'Gedung Khodijah Lt. 3',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-4a',
    kodeRombel: '4-A',
    namaRombel: 'Kelas 4-A (MA Banin)',
    tingkat: 'Kelas 4',
    tingkatAngka: 4,
    unit: 'MA',
    gender: 'Banin',
    genderLabel: 'Putra',
    waliKelas: 'Ust. Nurul Huda, M.Ag',
    waliKelasNip: '19810905-201201-1-001',
    waliKelasHp: '0812-7070-8811',
    ruangKelas: 'Ruang Ali bin Abi Thalib',
    gedung: 'Gedung MA Lt. 1',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-4b',
    kodeRombel: '4-B',
    namaRombel: 'Kelas 4-B (MA Banat)',
    tingkat: 'Kelas 4',
    tingkatAngka: 4,
    unit: 'MA',
    gender: 'Banat',
    genderLabel: 'Putri',
    waliKelas: 'Usth. Hafshah binti Umar, S.Pd',
    waliKelasNip: '19910518-201901-2-014',
    waliKelasHp: '0853-6677-8899',
    ruangKelas: 'Ruang Ruqayyah binti Rasulullah',
    gedung: 'Gedung MA Putri Lt. 1',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-5a',
    kodeRombel: '5-A',
    namaRombel: 'Kelas 5-A (MA Banin)',
    tingkat: 'Kelas 5',
    tingkatAngka: 5,
    unit: 'MA',
    gender: 'Banin',
    genderLabel: 'Putra',
    waliKelas: 'Ust. M. Rizal, S.Si',
    waliKelasNip: '19860124-201501-1-004',
    waliKelasHp: '0813-8822-1133',
    ruangKelas: 'Ruang Khalid bin Walid',
    gedung: 'Gedung MA Lt. 2',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-5b',
    kodeRombel: '5-B',
    namaRombel: 'Kelas 5-B (MA Banat)',
    tingkat: 'Kelas 5',
    tingkatAngka: 5,
    unit: 'MA',
    gender: 'Banat',
    genderLabel: 'Putri',
    waliKelas: 'Usth. Ummu Kultsum, Lc',
    waliKelasNip: '19920310-202001-2-018',
    waliKelasHp: '0823-1122-3344',
    ruangKelas: 'Ruang Shafiyyah binti Huyay',
    gedung: 'Gedung MA Putri Lt. 2',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-6a',
    kodeRombel: '6-A',
    namaRombel: 'Kelas 6-A (MA Banin)',
    tingkat: 'Kelas 6',
    tingkatAngka: 6,
    unit: 'MA',
    gender: 'Banin',
    genderLabel: 'Putra',
    waliKelas: 'Ust. Faisal Rahman, Lc',
    waliKelasNip: '19830719-201301-1-002',
    waliKelasHp: '0812-9900-1122',
    ruangKelas: 'Ruang Shalahuddin Al-Ayyubi',
    gedung: 'Gedung Utama MA Lt. 3',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
  {
    id: 'rmb-6b',
    kodeRombel: '6-B',
    namaRombel: 'Kelas 6-B (MA Banat)',
    tingkat: 'Kelas 6',
    tingkatAngka: 6,
    unit: 'MA',
    gender: 'Banat',
    genderLabel: 'Putri',
    waliKelas: 'Usth. Maimunah Al-Anshari, M.Pd',
    waliKelasNip: '19870825-201602-2-009',
    waliKelasHp: '0813-6655-4433',
    ruangKelas: 'Ruang Juwairiyah binti Al-Harits',
    gedung: 'Gedung Utama MA Putri Lt. 3',
    kapasitas: 30,
    jumlahSantri: 0,
    totalTunggakan: 0,
    persentaseLunas: 0,
    ketuaKelas: '-',
  },
];

// Helper to generate full students roster for each rombel
export const generateRombelMembers = (): Record<string, SantriRombelMember[]> => {
  const roster: Record<string, SantriRombelMember[]> = {};

  initialRombelList.forEach((rombel) => {
    const members: SantriRombelMember[] = [];
    const isBanin = rombel.gender === 'Banin';

    // Check if initialStudents match this class and gender
    const matchedInitial = initialStudents.filter((s) => {
      const matchClass = s.kelas === rombel.tingkat;
      const matchGender = isBanin
        ? s.jenisKelamin === 'Laki-laki'
        : s.jenisKelamin === 'Perempuan';
      return matchClass && matchGender;
    });

    matchedInitial.forEach((s) => {
      members.push({
        id: s.id,
        nis: s.nis,
        nama: s.nama,
        jenisKelamin: s.jenisKelamin,
        kelas: s.kelas,
        rombelKode: rombel.kodeRombel,
        rombelId: rombel.id,
        paketMakan: s.paketMakan,
        beasiswa: s.kategoriBeasiswa,
        namaWali: s.namaWali,
        noHpWali: s.noHpWali,
        statusSPP: s.totalTunggakan === 0 ? 'Lunas' : s.totalDibayar > 0 ? 'Sebagian' : 'Menunggak',
        nominalTunggakan: s.totalTunggakan,
      });
    });

    roster[rombel.id] = members;
  });

  return roster;
};

export const initialRombelMembers = generateRombelMembers();
