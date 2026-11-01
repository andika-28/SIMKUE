import React, { useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { CurrentAuthUser } from '../../types';

interface LoginSuccessTransitionProps {
  user: CurrentAuthUser;
  onTransitionComplete: () => void;
}

export const LoginSuccessTransition: React.FC<LoginSuccessTransitionProps> = ({
  user,
  onTransitionComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTransitionComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onTransitionComplete]);

  const getDestinationLabel = () => {
    if (user.role === 'Administrator') return 'Dashboard Utama (Akses Penuh)';
    if (user.role === 'Bendahara') return 'Dashboard Keuangan (Operasional Kasir & Rekening)';
    return 'Dashboard Eksekutif (Ringkasan Fiskal & Laporan)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-2xl p-8 max-w-sm w-full mx-4 text-center transform animate-in zoom-in-95 duration-200">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-5 shadow-inner animate-bounce">
          <CheckCircle2 className="w-9 h-9 text-[#064E3B]" />
        </div>

        <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
          Login Berhasil
        </h3>
        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
          Menyiapkan sistem untuk Anda...
        </p>

        {/* User Card */}
        <div className="mt-5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3 text-left">
          <div className={`w-9 h-9 rounded-full ${user.avatarColor} flex items-center justify-center font-bold text-xs shadow-xs`}>
            {user.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#1E293B] truncate">{user.name}</p>
            <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">
              {user.role} • {user.title}
            </p>
          </div>
        </div>

        {/* Destination Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate">Membuka: {getDestinationLabel()}</span>
        </div>
      </div>
    </div>
  );
};
