import React from 'react';
import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Info,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { GenerateBillingConfig } from '../../types';

interface Step1PilihPeriodeProps {
  config: GenerateBillingConfig;
  onChangeConfig: (newConfig: Partial<GenerateBillingConfig>) => void;
  onNext: () => void;
  onViewExistingBills: (period: string) => void;
  existingPeriods: string[];
}

const MONTH_OPTIONS = [
  'Juli 2026',
  'Agustus 2026',
  'September 2026',
  'Oktober 2026',
  'November 2026',
  'Desember 2026',
  'Januari 2027',
  'Februari 2027',
  'Maret 2027',
  'April 2027',
  'Mei 2027',
  'Juni 2027',
];

export const Step1PilihPeriode: React.FC<Step1PilihPeriodeProps> = ({
  config,
  onChangeConfig,
  onNext,
  onViewExistingBills,
  existingPeriods,
}) => {
  const isAlreadyGenerated = existingPeriods.includes(config.bulan);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main Centered Card */}
      <div
        id="card-step1-pilih-periode"
        className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        {/* Card Header */}
        <div className="p-6 md:p-8 border-b border-[#E2E8F0] bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] border border-emerald-200 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
                Pilih Periode Tagihan
              </h2>
              <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
                Tentukan bulan dan tahun untuk tagihan yang akan dibuat.
              </p>
            </div>
          </div>
        </div>

        {/* Card Form Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Duplicate Warning if Already Generated */}
          {isAlreadyGenerated && (
            <div
              id="duplicate-billing-warning"
              className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-amber-900">
                    Tagihan untuk {config.bulan} sudah pernah dibuat.
                  </div>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Jumlah Tagihan: <strong className="font-bold">300 Santri</strong>. Sistem mencegah pembuatan tagihan duplikat untuk periode yang sama.
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="btn-view-existing-bills"
                onClick={() => onViewExistingBills(config.bulan)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs whitespace-nowrap"
              >
                <span>Lihat Tagihan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field: Tahun Ajaran */}
            <div>
              <label
                htmlFor="input-tahun-ajaran"
                className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2"
              >
                Tahun Ajaran
              </label>
              <select
                id="input-tahun-ajaran"
                value={config.tahunAjaran}
                onChange={(e) => onChangeConfig({ tahunAjaran: e.target.value })}
                className="w-full h-11 px-3.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent cursor-pointer shadow-2xs"
              >
                <option value="2026 / 2027">2026 / 2027</option>
                <option value="2025 / 2026">2025 / 2026 (Arsip)</option>
              </select>
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Tahun ajaran operasional aktif pesantren.
              </span>
            </div>

            {/* Field: Bulan Tagihan */}
            <div>
              <label
                htmlFor="input-bulan-tagihan"
                className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2"
              >
                Bulan Tagihan
              </label>
              <select
                id="input-bulan-tagihan"
                value={config.bulan}
                onChange={(e) => onChangeConfig({ bulan: e.target.value })}
                className={`w-full h-11 px-3.5 text-sm bg-white border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent cursor-pointer shadow-2xs ${
                  isAlreadyGenerated
                    ? 'border-amber-300 text-amber-900 bg-amber-50/30'
                    : 'border-[#E2E8F0] text-[#0F172A]'
                }`}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m} {existingPeriods.includes(m) ? '— (Sudah Dibuat)' : ''}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Pilih periode bulan penagihan santri.
              </span>
            </div>

            {/* Field: Tanggal Jatuh Tempo */}
            <div className="md:col-span-2">
              <label
                htmlFor="input-jatuh-tempo"
                className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2"
              >
                Tanggal Jatuh Tempo Pembayaran
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="input-jatuh-tempo"
                  value={config.tanggalJatuhTempo}
                  onChange={(e) => onChangeConfig({ tanggalJatuhTempo: e.target.value })}
                  placeholder="Contoh: 10 September 2026"
                  className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent shadow-2xs"
                />
                <Clock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              </div>
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Batas akhir waktu pelunasan sebelum tagihan dinyatakan terlambat/menunggak.
              </span>
            </div>
          </div>

          {/* System Validation Section / Information Panel */}
          <div
            id="panel-informasi-periode"
            className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#064E3B]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Informasi Periode & Validasi Sistem
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Data Siap Diproses
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <div className="text-[11px] font-medium text-[#64748B]">Santri Aktif</div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">300 Santri</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Menerima tagihan</div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <div className="text-[11px] font-medium text-[#64748B]">Santri Lulus</div>
                <div className="text-base font-bold text-slate-700 mt-0.5">0 Santri</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Tidak ditagih</div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <div className="text-[11px] font-medium text-[#64748B]">Santri Pindah</div>
                <div className="text-base font-bold text-slate-700 mt-0.5">0 Santri</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Tidak ditagih</div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <div className="text-[11px] font-medium text-[#64748B]">Tagihan Eksisting</div>
                <div
                  className={`text-base font-bold mt-0.5 ${
                    isAlreadyGenerated ? 'text-amber-600' : 'text-slate-700'
                  }`}
                >
                  {isAlreadyGenerated ? '300 Record' : '0 (Belum ada)'}
                </div>
                <div className="text-[10px] text-[#64748B] mt-0.5">
                  {isAlreadyGenerated ? 'Duplikat terdeteksi' : 'Bebas duplikasi'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-6 border-t border-[#E2E8F0] bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-[#64748B]">
            Langkah 1 dari 4: Penentuan Periode & Tanggal
          </div>

          <button
            type="button"
            id="btn-step1-next"
            onClick={onNext}
            disabled={isAlreadyGenerated}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs ${
              isAlreadyGenerated
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#064E3B] hover:bg-[#047857] text-white hover:shadow-sm active:scale-98'
            }`}
          >
            <span>Lanjutkan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
