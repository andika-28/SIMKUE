import {
  BillingDiscount,
  DiscountAdjustmentHistory,
  DiscountKPIStats,
} from '../types';

export const initialDiscountKPI: DiscountKPIStats = {
  totalDiskonBulanIni: 0,
  periodeBulanIni: 'Bulan Ini',
  jumlahDiskonAktif: 0,
  santriTerdampakBulanIni: 0,
  totalDiskonTahunIni: 0,
  tahunAjaran: '2026 / 2027',
};

export const initialDiscounts: BillingDiscount[] = [];

export const initialDiscountAdjustmentHistory: DiscountAdjustmentHistory[] = [];
export const initialAdjustmentHistories: DiscountAdjustmentHistory[] = [];

export const standardBillingRates = {
  spp: {
    MTs: 200000,
    MA: 250000,
    default: 200000,
  },
  uangMakan: {
    'Paket A': 450000,
    'Paket B': 500000,
    'Paket C': 600000,
    default: 600000,
  },
  listrikAir: {
    default: 50000,
  },
};

export const studentCountByTarget = {
  semuaSantri: 0,
  paketMakan: {
    'Paket A': 0,
    'Paket B': 0,
    'Paket C': 0,
  },
  unit: {
    MTs: 0,
    MA: 0,
  },
  kelas: {
    'Kelas 1': 0,
    'Kelas 2': 0,
    'Kelas 3': 0,
    'Kelas 4': 0,
    'Kelas 5': 0,
    'Kelas 6': 0,
  },
};
