import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';

interface SessionTimeoutModalProps {
  onStayLoggedIn: () => void;
  onLogoutNow: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  onStayLoggedIn,
  onLogoutNow,
}) => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onLogoutNow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onLogoutNow]);

  const formatSec = (sec: number) => {
    const s = sec % 60;
    return `00:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-amber-200 shadow-2xl max-w-md w-full p-6 sm:p-8 text-center my-8 animate-in zoom-in-95 duration-150">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Clock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-[#1E293B] tracking-tight">
          Sesi Anda Akan Berakhir
        </h3>

        <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
          Anda tidak melakukan aktivitas selama beberapa waktu. Untuk keamanan data keuangan pesantren, sesi Anda akan berakhir dalam:
        </p>

        {/* Big Timer */}
        <div className="my-5 p-4 rounded-xl bg-amber-50/80 border border-amber-200 inline-block w-full">
          <div className="text-3xl font-black font-mono text-amber-800 tracking-wider">
            {formatSec(countdown)}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onLogoutNow}
            className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sekarang</span>
          </button>
          <button
            type="button"
            onClick={onStayLoggedIn}
            className="py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tetap Masuk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
