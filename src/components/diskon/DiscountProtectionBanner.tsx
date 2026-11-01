import React from 'react';
import { ShieldCheck, AlertCircle, Sparkles, CheckCircle2, Lock, FileText } from 'lucide-react';

export const DiscountProtectionBanner: React.FC = () => {
  return (
    <div
      id="card-discount-protection-guideline"
      className="bg-emerald-900/10 border border-emerald-200 rounded-xl p-5 text-xs text-slate-700 space-y-3"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center font-bold flex-shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">
            Pedoman & Integritas Manajemen Diskon Tagihan
          </h4>
          <p className="text-[11px] text-slate-600">
            SIMKEU PM. RAUDHATUSSALAM MAHATO • Tata Kelola Keuangan Pesantren
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Periode Spesifik</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Diskon berlaku untuk bulan terpilih saja dan tidak mengubah tarif master dasar.
          </p>
        </div>

        <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Lock className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Batas Maksimal</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Nominal potongan tidak boleh melebihi tarif tagihan normal yang berlaku.
          </p>
        </div>

        <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <FileText className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Jejak Audit</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Semua pembuatan dan revisi diskon terekam dengan nama petugas dan alasan resmi.
          </p>
        </div>

        <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B]" />
            <span>Proteksi Tagihan</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Tagihan yang sudah terbit diubah melalui modul penyesuaian (adjustment) resmi.
          </p>
        </div>
      </div>
    </div>
  );
};
