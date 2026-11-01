import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, HelpCircle, PhoneCall } from 'lucide-react';
import { UserRoleType } from '../../types';

interface AccessDeniedViewProps {
  currentRole: UserRoleType;
  attemptedPageName?: string;
  onReturnToDashboard: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentRole,
  attemptedPageName = 'Halaman Sistem Terbatas',
  onReturnToDashboard,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md w-full p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Shield Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
          Akses Tidak Diizinkan
        </h3>

        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
          Anda tidak memiliki hak akses untuk membuka modul <strong>{attemptedPageName}</strong>.
        </p>

        {/* Current Role Badge */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 inline-block text-xs">
          <span className="text-slate-500 font-medium">Role Anda saat ini: </span>
          <span className="font-bold text-[#064E3B] px-2 py-0.5 rounded-full bg-emerald-100/80 ml-1">
            {currentRole}
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          Jika Anda merasa membutuhkan akses ini, silakan hubungi Administrator.
        </p>

        {/* Contact help */}
        <div className="mt-4 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-[11px] text-emerald-800 flex items-center justify-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
          <span>Admin IT Pesantren: 0812-7890-1234</span>
        </div>

        {/* Button */}
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
