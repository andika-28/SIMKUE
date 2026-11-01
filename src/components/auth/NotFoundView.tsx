import React from 'react';
import { SearchX, ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  onReturnToDashboard: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onReturnToDashboard,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md w-full p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>

        <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-2">
          Status 404
        </div>

        <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
          Halaman Tidak Ditemukan
        </h3>

        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan ke modul lain dalam SIMKEU.
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={onReturnToDashboard}
            className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
