import {
  YearlyBillRow,
  YearlyBillingSummary,
  StudentUnit,
  StudentClass,
} from '../types';

export const initialYearlySummary: YearlyBillingSummary = {
  tahunAjaran: '2026 / 2027',
  totalTagihanNominal: 0,
  sudahDibayarNominal: 0,
  sisaTagihanNominal: 0,
  santriBelumLunasCount: 0,
  persentasePembayaran: 0,
  totalSantri: 0,
  santriLunasCount: 0,
  santriSebagianCount: 0,
  santriBelumBayarCount: 0,
  pembangunanTotal: 0,
  kertasTotal: 0,
  kegiatanTotal: 0,
  semesterGanjil: {
    total: 0,
    terbayar: 0,
    sisa: 0,
    persen: 0,
  },
  semesterGenap: {
    total: 0,
    terbayar: 0,
    sisa: 0,
    persen: 0,
  },
  tunggakanMTs: 0,
  tunggakanMA: 0,
};

export const sampleYearlyBills: YearlyBillRow[] = [];

export function generateAllYearlyBills(year?: string): YearlyBillRow[] {
  return [];
}

export function generateYearlyBillsData(year?: string): YearlyBillRow[] {
  return [];
}
