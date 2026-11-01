import React from 'react';
import { AlertCircle, Save, X, ArrowRight } from 'lucide-react';

interface UnsavedChangesModalProps {
  onStayOnPage: () => void;
  onSaveAndContinue: () => void;
  onDiscardAndLeave: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  onStayOnPage,
  onSaveAndContinue,
  onDiscardAndLeave,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-amber-200 shadow-2xl max-w-md w-full p-6 text-left animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">
              Perubahan Belum Disimpan
            </h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Anda memiliki perubahan data keuangan yang belum disimpan. Jika Anda meninggalkan halaman ini, data yang baru diisi akan hilang.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={onStayOnPage}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
          >
            Tetap di Halaman
          </button>
          <button
            type="button"
            onClick={onDiscardAndLeave}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition"
          >
            Keluar Tanpa Menyimpan
          </button>
          <button
            type="button"
            onClick={onSaveAndContinue}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan & Lanjutkan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
