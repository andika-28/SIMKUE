import React from 'react';
import { Wrench, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

interface MaintenanceModeViewProps {
  onReturnToLogin: () => void;
}

export const MaintenanceModeView: React.FC<MaintenanceModeViewProps> = ({
  onReturnToLogin,
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Pesantren Branding */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            R
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-[#064E3B] leading-tight">
              PM. RAUDHATUSSALAM MAHATO
            </h4>
            <p className="text-[10px] text-slate-500">
              Sistem Informasi Keuangan Pesantren
            </p>
          </div>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Wrench className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
          Sistem Sedang Dalam Pemeliharaan
        </h3>

        <p className="text-xs text-[#64748B] mt-2 leading-relaxed max-w-sm mx-auto">
          Kami sedang melakukan pembaruan rutin untuk meningkatkan performa dan keamanan sistem keuangan pesantren.
        </p>

        <p className="text-xs font-medium text-slate-600 mt-2">
          Silakan coba kembali beberapa saat lagi.
        </p>

        <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Integritas database transaksi aman dan terbackup</span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </button>
          <button
            type="button"
            onClick={onReturnToLogin}
            className="py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ke Halaman Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
