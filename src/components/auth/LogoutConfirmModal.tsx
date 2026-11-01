import React from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

interface LogoutConfirmModalProps {
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  onClose,
  onConfirmLogout,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-150">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto mb-3.5">
          <LogOut className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-black text-[#1E293B]">
          Keluar dari SIMKEU?
        </h3>

        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
          Pastikan semua pekerjaan telah disimpan sebelum keluar dari sistem keuangan pesantren.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirmLogout}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
