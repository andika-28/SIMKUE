import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  AlertTriangle,
  ArrowLeft,
  Save,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  Receipt,
  Sparkles,
  Lock,
} from 'lucide-react';
import { GenerateBillingConfig } from '../../types';
import { generateMonthlyBillsData } from '../../data/monthlyBillingData';

interface Step4KonfirmasiProps {
  config: GenerateBillingConfig;
  onBack: () => void;
  onSaveDraft: () => void;
  onConfirmGenerate: () => void;
}

export const Step4Konfirmasi: React.FC<Step4KonfirmasiProps> = ({
  config,
  onBack,
  onSaveDraft,
  onConfirmGenerate,
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Compute actual summary
  const { totalKotor, totalDiskon, totalAkhir, totalSantri } = useMemo(() => {
    const raw = generateMonthlyBillsData(config.bulan);
    let kotor = 0;
    let diskon = 0;

    raw.forEach((r) => {
      let fee = 0;
      let disc = 0;
      if (r.paketMakan === 'Paket A') {
        fee = config.paketANominal;
        disc = config.paketADiscount;
      } else if (r.paketMakan === 'Paket B') {
        fee = config.paketBNominal;
        disc = config.paketBDiscount;
      } else {
        fee = config.paketCNominal;
        disc = config.paketCDiscount;
      }

      if (r.nis === '2026003' && disc === 0 && config.paketCDiscount === 0) {
        disc = 150000;
      }

      kotor += config.sppNominal + fee + config.listrikAirNominal;
      diskon += disc;
    });

    return {
      totalSantri: raw.length,
      totalKotor: kotor,
      totalDiskon: diskon,
      totalAkhir: kotor - diskon,
    };
  }, [config]);

  const handleExecuteGenerate = () => {
    if (!hasAgreed) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmGenerate();
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Confirmation Card */}
      <div
        id="card-step4-konfirmasi"
        className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        {/* Card Header with prominent visual */}
        <div className="p-6 md:p-8 border-b border-[#E2E8F0] bg-slate-50/60 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-[#064E3B] mx-auto flex items-center justify-center shadow-xs">
            <FileCheck className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mt-4">
            Konfirmasi Penerbitan Tagihan
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1 max-w-md mx-auto">
            Anda akan menerbitkan tagihan bulanan massal untuk periode:
          </p>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100/70 border border-emerald-300 text-[#064E3B] font-extrabold text-sm rounded-full mt-2.5">
            <Calendar className="w-4 h-4" />
            <span>{config.bulan}</span>
          </div>
        </div>

        {/* Financial Summary Table Box */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3.5">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Jumlah Santri Ditagih:</span>
              <span className="font-bold text-[#0F172A] text-sm">{totalSantri} Santri Aktif</span>
            </div>

            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Total Tagihan (Kotor):</span>
              <span className="font-bold text-slate-800">
                Rp {totalKotor.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Total Potongan Diskon:</span>
              <span className={`font-bold ${totalDiskon > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                {totalDiskon > 0 ? `- Rp ${totalDiskon.toLocaleString('id-ID')}` : 'Rp 0'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Batas Tanggal Jatuh Tempo:</span>
              <span className="font-bold text-slate-800">{config.tanggalJatuhTempo}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-extrabold text-[#064E3B] text-sm">
                Total Tagihan Akhir (Wajib Bayar):
              </span>
              <span className="font-black text-[#064E3B] text-lg">
                Rp {totalAkhir.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Security & System Warning Panel */}
          <div
            id="warning-panel-konfirmasi"
            className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Peringatan Keamanan Transaksi Finansial</span>
            </div>
            <ul className="text-xs text-amber-800 space-y-1 pl-6 list-disc">
              <li>Pastikan seluruh data nominal dan rombel santri telah diverifikasi dengan benar.</li>
              <li>Tagihan yang telah diterbitkan akan menjadi data piutang resmi dalam sistem keuangan.</li>
              <li>Untuk mencegah tagihan ganda, sistem mengunci periode <strong>{config.bulan}</strong> sehingga tidak dapat dibuat dua kali.</li>
            </ul>
          </div>

          {/* Verification Checkbox */}
          <div className="pt-2">
            <label
              htmlFor="checkbox-persetujuan"
              className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                id="checkbox-persetujuan"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
                className="w-4 h-4 text-[#064E3B] border-slate-300 rounded focus:ring-[#064E3B] mt-0.5"
              />
              <div className="text-xs text-[#0F172A] leading-relaxed">
                <strong className="font-bold">Saya menyatakan telah memeriksa data dengan teliti</strong> dan menyetujui penerbitan tagihan bulanan sejumlah <strong>300 santri</strong> untuk periode <strong>{config.bulan}</strong>.
              </div>
            </label>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-6 border-t border-[#E2E8F0] bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            id="btn-step4-back"
            onClick={onBack}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-step4-draft"
              onClick={onSaveDraft}
              disabled={isProcessing}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors shadow-2xs disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Simpan Draft</span>
            </button>

            <button
              type="button"
              id="btn-execute-generate"
              onClick={handleExecuteGenerate}
              disabled={!hasAgreed || isProcessing}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                hasAgreed && !isProcessing
                  ? 'bg-[#064E3B] hover:bg-[#047857] text-white hover:shadow-sm active:scale-98 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses 300 Tagihan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 300 Tagihan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
