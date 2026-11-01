import {
  StudentArrearItem,
  ArrearsKPIStats,
  StudentUnit,
  StudentClass,
  ArrearsCategory,
  ArrearsPriorityLevel,
} from '../types';

export const initialArrearsKPI: ArrearsKPIStats = {
  totalTunggakan: 0,
  tunggakanBulanan: 0,
  tunggakanTahunan: 0,
  santriMenunggakCount: 0,
  totalSantriAktif: 0,
  breakdownAlert: {
    lebih3Bulan: { santriCount: 0, nominal: 0 },
    duaHingga3Bulan: { santriCount: 0, nominal: 0 },
    kurang2Bulan: { santriCount: 0, nominal: 0 },
  },
  priorityStats: {
    high: {
      santriCount: 0,
      nominal: 0,
      label: 'Tunggakan > Rp3.000.000 / > 90 Hari',
    },
    medium: {
      santriCount: 0,
      nominal: 0,
      label: 'Tunggakan Rp1.000.000 – Rp3.000.000',
    },
    low: {
      santriCount: 0,
      nominal: 0,
      label: 'Tunggakan < Rp1.000.000',
    },
  },
  unitComparison: [
    {
      unit: 'MTs',
      label: 'Madrasah Tsanawiyah (MTs)',
      santriMenunggak: 0,
      totalNominal: 0,
      percentage: 0,
    },
    {
      unit: 'MA',
      label: 'Madrasah Aliyah (MA)',
      santriMenunggak: 0,
      totalNominal: 0,
      percentage: 0,
    },
  ],
  classComparison: [
    { kelas: 'Kelas 1', totalNominal: 0, santriCount: 0, persen: 0 },
    { kelas: 'Kelas 2', totalNominal: 0, santriCount: 0, persen: 0 },
    { kelas: 'Kelas 3', totalNominal: 0, santriCount: 0, persen: 0 },
    { kelas: 'Kelas 4', totalNominal: 0, santriCount: 0, persen: 0 },
    { kelas: 'Kelas 5', totalNominal: 0, santriCount: 0, persen: 0 },
    { kelas: 'Kelas 6', totalNominal: 0, santriCount: 0, persen: 0 },
  ],
  agingAnalysis: [
    {
      range: '0–30 Hari',
      nominal: 0,
      santriCount: 0,
      color: '#F59E0B',
      description: 'Tagihan bulan berjalan',
    },
    {
      range: '31–60 Hari',
      nominal: 0,
      santriCount: 0,
      color: '#EA580C',
      description: 'Jatuh tempo 1–2 bulan lalu',
    },
    {
      range: '61–90 Hari',
      nominal: 0,
      santriCount: 0,
      color: '#E11D48',
      description: 'Jatuh tempo 2–3 bulan lalu',
    },
    {
      range: '> 90 Hari',
      nominal: 0,
      santriCount: 0,
      color: '#991B1B',
      description: 'Kritis menunggak > 3 bulan',
    },
  ],
  monthlyTrend: [],
  topArrears: [],
};

// Data tunggakan santri dikosongkan (buku kas bersih)
export const initialStudentArrears: StudentArrearItem[] = [];
