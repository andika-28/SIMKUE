import React from 'react';
import { AlertOctagon, RefreshCw, ArrowLeft, Building2 } from 'lucide-react';

interface SystemErrorViewProps {
  onRetry: () => void;
  onReturnToDashboard: () => void;
}

export const SystemErrorView: React.FC<SystemErrorViewProps> = ({
  onRetry,
  onReturnToDashboard,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm max-w-md w-full p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
          Terjadi Kesalahan
        </h3>

        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
          Sistem mengalami kendala saat memproses permintaan Anda. Silakan coba kembali atau kembali ke dashboard.
        </p>

        <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-500">
          Kode Galat: ERR_SIMKEU_SERVICE_TIMEOUT_500
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
          <button
            type="button"
            onClick={onReturnToDashboard}
            className="py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ke Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
