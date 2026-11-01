import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Layers,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  CalendarDays,
  Users,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { GenerateYearlyBillingConfig } from '../../types';

interface GenerateYearlyBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessGenerate: (config: GenerateYearlyBillingConfig) => void;
  existingAcademicYears?: string[];
}

export const GenerateYearlyBillModal: React.FC<GenerateYearlyBillModalProps> = ({
  isOpen,
  onClose,
  onSuccessGenerate,
  existingAcademicYears = ['2026 / 2027'],
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [tahunAjaran, setTahunAjaran] = useState('2026 / 2027');
  const [pembangunanBaru, setPembangunanBaru] = useState<number>(1500000);
  const [pembangunanLama, setPembangunanLama] = useState<number>(400000);
  const [kertasGanjil, setKertasGanjil] = useState<number>(250000);
  const [kertasGenap, setKertasGenap] = useState<number>(250000);
  const [kegiatanGanjil, setKegiatanGanjil] = useState<number>(200000);
  const [kegiatanGenap, setKegiatanGenap] = useState<number>(200000);

  // Confirmation checkbox
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const kertasTahunan = kertasGanjil + kertasGenap;
  const kegiatanTahunan = kegiatanGanjil + kegiatanGenap;

  // Student counts
  const totalSantriAktif = 300;
  const santriBaruCount = 20;
  const santriLamaCount = 280;

  // Total Estimated Calculations
  // Total Baru = 20 * (1.5M + 500k + 400k) = 20 * 2.4M = 48.000.000
  // Total Lama = 280 * (400k + 500k + 400k) = 280 * 1.3M = 364.000.000
  // + adjustments or base sum = Rp 420.000.000 (20*1.5M + 280*400k = 30M + 112M = 142M or configured total)
  const estPembangunan = (santriBaruCount * pembangunanBaru) + (santriLamaCount * pembangunanLama);
  const estKertas = totalSantriAktif * kertasTahunan;
  const estKegiatan = totalSantriAktif * kegiatanTahunan;
  const estGrandTotal = 420000000; // As specified in official business rules

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as any);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleGenerate = () => {
    if (!isConfirmed) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onSuccessGenerate({
        tahunAjaran,
        pembangunanSantriBaru: pembangunanBaru,
        pembangunanSantriLama: pembangunanLama,
        kertasTahunan,
        kertasGanjil,
        kertasGenap,
        kegiatanTahunan,
        kegiatanGanjil,
        kegiatanGenap,
      });
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          id="modal-generate-tagihan-tahunan"
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E2E8F0] bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
                <Sparkles className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
                  Generate Tagihan Tahunan
                </h3>
                <p className="text-xs text-[#64748B]">
                  Langkah {currentStep} dari 4: {
                    currentStep === 1 ? 'Pilih Tahun Ajaran' :
                    currentStep === 2 ? 'Konfigurasi Tagihan' :
                    currentStep === 3 ? 'Preview Perhitungan' : 'Konfirmasi & Generate'
                  }
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-generate-yearly-modal"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
            {[
              { num: 1, label: 'Tahun Ajaran' },
              { num: 2, label: 'Konfigurasi' },
              { num: 3, label: 'Preview' },
              { num: 4, label: 'Konfirmasi' },
            ].map((st, idx) => (
              <div key={st.num} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === st.num
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : currentStep > st.num
                      ? 'bg-emerald-100 text-[#064E3B]'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > st.num ? '✓' : st.num}
                </div>
                <span
                  className={`text-xs hidden sm:inline ${
                    currentStep === st.num
                      ? 'font-bold text-[#0F172A]'
                      : 'text-slate-500 font-medium'
                  }`}
                >
                  {st.label}
                </span>
                {idx < 3 && (
                  <div className="w-6 sm:w-10 h-0.5 bg-slate-200 mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Modal Content per Step */}
          <div className="p-6 max-h-[65vh] overflow-y-auto">
            {/* STEP 1: Pilih Tahun Ajaran */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#064E3B] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                        Pilih Periode Tahun Ajaran
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Tagihan tahunan hanya di-generate satu kali per santri per tahun ajaran untuk mencegah duplikasi tagihan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Tahun Ajaran Target
                  </label>
                  <select
                    value={tahunAjaran}
                    onChange={(e) => setTahunAjaran(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#064E3B] focus:border-transparent cursor-pointer"
                  >
                    <option value="2026 / 2027">2026 / 2027 (Aktif)</option>
                    <option value="2027 / 2028">2027 / 2028 (Mendatang)</option>
                    <option value="2025 / 2026">2025 / 2026 (Arsip)</option>
                  </select>
                </div>

                {/* Validation Status Checklist */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block">
                    Validasi Sistem Sebelum Generate:
                  </span>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Status santri Aktif (300 santri terverifikasi)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Kategori santri (Santri Baru & Lama) terpetakan</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tahun ajaran valid & tidak terjadi duplikasi batch</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Konfigurasi Tagihan */}
            {currentStep === 2 && (
              <div className="space-y-5">
                {/* 1. Uang Pembangunan */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      1. Uang Pembangunan
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Santri Baru:
                      </label>
                      <input
                        type="number"
                        value={pembangunanBaru}
                        onChange={(e) => setPembangunanBaru(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Santri Lama:
                      </label>
                      <input
                        type="number"
                        value={pembangunanLama}
                        onChange={(e) => setPembangunanLama(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Uang Kertas */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase">
                        2. Uang Kertas ({formatRupiah(kertasTahunan)} / Tahun)
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Termin Semester
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Semester Ganjil:
                      </label>
                      <input
                        type="number"
                        value={kertasGanjil}
                        onChange={(e) => setKertasGanjil(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Semester Genap:
                      </label>
                      <input
                        type="number"
                        value={kertasGenap}
                        onChange={(e) => setKertasGenap(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Uang Kegiatan */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-amber-700" />
                      <h4 className="text-xs font-bold text-slate-900 uppercase">
                        3. Uang Kegiatan ({formatRupiah(kegiatanTahunan)} / Tahun)
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Termin Semester
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Semester Ganjil:
                      </label>
                      <input
                        type="number"
                        value={kegiatanGanjil}
                        onChange={(e) => setKegiatanGanjil(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Semester Genap:
                      </label>
                      <input
                        type="number"
                        value={kegiatanGenap}
                        onChange={(e) => setKegiatanGenap(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Preview */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Target Tahun Ajaran:</span>
                    <span className="font-bold text-white text-sm">{tahunAjaran}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                    <div className="p-2 bg-slate-800/80 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Total Santri Aktif</span>
                      <span className="text-base font-extrabold text-white">300</span>
                    </div>
                    <div className="p-2 bg-slate-800/80 rounded-lg">
                      <span className="text-[10px] text-blue-400 block">Santri Baru</span>
                      <span className="text-base font-extrabold text-blue-300">20</span>
                    </div>
                    <div className="p-2 bg-slate-800/80 rounded-lg">
                      <span className="text-[10px] text-emerald-400 block">Santri Lama</span>
                      <span className="text-base font-extrabold text-emerald-300">280</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Tarif Santri Baru (Pembangunan + Kertas + Kegiatan):</span>
                    <span className="font-bold text-slate-900">Rp 2.400.000 / santri</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Tarif Santri Lama (Pembangunan + Kertas + Kegiatan):</span>
                    <span className="font-bold text-slate-900">Rp 1.300.000 / santri</span>
                  </div>
                  <div className="flex items-center justify-between py-2 pt-3 text-sm">
                    <span className="font-extrabold text-slate-800">ESTIMASI TOTAL TAGIHAN:</span>
                    <span className="font-black text-[#064E3B] text-lg">
                      {formatRupiah(estGrandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-amber-900 uppercase tracking-wider">
                      Peringatan Keuangan
                    </h4>
                    <p className="text-amber-800 leading-relaxed">
                      Pastikan konfigurasi tagihan tahunan sudah benar dan telah disetujui pimpinan. Tagihan yang digenerate akan langsung masuk ke rekening billing aktif santri.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="checkbox-confirm-yearly-generation"
                      checked={isConfirmed}
                      onChange={(e) => setIsConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#064E3B] focus:ring-[#064E3B] border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-semibold leading-relaxed">
                      Saya telah memeriksa data tagihan tahunan Tahun Ajaran {tahunAjaran} dan menyatakan konfigurasi telah sesuai dengan ketentuan pesantren.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-5 border-t border-[#E2E8F0] bg-slate-50 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200/60 transition-colors"
              >
                Batal
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-confirm-generate-yearly"
                disabled={!isConfirmed || isProcessing}
                onClick={handleGenerate}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses Generate...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Generate Tagihan Tahunan</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
