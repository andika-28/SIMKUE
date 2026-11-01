import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Lock,
  Sparkles,
  CheckSquare,
  Square,
  Loader2,
  Wallet,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Step4ConfirmImportProps {
  onBackStep: () => void;
  onImportComplete: () => void;
  fileName?: string;
  totalData?: number;
  validCount?: number;
  reviewCount?: number;
  duplicateCount?: number;
  totalNominal?: number;
}

export const Step4ConfirmImport: React.FC<Step4ConfirmImportProps> = ({
  onBackStep,
  onImportComplete,
  fileName = 'pembayaran_agustus_2026.xlsx',
  totalData = 1245,
  validCount = 1220,
  reviewCount = 15,
  duplicateCount = 10,
  totalNominal = 325500000,
}) => {
  const [processOption, setProcessOption] = useState<'VALID_ONLY' | 'ALL_FLAGGED'>('VALID_ONLY');
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [currentSubStep, setCurrentSubStep] = useState<number>(1);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num).replace('IDR', 'Rp');
  };

  const handleStartImport = () => {
    if (!isAgreed) return;
    setIsProcessing(true);
    setProcessProgress(0);
    setCurrentSubStep(1);
  };

  // Simulate realistic progress
  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setProcessProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onImportComplete();
          }, 400);
          return 100;
        }

        const next = prev + 15;
        if (next >= 25 && next < 50) setCurrentSubStep(2);
        else if (next >= 50 && next < 75) setCurrentSubStep(3);
        else if (next >= 75 && next < 95) setCurrentSubStep(4);
        else if (next >= 95) setCurrentSubStep(5);

        return next > 100 ? 100 : next;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isProcessing, onImportComplete]);

  return (
    <div id="step-4-confirm-import" className="space-y-6">
      {/* PROCESSING MODAL OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            id="processing-import-modal"
            className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-6 animate-in zoom-in-95 duration-200"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center mx-auto border border-emerald-200 shadow-xs relative">
              <Loader2 className="w-8 h-8 animate-spin text-[#064E3B]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Memproses Pembayaran...
              </h3>
              <p className="text-xs text-slate-500">
                Mencatat {validCount.toLocaleString('id-ID')} transaksi ke buku kas dan memperbarui status tagihan santri
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Progress Eksekusi</span>
                <span className="text-[#064E3B] font-mono">{Math.round((processProgress / 100) * validCount)} / {validCount.toLocaleString('id-ID')} Transaksi</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-[#064E3B] h-full rounded-full transition-all duration-300 shadow-xs"
                  style={{ width: `${processProgress}%` }}
                />
              </div>
            </div>

            {/* Step Checkpoints */}
            <div className="bg-slate-50 rounded-xl p-4 text-xs space-y-2 text-left border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Membaca Data File
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">100% Selesai</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Validasi Transaksi & No. Referensi
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">100% Selesai</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Pencocokan Tagihan Santri SIMKEU
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">100% Selesai</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-2 font-medium ${currentSubStep >= 4 ? 'text-emerald-800' : 'text-slate-500'}`}>
                  {currentSubStep >= 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  )}
                  Memproses Pembayaran ke Rekening Bank
                </span>
                <span className="text-[10px] font-bold text-slate-600">{currentSubStep >= 4 ? 'Berjalan' : 'Menunggu'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-2 font-medium ${currentSubStep >= 5 ? 'text-emerald-800' : 'text-slate-400'}`}>
                  {currentSubStep >= 5 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 inline-block" />
                  )}
                  Memperbarui Laporan Keuangan & Rekonsiliasi
                </span>
                <span className="text-[10px] font-bold text-slate-400">{currentSubStep >= 5 ? 'Proses' : 'Menunggu'}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Mohon jangan menutup atau me-refresh halaman saat proses rekonsiliasi berlangsung.
            </p>
          </div>
        </div>
      )}

      {/* Main Confirmation Content */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Konfirmasi Import Pembayaran
            </h2>
            <p className="text-xs text-slate-500">
              Periksa ringkasan rekonsiliasi sebelum transaksi diproses dan mempengaruhi buku kas pesantren.
            </p>
          </div>
        </div>

        {/* SUMMARY DETAILS GRID */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Box: File & Data Summary */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ringkasan File Pembayaran
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-200 text-slate-800 font-mono">
                {fileName}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Baris Terdeteksi:</span>
                <span className="font-bold text-slate-900">{totalData.toLocaleString('id-ID')} Transaksi</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Transaksi Valid Siap Impor:
                </span>
                <span className="font-black text-emerald-700">{validCount.toLocaleString('id-ID')} Transaksi</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Perlu Validasi Manual:
                </span>
                <span className="font-bold text-amber-800">{reviewCount} Transaksi</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-rose-800 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Duplikat / Ditolak Sistem:
                </span>
                <span className="font-bold text-rose-800">{duplicateCount} Transaksi</span>
              </div>
            </div>

            {/* Total Nominal Valid */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase block">
                  Total Nominal Valid
                </span>
                <span className="text-[11px] text-emerald-800">
                  Akan dimasukkan ke buku kas
                </span>
              </div>
              <span className="text-xl font-black text-[#064E3B]">
                {formatRupiah(totalNominal)}
              </span>
            </div>
          </div>

          {/* Right Box: Processing Option */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                Opsi Pemrosesan Data
              </span>

              <div className="space-y-3">
                {/* Radio 1: Valid Only */}
                <label
                  onClick={() => setProcessOption('VALID_ONLY')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    processOption === 'VALID_ONLY'
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="process_option"
                    checked={processOption === 'VALID_ONLY'}
                    onChange={() => setProcessOption('VALID_ONLY')}
                    className="mt-0.5 text-[#064E3B] focus:ring-[#064E3B]"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">
                        Import hanya transaksi valid ({validCount.toLocaleString('id-ID')})
                      </span>
                      <span className="text-[9px] font-extrabold bg-[#064E3B] text-white px-1.5 py-0.2 rounded">
                        Direkomendasikan
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Transaksi bermasalah (25 data) tidak akan diproses dan tetap tersimpan di riwayat untuk audit atau perbaikan manual.
                    </p>
                  </div>
                </label>

                {/* Radio 2: All Flagged */}
                <label
                  onClick={() => setProcessOption('ALL_FLAGGED')}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    processOption === 'ALL_FLAGGED'
                      ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="process_option"
                    checked={processOption === 'ALL_FLAGGED'}
                    onChange={() => setProcessOption('ALL_FLAGGED')}
                    className="mt-0.5 text-amber-700 focus:ring-amber-700"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">
                      Import semua transaksi dan tandai yang bermasalah
                    </span>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Hanya untuk pengguna berwenang khusus. Transaksi ditandai sebagai status <em>Pending Audit</em>.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Rekening Tujuan Info */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-600">Rekening Tujuan:</span>
              <span className="font-bold text-slate-900">BNI Rekening 1 (0389271829)</span>
            </div>
          </div>
        </div>

        {/* Final Confirmation Checkbox */}
        <div className="mt-6 p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
          <label
            onClick={() => setIsAgreed(!isAgreed)}
            className="flex items-start gap-3 cursor-pointer select-none text-xs text-slate-800"
          >
            <div className="mt-0.5 flex-shrink-0">
              {isAgreed ? (
                <CheckSquare className="w-5 h-5 text-[#064E3B]" />
              ) : (
                <Square className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="leading-relaxed">
              <span className="font-bold text-slate-900">
                Persetujuan Otoritas Keuangan:
              </span>{' '}
              Saya telah memeriksa data pembayaran dan memahami bahwa{' '}
              <strong className="text-slate-900">{validCount.toLocaleString('id-ID')} transaksi valid</strong> akan langsung mempengaruhi status lunas tagihan santri, saldo mutasi rekening bank, dan seluruh laporan keuangan resmi PM. Raudhatussalam Mahato.
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            id="btn-back-to-preview"
            onClick={onBackStep}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            id="btn-execute-import"
            disabled={!isAgreed || isProcessing}
            onClick={handleStartImport}
            className="px-8 py-3 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Import {validCount.toLocaleString('id-ID')} Transaksi Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
