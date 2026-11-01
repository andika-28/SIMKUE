import React from 'react';
import {
  Building2,
  FileText,
  CalendarDays,
  Users,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { YearlyBillingSummary } from '../../types';

interface YearlyCompositionCardsProps {
  summary: YearlyBillingSummary;
}

export const YearlyCompositionCards: React.FC<YearlyCompositionCardsProps> = ({ summary }) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#064E3B]" />
            <span>Komposisi Tagihan Tahunan</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Struktur komponen biaya tahunan dan fleksibilitas termin pembayaran per semester.
          </p>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>Dapat Dicicil per Semester</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CARD 1: Uang Pembangunan */}
        <div
          id="card-komposisi-pembangunan"
          className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
        >
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                  Komponen 1
                </span>
                <h4 className="text-base font-bold text-[#0F172A] mt-2">
                  Uang Pembangunan
                </h4>
                <p className="text-xs text-[#64748B]">Santri Baru & Santri Lama</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-200 group-hover:bg-blue-100 transition-colors">
                <Building2 className="w-5 h-5 text-blue-700" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-500 font-medium">Total Penerimaan:</span>
              <div className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                {formatRupiah(summary.pembangunanTotal)}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Santri Baru:
              </span>
              <span className="font-bold text-blue-900">Rp 1.500.000 / santri</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Santri Lama:
              </span>
              <span className="font-bold text-slate-800">Rp 400.000 / santri</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Uang Kertas */}
        <div
          id="card-komposisi-kertas"
          className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
        >
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                  Komponen 2
                </span>
                <h4 className="text-base font-bold text-[#0F172A] mt-2">
                  Uang Kertas
                </h4>
                <p className="text-xs text-[#64748B]">Rp 500.000 / Tahun</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200 group-hover:bg-emerald-100 transition-colors">
                <FileText className="w-5 h-5 text-emerald-700" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-500 font-medium">Total Penerimaan:</span>
              <div className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                {formatRupiah(summary.kertasTotal)}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="font-semibold text-slate-700">Semester Ganjil:</span>
              <span className="font-bold text-emerald-800">Rp 250.000</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="font-semibold text-slate-700">Semester Genap:</span>
              <span className="font-bold text-emerald-800">Rp 250.000</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Uang Kegiatan */}
        <div
          id="card-komposisi-kegiatan"
          className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
        >
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                  Komponen 3
                </span>
                <h4 className="text-base font-bold text-[#0F172A] mt-2">
                  Uang Kegiatan
                </h4>
                <p className="text-xs text-[#64748B]">Rp 400.000 / Tahun</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200 group-hover:bg-amber-100 transition-colors">
                <CalendarDays className="w-5 h-5 text-amber-700" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-500 font-medium">Total Penerimaan:</span>
              <div className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                {formatRupiah(summary.kegiatanTotal)}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="font-semibold text-slate-700">Semester Ganjil:</span>
              <span className="font-bold text-amber-800">Rp 200.000</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="font-semibold text-slate-700">Semester Genap:</span>
              <span className="font-bold text-amber-800">Rp 200.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
