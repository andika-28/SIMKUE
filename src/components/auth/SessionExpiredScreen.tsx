import React from 'react';
import { Clock, LogIn, ShieldCheck, Building2 } from 'lucide-react';

interface SessionExpiredScreenProps {
  onReturnToLogin: () => void;
}

export const SessionExpiredScreen: React.FC<SessionExpiredScreenProps> = ({
  onReturnToLogin,
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Clock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
          Sesi Telah Berakhir
        </h3>

        <p className="text-xs text-[#64748B] mt-2 leading-relaxed max-w-xs mx-auto">
          Sesi Anda berakhir karena tidak ada aktivitas selama 30 menit. Kredensial telah diamankan secara otomatis.
        </p>

        <div className="mt-5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left text-xs flex items-center gap-2.5 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>SIMKEU PM. Raudhatussalam Mahato • Enkripsi Sesi Berakhir</span>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onReturnToLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10"
          >
            <LogIn className="w-4 h-4 text-emerald-300" />
            <span>Masuk Kembali</span>
          </button>
        </div>
      </div>
    </div>
  );
};
